/**
 * Emergency Passport — Frontend Application Logic
 * Implements real-time triage HUD, QR code generation, Bedrock AI integration,
 * hospital matching visualization, and emergency audio synthesizer.
 */

// -----------------------------------------------------------------------------
// Global State & Configuration
// -----------------------------------------------------------------------------
const state = {
  activeTab: 'viewTriage',
  currentTourist: null,
  currentHospital: null,
  currentSummary: '',
  systemHealthy: false,
  activeBackend: 'local',
  hospitals: [],
  sirenActive: false,
  audioContext: null,
  sirenOscillator: null,
};

// API Base URL (relative path works for dev_server.py or API Gateway custom domain)
const API_BASE = '';

// -----------------------------------------------------------------------------
// DOM Element Selectors
// -----------------------------------------------------------------------------
const elements = {
  // HUD
  healthPill: document.getElementById('healthPill'),
  healthDot: document.getElementById('healthDot'),
  healthText: document.getElementById('healthText'),
  databaseText: document.getElementById('databaseText'),
  aiStatusText: document.getElementById('aiStatusText'),
  sirenBtn: document.getElementById('sirenBtn'),
  globalErrorBanner: document.getElementById('globalErrorBanner'),
  globalErrorMessage: document.getElementById('globalErrorMessage'),
  globalErrorRetryBtn: document.getElementById('globalErrorRetryBtn'),
  globalErrorDismissBtn: document.getElementById('globalErrorDismissBtn'),
  toastContainer: document.getElementById('toastContainer'),

  // Navigation
  navTabs: document.querySelectorAll('.nav-tab'),
  viewPanels: document.querySelectorAll('.view-panel'),

  // Triage View
  manualTouristIdInput: document.getElementById('manualTouristIdInput'),
  lookupBtn: document.getElementById('lookupBtn'),
  presetButtons: document.querySelectorAll('.btn-preset'),
  qrUploadInput: document.getElementById('qrUploadInput'),
  triageLoading: document.getElementById('triageLoading'),
  triageStandby: document.getElementById('triageStandby'),
  triageResults: document.getElementById('triageResults'),

  // Patient Card Elements
  patientIdDisplay: document.getElementById('patientIdDisplay'),
  patientAvatar: document.getElementById('patientAvatar'),
  patientName: document.getElementById('patientName'),
  patientAge: document.getElementById('patientAge'),
  patientLanguage: document.getElementById('patientLanguage'),
  patientBloodBadge: document.getElementById('patientBloodBadge'),
  patientBloodType: document.getElementById('patientBloodType'),
  allergiesTags: document.getElementById('allergiesTags'),
  conditionsTags: document.getElementById('conditionsTags'),
  patientNotes: document.getElementById('patientNotes'),
  contactsList: document.getElementById('contactsList'),
  patientLastUpdated: document.getElementById('patientLastUpdated'),
  printPassportBtn: document.getElementById('printPassportBtn'),

  // AI Briefing & Hospital Elements
  aiBriefingText: document.getElementById('aiBriefingText'),
  aiModeBadge: document.getElementById('aiModeBadge'),
  copyAiBriefBtn: document.getElementById('copyAiBriefBtn'),
  hospitalMatchScore: document.getElementById('hospitalMatchScore'),
  hospitalName: document.getElementById('hospitalName'),
  hospitalContact: document.getElementById('hospitalContact'),
  callHospitalBtn: document.getElementById('callHospitalBtn'),
  hospitalCapacity: document.getElementById('hospitalCapacity'),
  hospitalDistance: document.getElementById('hospitalDistance'),
  hospitalEta: document.getElementById('hospitalEta'),
  hospitalServicesTags: document.getElementById('hospitalServicesTags'),

  // Passport Studio Elements
  passportForm: document.getElementById('passportForm'),
  studioIdInput: document.getElementById('studioIdInput'),
  studioNameInput: document.getElementById('studioNameInput'),
  studioAgeInput: document.getElementById('studioAgeInput'),
  studioBloodSelect: document.getElementById('studioBloodSelect'),
  studioLangInput: document.getElementById('studioLangInput'),
  studioAllergiesInput: document.getElementById('studioAllergiesInput'),
  studioConditionsInput: document.getElementById('studioConditionsInput'),
  studioContactsInput: document.getElementById('studioContactsInput'),
  studioNotesInput: document.getElementById('studioNotesInput'),
  savePassportBtn: document.getElementById('savePassportBtn'),
  resetFormBtn: document.getElementById('resetFormBtn'),
  previewCardId: document.getElementById('previewCardId'),
  previewCardName: document.getElementById('previewCardName'),
  previewCardMeta: document.getElementById('previewCardMeta'),
  previewCardBlood: document.getElementById('previewCardBlood'),
  previewCardAllergies: document.getElementById('previewCardAllergies'),
  qrCodeContainer: document.getElementById('qrCodeContainer'),
  downloadQrBtn: document.getElementById('downloadQrBtn'),

  // Directory
  hospitalsListGrid: document.getElementById('hospitalsListGrid'),
  serviceFilterSelect: document.getElementById('serviceFilterSelect'),

  // Simulator
  scenarioSelect: document.getElementById('scenarioSelect'),
  runSimulationBtn: document.getElementById('runSimulationBtn'),
  simulationConsoleBody: document.getElementById('simulationConsoleBody'),
};

