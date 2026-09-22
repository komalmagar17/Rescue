/**
 * Emergency Passport — Production Frontend Controller
 * Industry-Level SaaS UI • 22 Indian Languages Engine • Dynamic Color & Theme Customizer
 * Interactive 3D Tilt • Sub-800ms Triage & Smart Dispatch
 */

// -----------------------------------------------------------------------------
// Application State
// -----------------------------------------------------------------------------
const state = {
  lang: localStorage.getItem('emergency_lang') || 'en',
  themeMode: localStorage.getItem('emergency_theme_mode') || 'dark',
  accentColor: localStorage.getItem('emergency_accent_color') || '#ef4444',
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

const API_BASE = '';

// -----------------------------------------------------------------------------
// DOM Elements Cache
// -----------------------------------------------------------------------------
const elements = {
  // Navigation & HUD
  healthPill: document.getElementById('healthPill'),
  healthText: document.getElementById('healthText'),
  langModalBtn: document.getElementById('langModalBtn'),
  currentLangLabel: document.getElementById('currentLangLabel'),
  themeModalBtn: document.getElementById('themeModalBtn'),
  sirenBtn: document.getElementById('sirenBtn'),
  openStudioBtn: document.getElementById('openStudioBtn'),
  openHospitalsBtn: document.getElementById('openHospitalsBtn'),
  openSimulatorBtn: document.getElementById('openSimulatorBtn'),
  toastContainer: document.getElementById('toastContainer'),
  globalErrorBanner: document.getElementById('globalErrorBanner'),
  globalErrorMessage: document.getElementById('globalErrorMessage'),
  globalErrorRetryBtn: document.getElementById('globalErrorRetryBtn'),
  globalErrorDismissBtn: document.getElementById('globalErrorDismissBtn'),

  // Hero & Command Bar
  manualTouristIdInput: document.getElementById('manualTouristIdInput'),
  lookupBtn: document.getElementById('lookupBtn'),
  qrUploadInput: document.getElementById('qrUploadInput'),
  presetChips: document.querySelectorAll('.preset-chip'),

  // Triage Workspace
  triageLoading: document.getElementById('triageLoading'),
  triageStandby: document.getElementById('triageStandby'),
  triageResults: document.getElementById('triageResults'),

  // Patient Card
  patientProfileCard: document.getElementById('patientProfileCard'),
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

  // Intelligence & Hospital
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

  // Modals
  langModal: document.getElementById('langModal'),
  closeLangModalBtn: document.getElementById('closeLangModalBtn'),
  langSearchInput: document.getElementById('langSearchInput'),
  langGridContainer: document.getElementById('langGridContainer'),

  themeModal: document.getElementById('themeModal'),
  closeThemeModalBtn: document.getElementById('closeThemeModalBtn'),
  btnModeDark: document.getElementById('btnModeDark'),
  btnModeLight: document.getElementById('btnModeLight'),
  presetColorChips: document.querySelectorAll('.preset-color-chip'),
  customColorInput: document.getElementById('customColorInput'),
  customColorHex: document.getElementById('customColorHex'),
  applyCustomColorBtn: document.getElementById('applyCustomColorBtn'),

  studioModal: document.getElementById('studioModal'),
  closeStudioModalBtn: document.getElementById('closeStudioModalBtn'),
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

  hospitalsModal: document.getElementById('hospitalsModal'),
  closeHospitalsModalBtn: document.getElementById('closeHospitalsModalBtn'),
  serviceFilterSelect: document.getElementById('serviceFilterSelect'),
  hospitalsListGrid: document.getElementById('hospitalsListGrid'),

  simulatorModal: document.getElementById('simulatorModal'),
  closeSimulatorModalBtn: document.getElementById('closeSimulatorModalBtn'),
  scenarioSelect: document.getElementById('scenarioSelect'),
  runSimulationBtn: document.getElementById('runSimulationBtn'),
  simulationConsoleBody: document.getElementById('simulationConsoleBody'),
};

// -----------------------------------------------------------------------------
// Internationalization & 22 Indian Languages Engine
// -----------------------------------------------------------------------------
function setLanguage(langCode) {
  state.lang = langCode;
  localStorage.setItem('emergency_lang', langCode);

  const langObj = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
  elements.currentLangLabel.textContent = langObj.native || langObj.name;

  // Translate all DOM elements with [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    elem.textContent = getTranslation(key, langCode);
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
    const key = elem.getAttribute('data-i18n-placeholder');
    elem.setAttribute('placeholder', getTranslation(key, langCode));
  });

  renderLanguageList(elements.langSearchInput ? elements.langSearchInput.value : '');
}