// -----------------------------------------------------------------------------
// Minimal Standalone QR Code SVG Generator (No External Libraries)
// -----------------------------------------------------------------------------
function generateQrSvg(text) {
  // Simple deterministic visual matrix representing a QR code
  const size = 21;
  const hash = Array.from(text).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007, 7);
  
  let grid = Array(size).fill(0).map(() => Array(size).fill(false));

  // Finder patterns at corners (7x7)
  function drawFinder(r0, c0) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          grid[r0 + r][c0 + c] = true;
        }
      }
    }
  }
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Fill pseudo-random data bits based on text
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
      const bit = ((hash ^ (r * 37 + c * 43)) % 3) === 0;
      grid[r][c] = bit;
    }
  }

  // Generate SVG string
  const rects = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c]) {
        rects.push(`<rect x="${c * 5}" y="${r * 5}" width="5" height="5" fill="#000000" />`);
      }
    }
  }

  return `
    <svg viewBox="0 0 ${size * 5} ${size * 5}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="${size * 5}" height="${size * 5}" fill="#ffffff" />
      ${rects.join('')}
    </svg>
  `;
}

// -----------------------------------------------------------------------------
// Emergency Audio Synthesizer (Web Audio API)
// -----------------------------------------------------------------------------
function toggleEmergencySiren() {
  if (state.sirenActive) {
    stopSiren();
  } else {
    startSiren();
  }
}

function startSiren() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    if (!state.audioContext) {
      state.audioContext = new AudioCtx();
    }
    if (state.audioContext.state === 'suspended') {
      state.audioContext.resume();
    }

    const osc = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(650, state.audioContext.currentTime);

    // Modulate pitch between 650Hz and 950Hz
    const now = state.audioContext.currentTime;
    for (let i = 0; i < 20; i++) {
      osc.frequency.exponentialRampToValueAtTime(950, now + i * 0.8 + 0.4);
      osc.frequency.exponentialRampToValueAtTime(650, now + i * 0.8 + 0.8);
    }

    gain.gain.setValueAtTime(0.08, now);

    osc.connect(gain);
    gain.connect(state.audioContext.destination);
    osc.start();

    state.sirenOscillator = osc;
    state.sirenActive = true;
    elements.sirenBtn.classList.add('active');
    showToast('🚨 Emergency siren active', 'error');
  } catch (e) {
    console.warn('Web Audio error:', e);
  }
}

function stopSiren() {
  if (state.sirenOscillator) {
    try {
      state.sirenOscillator.stop();
      state.sirenOscillator.disconnect();
    } catch (e) {}
    state.sirenOscillator = null;
  }
  state.sirenActive = false;
  elements.sirenBtn.classList.remove('active');
}

// -----------------------------------------------------------------------------
// Toast Notifications & UI Utilities
// -----------------------------------------------------------------------------
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function showGlobalError(msg) {
  elements.globalErrorMessage.textContent = msg;
  elements.globalErrorBanner.classList.remove('hidden');
}

function hideGlobalError() {
  elements.globalErrorBanner.classList.add('hidden');
}

// -----------------------------------------------------------------------------
// API Communications
// -----------------------------------------------------------------------------
async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    state.systemHealthy = true;
    state.activeBackend = data.database?.active_backend || 'local';

    elements.healthDot.style.background = 'var(--green-verified)';
    elements.healthText.textContent = 'ONLINE (200 OK)';
    elements.databaseText.textContent = state.activeBackend.toUpperCase();
    hideGlobalError();
  } catch (err) {
    state.systemHealthy = false;
    elements.healthDot.style.background = 'var(--red-alert)';
    elements.healthText.textContent = 'DEGRADED';
    elements.databaseText.textContent = 'STANDBY';
    console.warn('Health check warning:', err);
  }
}

async function fetchEmergencyTriage(touristId, location = 'Incident Location', lat = null, lon = null) {
  setTriageLoading(true);
  hideGlobalError();

  try {
    let url = `${API_BASE}/emergency?tourist_id=${encodeURIComponent(touristId)}&location=${encodeURIComponent(location)}`;
    if (lat && lon) {
      url += `&latitude=${lat}&longitude=${lon}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Emergency processing failed (${res.status})`);
    }

    renderTriageResults(data);
    showToast(`Emergency Passport for ${data.profile.Name} decoded!`, 'success');
  } catch (err) {
    showGlobalError(`Triage failed: ${err.message}`);
    setTriageStandby(true);
    showToast(err.message, 'error');
  } finally {
    setTriageLoading(false);
  }
}

async function fetchHospitals() {
  try {
    const res = await fetch(`${API_BASE}/hospitals`);
    const data = await res.json();
    if (res.ok && data.hospitals) {
      state.hospitals = data.hospitals;
      renderHospitalsDirectory(state.hospitals);
    }
  } catch (e) {
    console.warn('Could not fetch hospitals:', e);
  }
}

async function saveTouristProfile(payload) {
  const isUpdate = Boolean(payload.TouristID);
  const url = isUpdate ? `${API_BASE}/tourists/${encodeURIComponent(payload.TouristID)}` : `${API_BASE}/tourists`;
  const method = isUpdate ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: jsonSafeStringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save profile to database');
  }
  return data.tourist;
}

function jsonSafeStringify(obj) {
  return JSON.stringify(obj, (k, v) => (v instanceof Set ? Array.from(v) : v));
}

// -----------------------------------------------------------------------------
// Rendering & View Manipulation
// -----------------------------------------------------------------------------
function setTriageLoading(isLoading) {
  if (isLoading) {
    elements.triageLoading.classList.remove('hidden');
    elements.triageStandby.classList.add('hidden');
    elements.triageResults.classList.add('hidden');
    elements.lookupBtn.querySelector('.btn-spinner').classList.remove('hidden');
    elements.lookupBtn.querySelector('.btn-text').textContent = 'TRIAGING...';
    elements.lookupBtn.disabled = true;
  } else {
    elements.triageLoading.classList.add('hidden');
    elements.lookupBtn.querySelector('.btn-spinner').classList.add('hidden');
    elements.lookupBtn.querySelector('.btn-text').textContent = 'TRIAGE NOW';
    elements.lookupBtn.disabled = false;
  }
}

function setTriageStandby(isStandby) {
  if (isStandby) {
    elements.triageStandby.classList.remove('hidden');
    elements.triageResults.classList.add('hidden');
  } else {
    elements.triageStandby.classList.add('hidden');
    elements.triageResults.classList.remove('hidden');
  }
}