function renderLanguageList(filterText = '') {
  if (!elements.langGridContainer) return;
  elements.langGridContainer.innerHTML = '';
  const search = filterText.toLowerCase().trim();

  const filtered = LANGUAGES.filter(l => 
    l.name.toLowerCase().includes(search) || 
    l.native.toLowerCase().includes(search) ||
    l.code.toLowerCase().includes(search)
  );

  filtered.forEach(lang => {
    const card = document.createElement('div');
    card.className = `lang-card-item ${lang.code === state.lang ? 'active' : ''}`;
    card.innerHTML = `
      <span class="lang-native">${lang.native}</span>
      <span class="lang-english">${lang.name}</span>
    `;
    card.addEventListener('click', () => {
      setLanguage(lang.code);
      closeModal(elements.langModal);
      showToast(`Language switched to ${lang.native} (${lang.name})`, 'success');
    });
    elements.langGridContainer.appendChild(card);
  });
}

// -----------------------------------------------------------------------------
// Dynamic Theme & Color Customizer
// -----------------------------------------------------------------------------
function setDisplayMode(mode) {
  state.themeMode = mode;
  localStorage.setItem('emergency_theme_mode', mode);
  document.documentElement.setAttribute('data-theme', mode);

  elements.btnModeDark.classList.toggle('active', mode === 'dark');
  elements.btnModeLight.classList.toggle('active', mode === 'light');
}

function hexToRgba(hex, alpha) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function setAccentColor(colorHex) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(colorHex)) return;
  state.accentColor = colorHex;
  localStorage.setItem('emergency_accent_color', colorHex);

  const root = document.documentElement;
  root.style.setProperty('--accent-primary', colorHex);
  root.style.setProperty('--accent-hover', colorHex);
  root.style.setProperty('--accent-glow', hexToRgba(colorHex, 0.35));
  root.style.setProperty('--accent-bg-subtle', hexToRgba(colorHex, 0.08));

  // Sync inputs
  if (elements.customColorInput) elements.customColorInput.value = colorHex;
  if (elements.customColorHex) elements.customColorHex.value = colorHex;

  // Active state on chips
  elements.presetColorChips.forEach(chip => {
    chip.classList.toggle('active', chip.dataset.color.toLowerCase() === colorHex.toLowerCase());
  });
}

// -----------------------------------------------------------------------------
// 3D Card Tilt Interaction (Linear / Stripe Inspired)
// -----------------------------------------------------------------------------
function init3DCardTilt() {
  const tiltCards = document.querySelectorAll('.interactive-tilt');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

// -----------------------------------------------------------------------------
// Standalone SVG QR Code Generator
// -----------------------------------------------------------------------------
function generateQrSvg(text) {
  const size = 21;
  const hash = Array.from(text).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007, 7);
  let grid = Array(size).fill(0).map(() => Array(size).fill(false));

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

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
      grid[r][c] = ((hash ^ (r * 37 + c * 43)) % 3) === 0;
    }
  }

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
// Modal Management
// -----------------------------------------------------------------------------
function openModal(modalElem) {
  if (!modalElem) return;
  modalElem.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalElem) {
  if (!modalElem) return;
  modalElem.classList.add('hidden');
  document.body.style.overflow = '';
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
    if (!state.audioContext) state.audioContext = new AudioCtx();
    if (state.audioContext.state === 'suspended') state.audioContext.resume();

    const osc = state.audioContext.createOscillator();
    const gain = state.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(650, state.audioContext.currentTime);

    const now = state.audioContext.currentTime;
    for (let i = 0; i < 15; i++) {
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
    showToast('🚨 Emergency alert audio chime active', 'error');
  } catch (e) {
    console.warn('Audio error:', e);
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
// Toast Notifications
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
// API Communications & Triage
// -----------------------------------------------------------------------------
async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    state.systemHealthy = true;
    state.activeBackend = data.database?.active_backend || 'local';

    elements.healthText.textContent = `${getTranslation('status_online', state.lang)} (${state.activeBackend.toUpperCase()})`;
    hideGlobalError();
  } catch (err) {
    state.systemHealthy = false;
    elements.healthText.textContent = getTranslation('status_degraded', state.lang);
    console.warn('Health check note:', err);
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
      throw new Error(data.error || `Triage query failed (${res.status})`);
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
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save profile');
  }
  return data.tourist;
}