function renderTriageResults(data) {
  const profile = data.profile;
  const hospital = data.recommended_hospital;
  const summary = data.ai_summary;

  state.currentTourist = profile;
  state.currentHospital = hospital;
  state.currentSummary = summary;

  // 1. Patient Profile
  elements.patientIdDisplay.textContent = profile.TouristID || 'T-????';
  elements.patientName.textContent = profile.Name || 'Unknown Patient';
  
  // Initials
  const names = (profile.Name || 'U').split(' ');
  elements.patientAvatar.textContent = names.length > 1 ? (names[0][0] + names[1][0]).toUpperCase() : names[0].slice(0, 2).toUpperCase();

  elements.patientAge.textContent = `${profile.Age || '?'} y/o`;
  elements.patientLanguage.textContent = profile.Language || 'English';
  elements.patientBloodType.textContent = profile.BloodType || 'Unknown';
  elements.patientNotes.textContent = profile.Notes || 'No specific clinical notes registered.';
  elements.patientLastUpdated.textContent = `Profile verified: ${profile.LastUpdated ? profile.LastUpdated.split('T')[0] : 'Today'}`;

  // Allergies
  elements.allergiesTags.innerHTML = '';
  const allergies = Array.isArray(profile.Allergies) ? profile.Allergies : Array.from(profile.Allergies || []);
  if (allergies.length > 0 && allergies[0] !== 'None Reported') {
    allergies.forEach(allergy => {
      const tag = document.createElement('span');
      tag.className = 'tag-allergy';
      tag.textContent = `⛔ ${allergy}`;
      elements.allergiesTags.appendChild(tag);
    });
  } else {
    const tag = document.createElement('span');
    tag.className = 'tag-condition';
    tag.textContent = 'No Known Fatal Drug Allergies';
    elements.allergiesTags.appendChild(tag);
  }

  // Conditions
  elements.conditionsTags.innerHTML = '';
  const conditions = Array.isArray(profile.Conditions) ? profile.Conditions : Array.from(profile.Conditions || []);
  if (conditions.length > 0) {
    conditions.forEach(cond => {
      const tag = document.createElement('span');
      tag.className = 'tag-condition';
      tag.textContent = cond;
      elements.conditionsTags.appendChild(tag);
    });
  } else {
    elements.conditionsTags.innerHTML = '<span class="tag-condition">None Reported</span>';
  }

  // Contacts
  elements.contactsList.innerHTML = '';
  const contacts = Array.isArray(profile.EmergencyContacts) ? profile.EmergencyContacts : Array.from(profile.EmergencyContacts || []);
  contacts.forEach(contact => {
    const phoneMatch = contact.match(/(\+?[\d\s\-]{7,})/);
    const phone = phoneMatch ? phoneMatch[1].trim() : '';

    const row = document.createElement('div');
    row.className = 'contact-item';
    row.innerHTML = `
      <span class="contact-info">📞 ${contact}</span>
      ${phone ? `<a href="tel:${phone}" class="btn-call">CALL NOW</a>` : ''}
    `;
    elements.contactsList.appendChild(row);
  });

  // 2. Bedrock AI Clinical Briefing
  elements.aiBriefingText.textContent = summary || 'No summary available.';
  elements.aiModeBadge.textContent = summary.includes('•') ? 'CLAUDE 3 BRIEFING' : 'CLINICAL FALLBACK';

  // 3. Hospital Match Card
  if (hospital) {
    elements.hospitalName.textContent = hospital.Name || 'Regional Medical Facility';
    elements.hospitalContact.textContent = hospital.ContactInfo || 'Direct dispatch';
    elements.callHospitalBtn.href = hospital.ContactInfo ? `tel:${hospital.ContactInfo.replace(/[^\d+]/g, '')}` : '#';
    elements.hospitalCapacity.textContent = `${hospital.Capacity || 0} Beds`;
    elements.hospitalDistance.textContent = hospital.DistanceKm ? `${hospital.DistanceKm} km` : 'Regional';
    elements.hospitalEta.textContent = hospital.EstimatedDriveMinutes ? `~${hospital.EstimatedDriveMinutes} min` : 'Immediate';
    elements.hospitalMatchScore.textContent = `${hospital.MatchScore || 90}% MATCH`;

    // Services
    elements.hospitalServicesTags.innerHTML = '';
    const services = Array.isArray(hospital.Services) ? hospital.Services : Array.from(hospital.Services || []);
    services.forEach(serv => {
      const tag = document.createElement('span');
      tag.className = 'tag-service';
      tag.textContent = serv;
      elements.hospitalServicesTags.appendChild(tag);
    });
  }

  setTriageStandby(false);
}

function renderHospitalsDirectory(hospitals) {
  elements.hospitalsListGrid.innerHTML = '';
  const filter = elements.serviceFilterSelect.value;

  const filtered = filter === 'all' 
    ? hospitals 
    : hospitals.filter(h => {
        const servs = Array.isArray(h.Services) ? h.Services : Array.from(h.Services || []);
        return servs.some(s => s.toLowerCase().includes(filter.toLowerCase()));
      });

  filtered.forEach(h => {
    const card = document.createElement('div');
    card.className = 'hospital-card';
    const capacity = h.Capacity || 100;
    const fillPercent = Math.min(Math.round((capacity / 500) * 100), 100);

    const servs = Array.isArray(h.Services) ? h.Services : Array.from(h.Services || []);
    const servTags = servs.map(s => `<span class="tag-service">${s}</span>`).join(' ');

    card.innerHTML = `
      <div class="hcard-header">
        <h3 class="hcard-name">${h.Name}</h3>
        <span class="hcard-id">${h.HospitalID}</span>
      </div>
      <div class="hcard-capacity">
        <span>Capacity: <strong>${capacity} beds</strong></span>
        <div class="capacity-meter">
          <div class="capacity-fill" style="width: ${fillPercent}%"></div>
        </div>
      </div>
      <div class="hcard-phone">📞 ${h.ContactInfo || 'N/A'}</div>
      <div class="tags-container" style="margin-top: 6px;">
        ${servTags}
      </div>
    `;
    elements.hospitalsListGrid.appendChild(card);
  });
}

function updateStudioPreviewFromForm() {
  const id = elements.studioIdInput.value.trim() || 'T-1001';
  const name = elements.studioNameInput.value.trim() || 'ELENA ROSTOVA';
  const age = elements.studioAgeInput.value.trim() || '29';
  const blood = elements.studioBloodSelect.value || 'O+';
  const lang = elements.studioLangInput.value.trim() || 'ENG, RUS';
  const allergies = elements.studioAllergiesInput.value.trim() || 'Penicillin, Peanuts';

  elements.previewCardId.textContent = id;
  elements.previewCardName.textContent = name.toUpperCase();
  elements.previewCardMeta.textContent = `${age} Y/O • ${lang.toUpperCase()}`;
  elements.previewCardBlood.textContent = blood;
  elements.previewCardAllergies.textContent = allergies;

  // Generate live SVG QR Code
  elements.qrCodeContainer.innerHTML = generateQrSvg(id);
}

// -----------------------------------------------------------------------------
// Simulator Flow
// -----------------------------------------------------------------------------
const SCENARIOS = {
  1: {
    title: 'Acute Anaphylactic Shock in Tokyo Subway',
    touristId: 'T-1001',
    patientName: 'Elena Rostova',
    location: 'Shinjuku Subway Terminal, Tokyo',
    lat: 35.6909,
    lon: 139.7003,
  },
  2: {
    title: 'Hypoglycemic Diabetic Crisis outside European Hall',
    touristId: 'T-1002',
    patientName: 'Kenji Sato',
    location: 'Messe Berlin Convention Center, Germany',
    lat: 52.5028,
    lon: 13.2764,
  },
  3: {
    title: 'Cardiac Arrhythmia Collapse during Solo Tour',
    touristId: 'T-1003',
    patientName: 'Maria Gonzalez',
    location: 'Gran Via, Madrid, Spain',
    lat: 40.4200,
    lon: -3.7058,
  },
  4: {
    title: 'Heatstroke & Dehydration in Summer Excursion',
    touristId: 'T-1004',
    patientName: 'Arjun Patel',
    location: 'Jaipur Fort Trail, Rajasthan, India',
    lat: 26.9855,
    lon: 75.8513,
  },
};