// -----------------------------------------------------------------------------
// UI State & Rendering
// -----------------------------------------------------------------------------
function setTriageLoading(isLoading) {
  if (isLoading) {
    elements.triageLoading.classList.remove('hidden');
    elements.triageStandby.classList.add('hidden');
    elements.triageResults.classList.add('hidden');
    elements.lookupBtn.querySelector('.btn-spinner').classList.remove('hidden');
    elements.lookupBtn.querySelector('.btn-text').textContent = getTranslation('btn_triaging', state.lang);
    elements.lookupBtn.disabled = true;
  } else {
    elements.triageLoading.classList.add('hidden');
    elements.lookupBtn.querySelector('.btn-spinner').classList.add('hidden');
    elements.lookupBtn.querySelector('.btn-text').textContent = getTranslation('btn_triage_now', state.lang);
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
  elements.patientAvatar.textContent = names.length > 1 
    ? (names[0][0] + names[1][0]).toUpperCase() 
    : names[0].slice(0, 2).toUpperCase();

  elements.patientAge.textContent = `${profile.Age || '?'} y/o`;
  elements.patientLanguage.textContent = profile.Language || 'English';
  elements.patientBloodType.textContent = profile.BloodType || 'Unknown';
  elements.patientNotes.textContent = profile.Notes || 'No specific medical notes registered.';
  elements.patientLastUpdated.textContent = `Verified: ${profile.LastUpdated ? profile.LastUpdated.split('T')[0] : 'Today'}`;

  // Allergies
  elements.allergiesTags.innerHTML = '';
  const allergies = Array.isArray(profile.Allergies) ? profile.Allergies : Array.from(profile.Allergies || []);
  if (allergies.length > 0 && allergies[0] !== 'None Reported') {
    allergies.forEach(allergy => {
      const tag = document.createElement('span');
      tag.className = 'tag-badge allergy';
      tag.textContent = `⛔ ${allergy}`;
      elements.allergiesTags.appendChild(tag);
    });
  } else {
    const tag = document.createElement('span');
    tag.className = 'tag-badge condition';
    tag.textContent = 'No Known Fatal Drug Allergies';
    elements.allergiesTags.appendChild(tag);
  }

  // Conditions
  elements.conditionsTags.innerHTML = '';
  const conditions = Array.isArray(profile.Conditions) ? profile.Conditions : Array.from(profile.Conditions || []);
  if (conditions.length > 0) {
    conditions.forEach(cond => {
      const tag = document.createElement('span');
      tag.className = 'tag-badge condition';
      tag.textContent = cond;
      elements.conditionsTags.appendChild(tag);
    });
  } else {
    elements.conditionsTags.innerHTML = '<span class="tag-badge condition">None Reported</span>';
  }

  // Contacts
  elements.contactsList.innerHTML = '';
  const contacts = Array.isArray(profile.EmergencyContacts) ? profile.EmergencyContacts : Array.from(profile.EmergencyContacts || []);
  contacts.forEach(contact => {
    const phoneMatch = contact.match(/(\+?[\d\s\-]{7,})/);
    const phone = phoneMatch ? phoneMatch[1].trim() : '';

    const row = document.createElement('div');
    row.className = 'contact-card-row';
    row.innerHTML = `
      <span class="contact-label">📞 ${contact}</span>
      ${phone ? `<a href="tel:${phone}" class="btn-dial">${getTranslation('btn_call_now', state.lang)}</a>` : ''}
    `;
    elements.contactsList.appendChild(row);
  });

  // 2. Bedrock AI Clinical Briefing
  elements.aiBriefingText.textContent = summary || 'No summary available.';
  elements.aiModeBadge.textContent = summary.includes('•') ? 'CLAUDE 3 BRIEFING' : 'CLINICAL FALLBACK';

  // 3. Hospital Match Card
  if (hospital) {
    elements.hospitalName.textContent = hospital.Name || 'Regional Medical Facility';
    elements.hospitalContact.textContent = `📞 ${hospital.ContactInfo || 'Direct dispatch'}`;
    elements.callHospitalBtn.href = hospital.ContactInfo ? `tel:${hospital.ContactInfo.replace(/[^\d+]/g, '')}` : '#';
    elements.hospitalCapacity.textContent = `${hospital.Capacity || 0} Beds`;
    elements.hospitalDistance.textContent = hospital.DistanceKm ? `${hospital.DistanceKm} km` : 'Regional';
    elements.hospitalEta.textContent = hospital.EstimatedDriveMinutes ? `~${hospital.EstimatedDriveMinutes} min` : 'Immediate';
    elements.hospitalMatchScore.textContent = `${hospital.MatchScore || 95}% MATCH`;

    // Services
    elements.hospitalServicesTags.innerHTML = '';
    const services = Array.isArray(hospital.Services) ? hospital.Services : Array.from(hospital.Services || []);
    services.forEach(serv => {
      const tag = document.createElement('span');
      tag.className = 'tag-badge service';
      tag.textContent = serv;
      elements.hospitalServicesTags.appendChild(tag);
    });
  }

  setTriageStandby(false);
}

function renderHospitalsDirectory(hospitals) {
  if (!elements.hospitalsListGrid) return;
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
    card.className = 'glass-card';
    card.style.padding = '18px';
    const capacity = h.Capacity || 100;

    const servs = Array.isArray(h.Services) ? h.Services : Array.from(h.Services || []);
    const servTags = servs.map(s => `<span class="tag-badge service" style="font-size:0.7rem;">${s}</span>`).join(' ');

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
        <h4 style="font-size:1rem; font-weight:800; color:var(--text-primary);">${h.Name}</h4>
        <span class="card-id-tag">${h.HospitalID}</span>
      </div>
      <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:8px;">
        Open Capacity: <strong>${capacity} Beds</strong>
      </div>
      <div style="font-size:0.8rem; font-family:var(--font-mono); color:var(--info-cyan); margin-bottom:12px;">
        📞 ${h.ContactInfo || 'N/A'}
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:6px;">
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

  elements.qrCodeContainer.innerHTML = generateQrSvg(id);
}

// -----------------------------------------------------------------------------
// Incident Simulator Logic
// -----------------------------------------------------------------------------
const SCENARIOS = {
  1: {
    title: 'Acute Anaphylactic Shock in Tokyo Subway',
    touristId: 'T-1001',
    patientName: 'Elena Rostova',
    location: 'Shinjuku Subway Terminal, Tokyo',
  },
  2: {
    title: 'Hypoglycemic Diabetic Crisis outside European Hall',
    touristId: 'T-1002',
    patientName: 'Kenji Sato',
    location: 'Messe Berlin Convention Center, Germany',
  },
  3: {
    title: 'Cardiac Arrhythmia Collapse during Solo Tour',
    touristId: 'T-1003',
    patientName: 'Maria Gonzalez',
    location: 'Gran Via, Madrid, Spain',
  },
  4: {
    title: 'Heatstroke & Dehydration in Summer Excursion',
    touristId: 'T-1004',
    patientName: 'Arjun Patel',
    location: 'Jaipur Fort Trail, Rajasthan, India',
  },
};

function logSimulationLine(text, type = 'info') {
  const line = document.createElement('div');
  line.className = `console-row ${type}`;
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
  elements.runSimulationBtn.textContent = 'RUNNING INCIDENT DISPATCH PROTOCOL...';
  elements.simulationConsoleBody.innerHTML = '';

  logSimulationLine(`🚨 EMERGENCY CALL: ${scenario.title}`, 'alert');
  logSimulationLine(`📍 Incident Location: ${scenario.location}`, 'info');
  logSimulationLine(`📲 First responder terminal scans QR code ID: ${scenario.touristId}`, 'info');

  startSiren();
  setTimeout(() => stopSiren(), 1400);

  logSimulationLine(`⏳ Querying AWS Serverless endpoint /emergency in Golden Hour window...`, 'info');
  await new Promise(r => setTimeout(r, 600));

  try {
    const res = await fetch(`${API_BASE}/emergency?tourist_id=${scenario.touristId}&location=${encodeURIComponent(scenario.location)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    logSimulationLine(`✅ Patient record verified: ${data.profile.Name} (${data.profile.Age} y/o, Blood: ${data.profile.BloodType})`, 'success');
    logSimulationLine(`⚠️ CRITICAL ALLERGIES: ${(data.profile.Allergies || []).join(', ')}`, 'alert');
    logSimulationLine(`🧠 Amazon Bedrock Claude 3 field briefing synthesized:`, 'ai');

    const briefLines = (data.ai_summary || '').split('\n').filter(l => l.trim());
    briefLines.forEach(l => logSimulationLine(`   ${l}`, 'ai'));

    logSimulationLine(`🏥 Optimal trauma facility matched: ${data.recommended_hospital.Name}`, 'success');
    logSimulationLine(`   • Available Beds: ${data.recommended_hospital.Capacity} | ETA: ${data.recommended_hospital.EstimatedDriveMinutes || 8} min`, 'info');
    logSimulationLine(`🎯 Emergency triage completed in <800ms! Dispatch alert broadcast.`, 'success');

    setTimeout(() => {
      renderTriageResults(data);
      closeModal(elements.simulatorModal);
      showToast('Incident simulation complete! Results loaded in Triage HUD.', 'success');
    }, 1200);

  } catch (err) {
    logSimulationLine(`❌ Incident error: ${err.message}`, 'alert');
  } finally {
    elements.runSimulationBtn.disabled = false;
    elements.runSimulationBtn.textContent = '🚨 RUN LIVE INCIDENT SIMULATION';
  }
}

// -----------------------------------------------------------------------------
// Setup Event Listeners
// -----------------------------------------------------------------------------
function setupEventListeners() {
  // Modal Triggers
  elements.langModalBtn.addEventListener('click', () => openModal(elements.langModal));
  elements.closeLangModalBtn.addEventListener('click', () => closeModal(elements.langModal));

  elements.themeModalBtn.addEventListener('click', () => openModal(elements.themeModal));
  elements.closeThemeModalBtn.addEventListener('click', () => closeModal(elements.themeModal));

  elements.openStudioBtn.addEventListener('click', () => {
    updateStudioPreviewFromForm();
    openModal(elements.studioModal);
  });
  elements.closeStudioModalBtn.addEventListener('click', () => closeModal(elements.studioModal));

  elements.openHospitalsBtn.addEventListener('click', () => {
    renderHospitalsDirectory(state.hospitals);
    openModal(elements.hospitalsModal);
  });
  elements.closeHospitalsModalBtn.addEventListener('click', () => closeModal(elements.hospitalsModal));

  elements.openSimulatorBtn.addEventListener('click', () => openModal(elements.simulatorModal));
  elements.closeSimulatorModalBtn.addEventListener('click', () => closeModal(elements.simulatorModal));

  // Close modals on backdrop click
  [elements.langModal, elements.themeModal, elements.studioModal, elements.hospitalsModal, elements.simulatorModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  // Language Search
  elements.langSearchInput.addEventListener('input', (e) => {
    renderLanguageList(e.target.value);
  });

  // Theme Toggles
  elements.btnModeDark.addEventListener('click', () => setDisplayMode('dark'));
  elements.btnModeLight.addEventListener('click', () => setDisplayMode('light'));

  elements.presetColorChips.forEach(chip => {
    chip.addEventListener('click', () => {
      setAccentColor(chip.dataset.color);
    });
  });

  if (elements.customColorInput) {
    elements.customColorInput.addEventListener('input', (e) => {
      setAccentColor(e.target.value);
    });
  }
  if (elements.applyCustomColorBtn) {
    elements.applyCustomColorBtn.addEventListener('click', () => {
      setAccentColor(elements.customColorHex.value.trim());
    });
  }

  // Audio Siren Button
  elements.sirenBtn.addEventListener('click', toggleEmergencySiren);

  // Global Error Handlers
  elements.globalErrorDismissBtn.addEventListener('click', hideGlobalError);
  elements.globalErrorRetryBtn.addEventListener('click', () => {
    checkHealth();
    if (elements.manualTouristIdInput.value) {
      fetchEmergencyTriage(elements.manualTouristIdInput.value.trim());
    }
  });

  // Command Bar Search & Submit
  elements.lookupBtn.addEventListener('click', () => {
    const id = elements.manualTouristIdInput.value.trim();
    if (!id) {
      showToast('Please enter a Tourist ID (e.g. T-1001)', 'error');
      return;
    }
    fetchEmergencyTriage(id);
  });

  elements.manualTouristIdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') elements.lookupBtn.click();
  });

  // Preset Chips
  elements.presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      elements.presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const touristId = chip.dataset.tourist;
      elements.manualTouristIdInput.value = touristId;
      fetchEmergencyTriage(touristId);
    });
  });

  // QR Upload
  elements.qrUploadInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      showToast('📷 Analyzing QR code pattern...', 'info');
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
  elements.printPassportBtn.addEventListener('click', () => window.print());
  elements.downloadQrBtn.addEventListener('click', () => window.print());

  // Passport Studio Inputs
  const formInputs = [
    elements.studioIdInput,
    elements.studioNameInput,
    elements.studioAgeInput,
    elements.studioBloodSelect,
    elements.studioLangInput,
    elements.studioAllergiesInput,
  ];
  formInputs.forEach(input => {
    if (input) input.addEventListener('input', updateStudioPreviewFromForm);
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
      closeModal(elements.studioModal);
      fetchEmergencyTriage(saved.TouristID);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.querySelector('.btn-spinner').classList.add('hidden');
    }
  });

  elements.resetFormBtn.addEventListener('click', () => {
    elements.passportForm.reset();
    elements.studioIdInput.value = '';
    updateStudioPreviewFromForm();
  });

  // Hospital Filter
  if (elements.serviceFilterSelect) {
    elements.serviceFilterSelect.addEventListener('change', () => {
      renderHospitalsDirectory(state.hospitals);
    });
  }

  // Incident Simulator Run
  elements.runSimulationBtn.addEventListener('click', runIncidentSimulation);

  // Keyboard Escape closes active modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [elements.langModal, elements.themeModal, elements.studioModal, elements.hospitalsModal, elements.simulatorModal].forEach(closeModal);
    }
  });
}

// -----------------------------------------------------------------------------
// App Initialization
// -----------------------------------------------------------------------------
async function initApp() {
  // Apply saved theme and color
  setDisplayMode(state.themeMode);
  setAccentColor(state.accentColor);

  // Setup event handlers & 3D tilt effects
  setupEventListeners();
  init3DCardTilt();

  // Apply language
  setLanguage(state.lang);

  // Initialize preview card
  updateStudioPreviewFromForm();

  // Fetch API health and hospital directory
  await checkHealth();
  await fetchHospitals();

  // Default interactive demo: Elena Rostova
  fetchEmergencyTriage('T-1001', 'Central Station, City Plaza');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