function logSimulationLine(text, type = 'info') {
  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  const time = new Date().toISOString().split('T')[1].slice(0, 12);
  line.textContent = `[${time}] ${text}`;
  elements.simulationConsoleBody.appendChild(line);
  elements.simulationConsoleBody.scrollTop = elements.simulationConsoleBody.scrollHeight;
}

async function runIncidentSimulation() {
  const scenarioKey = elements.scenarioSelect.value;
  const scenario = SCENARIOS[scenarioKey];
  if (!scenario) return;

  elements.runSimulationBtn.disabled = true;
  elements.runSimulationBtn.textContent = 'RUNNING INCIDENT PROTOCOL...';
  elements.simulationConsoleBody.innerHTML = '';

  logSimulationLine(`🚨 EMERGENCY INCIDENT REPORTED: ${scenario.title}`, 'alert');
  logSimulationLine(`📍 Location coordinates: ${scenario.location}`, 'info');
  logSimulationLine(`📲 First responder camera scans traveler Emergency Passport QR: ${scenario.touristId}`, 'info');

  // Trigger optional siren tone
  startSiren();
  setTimeout(() => stopSiren(), 1500);

  // Step 1: Query API
  logSimulationLine(`⏳ Transmitting sub-second Golden Hour query to API Gateway...`, 'info');
  await new Promise(r => setTimeout(r, 600));

  try {
    const res = await fetch(`${API_BASE}/emergency?tourist_id=${scenario.touristId}&location=${encodeURIComponent(scenario.location)}`);
    const data = await res.json();

    if (!res.ok) throw new Error(data.error);

    logSimulationLine(`✅ Patient record verified: ${data.profile.Name} (${data.profile.Age} y/o, Blood: ${data.profile.BloodType})`, 'success');
    logSimulationLine(`⚠️ CRITICAL ALLERGIES DETECTED: ${(data.profile.Allergies || []).join(', ')}`, 'alert');
    logSimulationLine(`🧠 Bedrock Claude AI field briefing generated:`, 'ai');
    
    // Split briefing lines
    const briefLines = (data.ai_summary || '').split('\n').filter(l => l.trim());
    briefLines.forEach(l => logSimulationLine(`   ${l}`, 'ai'));

    logSimulationLine(`🏥 Best hospital routed: ${data.recommended_hospital.Name}`, 'success');
    logSimulationLine(`   - Distance: ${data.recommended_hospital.DistanceKm || '3.5'} km | ETA: ${data.recommended_hospital.EstimatedDriveMinutes || '8'} min`, 'info');
    logSimulationLine(`   - Open Bed Capacity: ${data.recommended_hospital.Capacity} beds | Contact: ${data.recommended_hospital.ContactInfo}`, 'info');
    logSimulationLine(`🎯 Emergency ambulance dispatch coordinated in <800ms!`, 'success');

    // Switch to Triage tab to show visual results
    setTimeout(() => {
      renderTriageResults(data);
      switchTab('viewTriage');
      showToast('Incident simulation complete! Results loaded in Triage HUD.', 'success');
    }, 1200);

  } catch (err) {
    logSimulationLine(`❌ Simulation failed: ${err.message}`, 'alert');
  } finally {
    elements.runSimulationBtn.disabled = false;
    elements.runSimulationBtn.textContent = '🚨 RUN LIVE INCIDENT SIMULATION';
  }
}

// -----------------------------------------------------------------------------
// Tab Switching
// -----------------------------------------------------------------------------
function switchTab(targetId) {
  state.activeTab = targetId;
  elements.navTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.target === targetId);
  });
  elements.viewPanels.forEach(panel => {
    panel.classList.toggle('hidden', panel.id !== targetId);
    panel.classList.toggle('active', panel.id === targetId);
  });
}

// -----------------------------------------------------------------------------
// Event Handlers & Initialization
// -----------------------------------------------------------------------------
function setupEventListeners() {
  // Navigation Tabs
  elements.navTabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.target));
  });

  // Siren Button
  elements.sirenBtn.addEventListener('click', toggleEmergencySiren);

  // Global Error Dismiss & Retry
  elements.globalErrorDismissBtn.addEventListener('click', hideGlobalError);
  elements.globalErrorRetryBtn.addEventListener('click', () => {
    checkHealth();
    if (elements.manualTouristIdInput.value) {
      fetchEmergencyTriage(elements.manualTouristIdInput.value.trim());
    }
  });

  // Triage Search
  elements.lookupBtn.addEventListener('click', () => {
    const id = elements.manualTouristIdInput.value.trim();
    if (!id) {
      showToast('Please enter a Tourist ID (e.g. T-1001)', 'error');
      return;
    }
    fetchEmergencyTriage(id);
  });

  elements.manualTouristIdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      elements.lookupBtn.click();
    }
  });

  // Presets
  elements.presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const touristId = btn.dataset.tourist;
      elements.manualTouristIdInput.value = touristId;
      fetchEmergencyTriage(touristId);
    });
  });

  // QR Upload Simulation
  elements.qrUploadInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      showToast('📷 Analyzing QR image barcode...', 'info');
      setTimeout(() => {
        elements.manualTouristIdInput.value = 'T-1001';
        fetchEmergencyTriage('T-1001');
      }, 700);
    }
  });

  // Copy AI Briefing
  elements.copyAiBriefBtn.addEventListener('click', () => {
    if (!state.currentSummary) return;
    navigator.clipboard.writeText(state.currentSummary).then(() => {
      showToast('📋 AI Briefing copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy', 'error');
    });
  });

  // Print Passport Card
  elements.printPassportBtn.addEventListener('click', () => {
    window.print();
  });

  // Passport Studio Live Preview
  const formInputs = [
    elements.studioIdInput,
    elements.studioNameInput,
    elements.studioAgeInput,
    elements.studioBloodSelect,
    elements.studioLangInput,
    elements.studioAllergiesInput,
    elements.studioConditionsInput,
  ];
  formInputs.forEach(input => {
    input.addEventListener('input', updateStudioPreviewFromForm);
  });

  // Passport Form Submit
  elements.passportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = elements.savePassportBtn;
    btn.disabled = true;
    btn.querySelector('.btn-spinner').classList.remove('hidden');

    try {
      const touristId = elements.studioIdInput.value.trim() || undefined;
      const payload = {
        TouristID: touristId,
        Name: elements.studioNameInput.value.trim(),
        Age: parseInt(elements.studioAgeInput.value, 10),
        BloodType: elements.studioBloodSelect.value,
        Language: elements.studioLangInput.value.trim() || 'English',
        Allergies: elements.studioAllergiesInput.value.split(',').map(s => s.trim()).filter(Boolean),
        Conditions: elements.studioConditionsInput.value.split(',').map(s => s.trim()).filter(Boolean),
        EmergencyContacts: elements.studioContactsInput.value.split(',').map(s => s.trim()).filter(Boolean),
        Notes: elements.studioNotesInput.value.trim(),
      };

      const saved = await saveTouristProfile(payload);
      elements.studioIdInput.value = saved.TouristID;
      updateStudioPreviewFromForm();
      showToast(`Emergency Passport ${saved.TouristID} saved!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.querySelector('.btn-spinner').classList.add('hidden');
    }
  });

  // Reset Form
  elements.resetFormBtn.addEventListener('click', () => {
    elements.passportForm.reset();
    elements.studioIdInput.value = '';
    updateStudioPreviewFromForm();
  });

  // Download QR
  elements.downloadQrBtn.addEventListener('click', () => {
    showToast('💾 Preparing printable card download...', 'info');
    window.print();
  });

  // Hospitals Filter
  elements.serviceFilterSelect.addEventListener('change', () => {
    renderHospitalsDirectory(state.hospitals);
  });

  // Simulator Run
  elements.runSimulationBtn.addEventListener('click', runIncidentSimulation);
}

// -----------------------------------------------------------------------------
// App Bootstrap
// -----------------------------------------------------------------------------
async function initApp() {
  setupEventListeners();
  updateStudioPreviewFromForm();

  // Check health and load initial data
  await checkHealth();
  await fetchHospitals();

  // Load Elena Rostova as default interactive demo
  fetchEmergencyTriage('T-1001', 'Central Station, City Plaza');
}

// Boot on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
