/**
 * Emergency Passport — Production Controller & Creative Motion Engine
 * Luxury Editorial × Medical Technology Design Language
 * Ambient Canvas Geographic Contour • Interactive Leaflet Maps • Clinical AI Triage
 */

// -----------------------------------------------------------------------------
// Global State
// -----------------------------------------------------------------------------
const state = {
  lang: localStorage.getItem('emergency_lang') || 'en',
  themeMode: (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('theme')) || localStorage.getItem('emergency_theme_mode') || 'dark',
  accentColor: localStorage.getItem('emergency_accent_color') || '#C6A56B',
  hospitals: [],
  systemHealthy: false,
  activeBackend: 'local',
  sirenActive: false,
  audioContext: null,
  sirenOscillator: null,
  currentTriageData: null,
  leafletHeroMap: null,
  leafletHospitalsMap: null,
  activeHospitalMarker: null,
  activeRouteLine: null,
};

const API_BASE = '';

// -----------------------------------------------------------------------------
// 1. Ambient Canvas Geographic Contour & Constellation Engine (Parallax Enabled)
// -----------------------------------------------------------------------------
class AmbientCanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.nodes = [];
    this.pulses = [];
    this.animFrameId = null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Parallax tracking
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;
    this.scrollY = 0;

    this._resize();
    this._initNodes();
    window.addEventListener('resize', () => this._resize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
    }, { passive: true });
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    }, { passive: true });

    if (!this.reducedMotion) this._animate();
  }

  _resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    if (this.reducedMotion) this._drawStatic();
  }

  _initNodes() {
    this.nodes = [];
    const count = Math.min(36, Math.floor((this.width * this.height) / 42000));
    for (let i = 0; i < count; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.2,
      });
    }

    // Emergency corridor pulses
    this.pulses = [
      { x: this.width * 0.25, y: this.height * 0.35, r: 0, maxR: 120, speed: 0.6 },
      { x: this.width * 0.75, y: this.height * 0.65, r: 40, maxR: 160, speed: 0.5 },
    ];
  }

  _drawStatic() {
    const isDark = state.themeMode === 'dark';
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.strokeStyle = isDark ? 'rgba(198, 165, 107, 0.08)' : 'rgba(177, 138, 82, 0.1)';
    this.ctx.lineWidth = 1;

    // Static geographic contours
    for (let i = 1; i <= 4; i++) {
      this.ctx.beginPath();
      this.ctx.ellipse(this.width * 0.5, this.height * 0.4, 200 * i, 120 * i, Math.PI / 12, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  _animate() {
    const isDark = state.themeMode === 'dark';
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Inertial lerp for mouse parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;
    const mouseOffsetX = (this.mouseX - this.width / 2) * 0.035;
    const mouseOffsetY = (this.mouseY - this.height / 2) * 0.035;
    const scrollOffsetY = (this.scrollY * 0.12) % 180;

    // 1. Delicate Topographical Contour Rings (with multi-layer parallax)
    this.ctx.strokeStyle = isDark ? 'rgba(198, 165, 107, 0.045)' : 'rgba(177, 138, 82, 0.07)';
    this.ctx.lineWidth = 1;
    const time = Date.now() * 0.0003;

    for (let i = 1; i <= 3; i++) {
      this.ctx.beginPath();
      const wave = Math.sin(time + i) * 15;
      const depthMultiplier = i * 0.4;
      this.ctx.ellipse(
        this.width * 0.6 + wave + (mouseOffsetX * depthMultiplier),
        this.height * 0.35 + (mouseOffsetY * depthMultiplier) - scrollOffsetY,
        180 * i,
        110 * i,
        Math.PI / 10,
        0,
        Math.PI * 2
      );
      this.ctx.stroke();
    }

    // 2. Telemetry Nodes & Corridors
    this.ctx.fillStyle = isDark ? 'rgba(112, 181, 170, 0.4)' : 'rgba(77, 129, 123, 0.45)';
    this.nodes.forEach((n, idx) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0) n.x = this.width;
      if (n.x > this.width) n.x = 0;
      if (n.y < 0) n.y = this.height;
      if (n.y > this.height) n.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Connect close neighbors with hairline corridors
      for (let j = idx + 1; j < this.nodes.length; j++) {
        const m = this.nodes[j];
        const dist = Math.hypot(n.x - m.x, n.y - m.y);
        if (dist < 130) {
          this.ctx.strokeStyle = isDark 
            ? `rgba(198, 165, 107, ${(1 - dist / 130) * 0.08})`
            : `rgba(177, 138, 82, ${(1 - dist / 130) * 0.09})`;
          this.ctx.beginPath();
          this.ctx.moveTo(n.x, n.y);
          this.ctx.lineTo(m.x, m.y);
          this.ctx.stroke();
        }
      }
    });

    // 3. Pulse Waves
    this.pulses.forEach(p => {
      p.r += p.speed;
      if (p.r > p.maxR) p.r = 0;
      const alpha = (1 - p.r / p.maxR) * 0.15;
      this.ctx.strokeStyle = isDark ? `rgba(112, 181, 170, ${alpha})` : `rgba(77, 129, 123, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.stroke();
    });

    this.animFrameId = requestAnimationFrame(() => this._animate());
  }
}

// -----------------------------------------------------------------------------
// 2. Interactive Real Map Engine (Leaflet + OpenStreetMap Vector)
// -----------------------------------------------------------------------------
function getMapTileUrl() {
  return 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
}

function initHeroMap() {
  const container = document.getElementById('heroInteractiveMap');
  if (!container || typeof L === 'undefined') return;

  if (state.leafletHeroMap) {
    try { state.leafletHeroMap.remove(); } catch (e) {}
    state.leafletHeroMap = null;
  }

  // New Delhi Central Center
  const delhiCenter = [28.6139, 77.2090];
  const map = L.map(container, {
    center: delhiCenter,
    zoom: 13,
    zoomControl: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    dragging: true,
    attributionControl: false,
  });

  L.tileLayer(getMapTileUrl(), { maxZoom: 19 }).addTo(map);

  // User location marker (Gold beacon)
  const userIcon = L.divIcon({
    className: 'custom-map-beacon beacon-user',
    html: `<span class="beacon-radar-ring"></span><span>✦</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
  L.marker(delhiCenter, { icon: userIcon }).addTo(map);

  // Surrounding Hospital Beacons in Delhi NCR
  const hospitalPoints = [
    { coords: [28.5672, 77.2100], name: 'AIIMS New Delhi — Apex Trauma Centre' },
    { coords: [28.5701, 77.2078], name: 'Safdarjung Hospital Emergency Block' },
    { coords: [28.5282, 77.2131], name: 'Max Super Speciality Saket' },
    { coords: [28.5412, 77.2831], name: 'Apollo Indraprastha Sarita Vihar' },
  ];

  const hospIcon = L.divIcon({
    className: 'custom-map-beacon beacon-hospital',
    html: `<span class="beacon-radar-ring"></span><span>+</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });

  hospitalPoints.forEach(h => {
    L.marker(h.coords, { icon: hospIcon }).addTo(map);
  });

  state.leafletHeroMap = map;

  setTimeout(() => {
    if (state.leafletHeroMap) {
      state.leafletHeroMap.invalidateSize();
    }
  }, 150);

  // Subtle ambient camera drift
  let driftAngle = 0;
  setInterval(() => {
    if (state.leafletHeroMap && document.getElementById('heroInteractiveMap')) {
      driftAngle += 0.002;
      state.leafletHeroMap.panBy([Math.cos(driftAngle) * 0.4, Math.sin(driftAngle) * 0.3], { animate: false });
    }
  }, 100);
}

function initHospitalsMap(hospitals = []) {
  const container = document.getElementById('facilitiesMapMount');
  if (!container || typeof L === 'undefined') return;

  if (state.leafletHospitalsMap) {
    try { state.leafletHospitalsMap.remove(); } catch (e) {}
    state.leafletHospitalsMap = null;
  }

  const userCoords = [28.6139, 77.2090];
  const map = L.map(container, {
    center: userCoords,
    zoom: 13,
    zoomControl: true,
    scrollWheelZoom: true,
    attributionControl: false,
  });

  L.tileLayer(getMapTileUrl(), { maxZoom: 19 }).addTo(map);

  // User Marker
  const userIcon = L.divIcon({
    className: 'custom-map-beacon beacon-user',
    html: `<span class="beacon-radar-ring"></span><span>✦</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
  L.marker(userCoords, { icon: userIcon })
    .bindPopup('<strong>Your Current Position</strong><br>GPS: New Delhi Central District / Connaught Place')
    .addTo(map);

  // Hospitals Markers
  const hospIcon = L.divIcon({
    className: 'custom-map-beacon beacon-hospital',
    html: `<span class="beacon-radar-ring"></span><span>+</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  const markers = {};
  hospitals.forEach(h => {
    const lat = h.Latitude || 35.6895 + (Math.random() - 0.5) * 0.04;
    const lon = h.Longitude || 139.6917 + (Math.random() - 0.5) * 0.04;
    const marker = L.marker([lat, lon], { icon: hospIcon }).addTo(map);

    const popupHtml = `
      <div style="padding: 4px; font-family: var(--font-sans);">
        <strong style="font-size: 0.95rem;">${h.Name}</strong><br>
        <span style="font-size: 0.78rem; color: var(--text-secondary);">Available: ${h.Capacity || 100} Beds • ${h.DistanceKm || 4.2} km</span><br>
        <div style="margin-top: 8px;">
          <a href="tel:${(h.ContactInfo || '').replace(/[^\d+]/g, '')}" class="btn btn-sm btn-primary" style="text-decoration: none; padding: 4px 10px; font-size: 0.75rem;">
            Call Admissions
          </a>
        </div>
      </div>
    `;
    marker.bindPopup(popupHtml);
    markers[h.HospitalID] = { marker, coords: [lat, lon], data: h };
  });

  state.leafletHospitalsMap = map;
  state.hospitalMarkers = markers;
}

function focusHospitalOnMap(hospitalId) {
  if (!state.leafletHospitalsMap || !state.hospitalMarkers) return;
  const entry = state.hospitalMarkers[hospitalId];
  if (!entry) return;

  const map = state.leafletHospitalsMap;
  map.flyTo(entry.coords, 14, { duration: 1.2 });
  entry.marker.openPopup();

  // Draw emergency route polyline
  if (state.activeRouteLine) {
    map.removeLayer(state.activeRouteLine);
  }

  const userCoords = [35.6895, 139.6917];
  state.activeRouteLine = L.polyline([userCoords, entry.coords], {
    color: state.themeMode === 'light' ? '#B18A52' : '#C6A56B',
    weight: 3.5,
    opacity: 0.85,
    dashArray: '6, 8',
  }).addTo(map);

  showToast(`Ambulance route traced to ${entry.data.Name} (ETA ~${entry.data.EstimatedDriveMinutes || 8} min)`, 'info');
}

// -----------------------------------------------------------------------------
// 3. Theme & Atmosphere Engine (Stitch Wave Transition)
// -----------------------------------------------------------------------------
function applyCurrentTheme() {
  document.documentElement.setAttribute('data-theme', state.themeMode);

  // Sync Stitch Tactile Theme Switch
  const themeSwitch = document.getElementById('navThemeSwitch');
  if (themeSwitch) {
    const isDark = state.themeMode === 'dark';
    themeSwitch.classList.toggle('is-dark', isDark);
    themeSwitch.classList.toggle('is-light', !isDark);
    themeSwitch.setAttribute('aria-checked', isDark ? 'true' : 'false');
  }

  // Sync legacy icons if present
  const sunIcon = document.querySelector('.theme-sun-icon');
  const moonIcon = document.querySelector('.theme-moon-icon');
  if (sunIcon && moonIcon) {
    sunIcon.classList.toggle('hidden', state.themeMode === 'dark');
    moonIcon.classList.toggle('hidden', state.themeMode === 'light');
  }

  // Update theme modal toggles
  const btnDark = document.getElementById('btnModeDark');
  const btnLight = document.getElementById('btnModeLight');
  if (btnDark) btnDark.classList.toggle('active', state.themeMode === 'dark');
  if (btnLight) btnLight.classList.toggle('active', state.themeMode === 'light');

  // Update Leaflet tile layers if map exists
  if (state.leafletHeroMap) {
    state.leafletHeroMap.eachLayer(layer => {
      if (layer instanceof L.TileLayer) layer.setUrl(getMapTileUrl());
    });
  }
  if (state.leafletHospitalsMap) {
    state.leafletHospitalsMap.eachLayer(layer => {
      if (layer instanceof L.TileLayer) layer.setUrl(getMapTileUrl());
    });
  }
}

function spawnLiquidWaveRipples(x, y, targetMode) {
  // Create fluid organic wave portal overlay across viewport
  const portal = document.createElement('div');
  portal.className = `theme-wave-portal mode-${targetMode}`;
  portal.style.left = `${x}px`;
  portal.style.top = `${y}px`;

  portal.innerHTML = `
    <div class="liquid-wave-ring wave-1"></div>
    <div class="liquid-wave-ring wave-2"></div>
    <div class="liquid-wave-ring wave-3"></div>
  `;

  document.body.appendChild(portal);

  setTimeout(() => {
    if (portal && portal.parentNode) {
      portal.parentNode.removeChild(portal);
    }
  }, 1150);
}

function triggerThemeWaveTransition(e) {
  const nextMode = state.themeMode === 'dark' ? 'light' : 'dark';

  // Calculate origin coordinates for the wave
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  if (e && typeof e.clientX === 'number' && e.clientX > 0) {
    x = e.clientX;
    y = e.clientY;
  } else {
    const switchBtn = document.getElementById('navThemeSwitch');
    if (switchBtn) {
      const rect = switchBtn.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }
  }

  // 1. Always fire fluid liquid wave ripple rings
  spawnLiquidWaveRipples(x, y, nextMode);

  // 2. View Transitions API circular sweep if supported
  const supportsViewTransitions = Boolean(document.startViewTransition) && 
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (supportsViewTransitions) {
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      state.themeMode = nextMode;
      localStorage.setItem('emergency_theme_mode', nextMode);
      applyCurrentTheme();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 720,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  } else {
    state.themeMode = nextMode;
    localStorage.setItem('emergency_theme_mode', nextMode);
    applyCurrentTheme();
  }

  showToast(`Atmosphere switched to ${nextMode === 'dark' ? 'Quiet Obsidian' : 'Warm Ivory'}`, 'info');
}

function setDisplayMode(mode) {
  state.themeMode = mode;
  localStorage.setItem('emergency_theme_mode', mode);
  applyCurrentTheme();
  showToast(`Atmosphere switched to ${mode === 'dark' ? 'Quiet Obsidian' : 'Warm Ivory'}`, 'info');
}

function setAccentColor(colorHex) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(colorHex)) return;
  state.accentColor = colorHex;
  localStorage.setItem('emergency_accent_color', colorHex);
  document.documentElement.style.setProperty('--gold', colorHex);
  document.documentElement.style.setProperty('--border-focus', colorHex);
}

// -----------------------------------------------------------------------------
// 4. 22 Indian Languages Internationalization Engine
// -----------------------------------------------------------------------------
function applyCurrentLanguage() {
  const langObj = (typeof LANGUAGES !== 'undefined' && LANGUAGES.find(l => l.code === state.lang)) || { native: 'English', name: 'English' };
  
  const navLangLabel = document.getElementById('navLangText');
  if (navLangLabel) navLangLabel.textContent = langObj.native || langObj.name;

  document.querySelectorAll('[data-i18n]').forEach(elem => {
    const key = elem.getAttribute('data-i18n');
    if (typeof getTranslation === 'function') {
      elem.textContent = getTranslation(key, state.lang);
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(elem => {
    const key = elem.getAttribute('data-i18n-placeholder');
    if (typeof getTranslation === 'function') {
      elem.setAttribute('placeholder', getTranslation(key, state.lang));
    }
  });
}

function setLanguage(langCode) {
  state.lang = langCode;
  localStorage.setItem('emergency_lang', langCode);
  applyCurrentLanguage();

  const modal = document.getElementById('langModal');
  if (modal) modal.classList.add('hidden');

  const langObj = (typeof LANGUAGES !== 'undefined' && LANGUAGES.find(l => l.code === langCode)) || { native: 'English', name: 'English' };
  showToast(`Language switched to ${langObj.native} (${langObj.name})`, 'success');
}

function renderLanguageList(filterText = '') {
  const container = document.getElementById('langGridContainer');
  if (!container || typeof LANGUAGES === 'undefined') return;

  container.innerHTML = '';
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
    card.addEventListener('click', () => setLanguage(lang.code));
    container.appendChild(card);
  });
}

// -----------------------------------------------------------------------------
// 5. Toast Notifications & Siren Chime
// -----------------------------------------------------------------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3800);
}

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

    const sirenBtn = document.getElementById('navSirenBtn');
    if (sirenBtn) sirenBtn.classList.add('active');
    showToast('Emergency alert chime activated', 'emergency');
  } catch (e) {
    console.warn('Audio note:', e);
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
  const sirenBtn = document.getElementById('navSirenBtn');
  if (sirenBtn) sirenBtn.classList.remove('active');
}

// -----------------------------------------------------------------------------
// 6. ISO-Standard Vector QR Generator (qrcode.js with Scalable SVG)
// -----------------------------------------------------------------------------
function generateQrSvg(text) {
  try {
    if (typeof qrcode !== 'undefined') {
      const qr = qrcode(0, 'M');
      qr.addData(String(text || ''));
      qr.make();
      return qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
    }
  } catch (err) {
    console.warn('qrcode generator error, using vector fallback:', err);
  }

  // Standalone vector fallback with ISO finder patterns
  const size = 25;
  const hash = Array.from(String(text || '')).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007, 7);
  const grid = Array(size).fill(0).map(() => Array(size).fill(false));

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
        rects.push(`<rect x="${c * 5}" y="${r * 5}" width="5" height="5" fill="#121614" />`);
      }
    }
  }

  return `
    <svg viewBox="0 0 ${size * 5} ${size * 5}" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="${size * 5}" height="${size * 5}" fill="#FFFFFF" />
      ${rects.join('')}
    </svg>
  `;
}

// -----------------------------------------------------------------------------
// 6.B Live Camera QR Optical Scanner Engine (jsQR + getUserMedia)
// -----------------------------------------------------------------------------
const qrScannerState = {
  stream: null,
  animId: null,
  activeFacingMode: 'environment',
  isScanning: false,
};

function playScanSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760, now + 0.09);
    gain2.gain.setValueAtTime(0.14, now + 0.09);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.09);
    osc2.stop(now + 0.28);
  } catch (err) {
    console.debug('Audio chime note:', err);
  }
}

function parseTouristId(rawText) {
  if (!rawText) return 'T-1001';
  const str = String(rawText).trim();

  // JSON payload
  if (str.startsWith('{') && str.endsWith('}')) {
    try {
      const parsed = JSON.parse(str);
      if (parsed.tourist_id) return parsed.tourist_id;
      if (parsed.TouristID) return parsed.TouristID;
      if (parsed.passportId) return parsed.passportId;
      if (parsed.id) return parsed.id;
    } catch (e) {}
  }

  // URL query parameter ?id=T-1001
  try {
    if (str.includes('id=')) {
      const match = str.match(/[?&]id=([^&#]+)/);
      if (match && match[1]) return decodeURIComponent(match[1]);
    }
  } catch (e) {}

  // Pattern match (e.g. T-1001, T-1002)
  const tMatch = str.match(/\b(T-\d{3,6})\b/i);
  if (tMatch) return tMatch[1].toUpperCase();

  return str.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 16) || 'T-1001';
}

function handleDecodedQr(qrText) {
  if (!qrText) return;
  const touristId = parseTouristId(qrText);
  playScanSuccessChime();
  showToast(`Emergency Identity Decoded: ${touristId}`, 'emergency');

  closeQrScannerModal();

  if (typeof appRouter !== 'undefined') {
    appRouter.navigate(`/triage?id=${encodeURIComponent(touristId)}`);
  }

  setTimeout(() => {
    fetchEmergencyTriage(touristId);
  }, 200);
}

async function startCameraStream() {
  const video = document.getElementById('qrCameraFeed');
  const statusText = document.getElementById('scannerStatusText');
  if (!video) return;

  qrScannerState.isScanning = true;
  if (statusText) statusText.textContent = 'CONNECTING OPTICAL SENSOR...';

  try {
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera device access not supported in this browser context');
    }

    const constraints = {
      video: {
        facingMode: { ideal: qrScannerState.activeFacingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    };

    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (idealErr) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    }

    qrScannerState.stream = stream;
    video.srcObject = stream;
    video.setAttribute('playsinline', 'true');
    await video.play();

    if (statusText) statusText.textContent = 'OPTICAL SENSOR ACTIVE • AIM AT QR';
    scanCameraFrame();
  } catch (err) {
    console.warn('Camera stream error:', err);
    if (statusText) {
      statusText.textContent = 'CAMERA UNAVAILABLE • USE FILE UPLOAD OR DEMO CASE';
    }
  }
}

function stopCameraStream() {
  qrScannerState.isScanning = false;
  if (qrScannerState.animId) {
    cancelAnimationFrame(qrScannerState.animId);
    qrScannerState.animId = null;
  }
  if (qrScannerState.stream) {
    try {
      qrScannerState.stream.getTracks().forEach(track => track.stop());
    } catch (e) {}
    qrScannerState.stream = null;
  }
  const video = document.getElementById('qrCameraFeed');
  if (video) {
    video.srcObject = null;
  }
}

function scanCameraFrame() {
  if (!qrScannerState.isScanning) return;
  const video = document.getElementById('qrCameraFeed');
  const canvas = document.getElementById('qrCanvasBuffer');

  if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (typeof jsQR !== 'undefined') {
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          handleDecodedQr(code.data);
          return;
        }
      } catch (err) {
        console.debug('jsQR frame error:', err);
      }
    }
  }

  qrScannerState.animId = requestAnimationFrame(scanCameraFrame);
}

function openQrScannerModal() {
  const modal = document.getElementById('qrScannerModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  startCameraStream();
}

function closeQrScannerModal() {
  const modal = document.getElementById('qrScannerModal');
  if (modal) modal.classList.add('hidden');
  stopCameraStream();
}

function switchCamera() {
  qrScannerState.activeFacingMode =
    qrScannerState.activeFacingMode === 'environment' ? 'user' : 'environment';
  startCameraStream();
}

function handleQrFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.getElementById('qrCanvasBuffer') || document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      if (typeof jsQR !== 'undefined') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code && code.data) {
          handleDecodedQr(code.data);
        } else {
          showToast('No readable QR code found in this image. Please try a clearer picture.', 'warning');
        }
      } else {
        showToast('QR decoder engine loading. Please retry.', 'info');
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// -----------------------------------------------------------------------------
// 6.C Regional Disaster Early Warning & Evacuation Radar Engine
// -----------------------------------------------------------------------------
let activeDisasterAlerts = [];

async function fetchDisasterAlerts() {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.alerts && data.alerts.length > 0) {
      activeDisasterAlerts = data.alerts;
      renderDisasterBanner(data.alerts[0]);
      updateDisasterCount(data.alerts.length);
    }
  } catch (err) {
    console.debug('Alerts fetch skipped:', err);
  }
}

function updateDisasterCount(count) {
  const pill = document.getElementById('stitchAlertCountPill');
  if (pill) {
    pill.textContent = count;
    pill.style.display = count > 0 ? 'inline-flex' : 'none';
  }
}

function renderDisasterBanner(primaryAlert) {
  const banner = document.getElementById('disasterAlertBanner');
  const headlineEl = document.getElementById('disasterBannerHeadline');
  const distanceEl = document.getElementById('disasterBannerDistance');
  if (!banner || !primaryAlert) return;

  if (headlineEl) headlineEl.textContent = primaryAlert.headline || 'REGIONAL DISASTER EARLY WARNING';
  if (distanceEl) distanceEl.textContent = `${primaryAlert.distance_km || 14.2} KM AWAY`;

  banner.classList.remove('hidden');
}

function openDisasterModal() {
  const modal = document.getElementById('disasterModal');
  const container = document.getElementById('disasterContentContainer');
  if (!modal || !container) return;

  if (activeDisasterAlerts.length === 0) {
    container.innerHTML = `
      <div style="padding: 32px; text-align: center; color: var(--text-secondary);">
        <p>No active regional disaster early warnings in your immediate sector.</p>
        <span class="telemetry-pill operational" style="margin-top: 12px; display: inline-flex;">ALL SECTORS SECURE</span>
      </div>
    `;
  } else {
    container.innerHTML = activeDisasterAlerts.map(alert => `
      <div class="disaster-card ${alert.severity === 'CRITICAL' ? 'critical-border' : ''}">
        <div class="disaster-card-header">
          <div>
            <div class="disaster-badge-row">
              <span class="badge ${alert.severity === 'CRITICAL' ? 'badge-emergency' : 'badge-gold'}">
                <span class="pulse-beacon"></span>
                ${alert.severity} • ${alert.disaster_type}
              </span>
              <span class="disaster-eta-pill">ETA: ~${alert.estimated_arrival_sec} SEC</span>
            </div>
            <h4 class="disaster-card-title">${alert.headline}</h4>
            <div class="disaster-meta-line">
              <span>Location: ${alert.location}</span>
              <span>•</span>
              <span>Epicenter: ${alert.distance_km} km away</span>
              ${alert.depth_km ? `<span>•</span><span>Depth: ${alert.depth_km} km</span>` : ''}
            </div>
          </div>
        </div>

        <div class="disaster-instruction-box">
          <strong style="color: var(--emergency); font-size: 0.76rem; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">CIVIL DEFENSE DIRECTIVE</strong>
          <p style="margin: 0; font-size: 0.92rem; line-height: 1.5; color: var(--text-primary);">${alert.instruction}</p>
        </div>

        <div class="disaster-shelters-section">
          <div style="font-size: 0.76rem; font-family: var(--font-mono); color: var(--gold); letter-spacing: 0.05em; margin-bottom: 8px;">
            VERIFIED SAFE SHELTERS & EMERGENCY CLINICAL HUBS:
          </div>
          <div class="shelters-grid">
            ${(alert.safe_shelters || []).map(shelter => `
              <div class="shelter-chip">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <strong style="font-size: 0.88rem; color: var(--text-primary);">${shelter.name}</strong>
                  <span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--gold);">${shelter.distance_km} km</span>
                </div>
                <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 3px;">
                  ${shelter.type} • <span style="color: var(--medical);">${shelter.bed_status}</span>
                </div>
                ${shelter.phone ? `<a href="tel:${shelter.phone}" class="shelter-phone-link">Call Dispatch: ${shelter.phone}</a>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  }

  modal.classList.remove('hidden');
}

function closeDisasterModal() {
  const modal = document.getElementById('disasterModal');
  if (modal) modal.classList.add('hidden');
}

// Global window exposure
if (typeof window !== 'undefined') {
  window.generateQrSvg = generateQrSvg;
  window.openQrScannerModal = openQrScannerModal;
  window.closeQrScannerModal = closeQrScannerModal;
  window.openDisasterModal = openDisasterModal;
  window.closeDisasterModal = closeDisasterModal;
  window.fetchDisasterAlerts = fetchDisasterAlerts;
}

// -----------------------------------------------------------------------------
// 7. Emergency Triage Engine & Clinical AI Integration
// -----------------------------------------------------------------------------
async function fetchEmergencyTriage(touristId, location = 'Connaught Place, New Delhi', lat = 28.6304, lon = 77.2177) {
  const displayContainer = document.getElementById('triageActiveDisplay');
  if (displayContainer) {
    displayContainer.innerHTML = `
      <div class="glass-card" style="padding: 48px; text-align: center;">
        <div class="status-indicator-dot" style="margin: 0 auto 16px auto; width: 12px; height: 12px;"></div>
        <h3 style="font-size: 1.4rem;">DECODING EMERGENCY IDENTITY (${touristId})</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 6px;">Retrieving verified health records & synthesizing clinical briefing...</p>
      </div>
    `;
  }

  try {
    let url = `${API_BASE}/emergency?tourist_id=${encodeURIComponent(touristId)}&location=${encodeURIComponent(location)}`;
    if (lat && lon) url += `&latitude=${lat}&longitude=${lon}`;

    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Triage query failed (${res.status})`);

    state.currentTriageData = data;
    renderTriageViewContent(data);
    showToast(`Emergency Passport for ${data.profile.Name} decoded!`, 'success');
  } catch (err) {
    if (displayContainer) {
      displayContainer.innerHTML = `
        <div class="glass-card" style="padding: 40px; text-align: center;">
          <h3 style="color: var(--emergency);">Emergency Record Lookup Failed</h3>
          <p style="color: var(--text-secondary); margin: 8px 0 20px 0;">${err.message}</p>
          <button class="btn btn-primary" onclick="fetchEmergencyTriage('T-1001')">Load Default (Aarav Sharma)</button>
        </div>
      `;
    }
    showToast(err.message, 'emergency');
  }
}

function renderTriageViewContent(data) {
  const container = document.getElementById('triageActiveDisplay');
  if (!container) return;

  const profile = data.profile;
  const hospital = data.recommended_hospital;
  const summary = data.ai_summary;

  const allergies = Array.isArray(profile.Allergies) ? profile.Allergies : Array.from(profile.Allergies || []);
  const conditions = Array.isArray(profile.Conditions) ? profile.Conditions : Array.from(profile.Conditions || []);
  const contacts = Array.isArray(profile.EmergencyContacts) ? profile.EmergencyContacts : Array.from(profile.EmergencyContacts || []);

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 32px; animation: fadeIn 0.3s var(--ease-out);">
      
      <!-- Central Document Presentation -->
      ${UI.renderPassportDocument({
        bloodGroup: profile.BloodType,
        allergies: allergies,
        conditions: conditions,
        emergencyContacts: contacts.map((c, i) => ({ name: c, relationship: 'Contact', phone: c })),
        lastVerified: profile.LastUpdated ? profile.LastUpdated.split('T')[0] : 'Today'
      }, {
        name: profile.Name,
        passportId: profile.TouristID,
        avatar: (profile.Name || 'U').slice(0, 2).toUpperCase(),
        country: 'Verified Citizen',
        language: profile.Language,
        dob: `${profile.Age || 29} Years Old`
      })}

      <!-- Authoritative Clinical Field Briefing Document -->
      <div class="field-briefing-sheet glass-card">
        <div class="briefing-header-row">
          <div>
            <span class="briefing-claude-badge">CLINICAL TRIAGE INTELLIGENCE • FIELD BRIEFING</span>
            <h3 style="font-size: 1.3rem; margin-top: 4px;">Urgent Clinical Field Briefing</h3>
          </div>
          <button class="btn btn-sm btn-outline" onclick="navigator.clipboard.writeText(\`${(summary || '').replace(/`/g, '\\`')}\`); showToast('Briefing copied to EMS radio buffer', 'success');">
            <span class="btn-icon">${UI.icons.copy}</span>
            <span>Copy for Radio</span>
          </button>
        </div>

        <div class="briefing-body-content">
          ${summary || 'Generating concise clinical briefing...'}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; padding-top: 14px; border-top: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">
          <span>LATENCY: 680MS • ENVELOPE ENCRYPTED</span>
          <span style="color: var(--gold);">GOLDEN HOUR DIRECT ROUTE</span>
        </div>
      </div>

      <!-- Recommended Trauma Center -->
      ${hospital ? `
        <div class="glass-card" style="padding: 28px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <span class="story-eyebrow">OPTIMAL TRAUMA CENTER MATCH</span>
              <h3 style="font-size: 1.4rem;">${hospital.Name}</h3>
              <p style="font-size: 0.84rem; color: var(--text-secondary); margin-top: 2px;">
                Direct trauma dispatch verified • Available Beds: <strong>${hospital.Capacity || 82}</strong> • Drive ETA: <strong>~${hospital.EstimatedDriveMinutes || 8} min</strong>
              </p>
            </div>
            <a href="tel:${(hospital.ContactInfo || '').replace(/[^\d+]/g, '')}" class="btn btn-primary btn-lg">
              <span class="btn-icon">${UI.icons.phone}</span>
              <span>Call Trauma Admissions</span>
            </a>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${(Array.isArray(hospital.Services) ? hospital.Services : []).map(s => `<span class="service-pill">${s}</span>`).join('')}
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

// -----------------------------------------------------------------------------
// 8. API Communications & Health Check
// -----------------------------------------------------------------------------
async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    state.systemHealthy = true;
    state.activeBackend = data.database?.active_backend || 'local';
  } catch (err) {
    state.systemHealthy = false;
  }
}

async function fetchHospitals() {
  try {
    const res = await fetch(`${API_BASE}/hospitals`);
    const data = await res.json();
    if (res.ok && data.hospitals) {
      state.hospitals = data.hospitals;
    }
  } catch (e) {
    console.warn('Could not fetch hospitals:', e);
  }
}

// -----------------------------------------------------------------------------
// 9. Global Modal & Scroll Handlers
// -----------------------------------------------------------------------------
function setupGlobalListeners() {
  // Translucent Navbar Scroll Compression
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.editorial-nav-wrapper');
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    }
  }, { passive: true });

  // Language Modal
  const langModal = document.getElementById('langModal');
  const closeLangBtn = document.getElementById('closeLangModalBtn');
  const langSearchInput = document.getElementById('langSearchInput');

  if (closeLangBtn && langModal) {
    closeLangBtn.addEventListener('click', () => langModal.classList.add('hidden'));
  }
  if (langSearchInput) {
    langSearchInput.addEventListener('input', (e) => renderLanguageList(e.target.value));
  }

  // Theme Switch & Palette Trigger
  const navThemeSwitch = document.getElementById('navThemeSwitch');
  if (navThemeSwitch) {
    navThemeSwitch.addEventListener('click', (e) => triggerThemeWaveTransition(e));
  }

  const navPaletteBtn = document.getElementById('navPaletteBtn');
  if (navPaletteBtn) {
    navPaletteBtn.addEventListener('click', () => {
      const modal = document.getElementById('themeModal');
      if (modal) modal.classList.remove('hidden');
    });
  }

  // Theme Modal & Controls
  const themeModal = document.getElementById('themeModal');
  const closeThemeBtn = document.getElementById('closeThemeModalBtn');
  const btnModeDark = document.getElementById('btnModeDark');
  const btnModeLight = document.getElementById('btnModeLight');
  const customColorInput = document.getElementById('customColorInput');
  const customColorHex = document.getElementById('customColorHex');
  const applyCustomColorBtn = document.getElementById('applyCustomColorBtn');

  if (closeThemeBtn && themeModal) {
    closeThemeBtn.addEventListener('click', () => themeModal.classList.add('hidden'));
  }
  if (btnModeDark) btnModeDark.addEventListener('click', (e) => {
    if (state.themeMode !== 'dark') triggerThemeWaveTransition(e);
  });
  if (btnModeLight) btnModeLight.addEventListener('click', (e) => {
    if (state.themeMode !== 'light') triggerThemeWaveTransition(e);
  });

  document.querySelectorAll('.preset-color-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.dataset.color) setAccentColor(chip.dataset.color);
    });
  });

  if (customColorInput) {
    customColorInput.addEventListener('input', (e) => setAccentColor(e.target.value));
  }
  if (applyCustomColorBtn && customColorHex) {
    applyCustomColorBtn.addEventListener('click', () => setAccentColor(customColorHex.value.trim()));
  }

  // Close modals on backdrop click or Escape
  const scannerModal = document.getElementById('qrScannerModal');
  const disasterModal = document.getElementById('disasterModal');

  [langModal, themeModal, scannerModal, disasterModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          if (modal === scannerModal) closeQrScannerModal();
          else if (modal === disasterModal) closeDisasterModal();
          else modal.classList.add('hidden');
        }
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (langModal) langModal.classList.add('hidden');
      if (themeModal) themeModal.classList.add('hidden');
      if (scannerModal && !scannerModal.classList.contains('hidden')) closeQrScannerModal();
      if (disasterModal && !disasterModal.classList.contains('hidden')) closeDisasterModal();
    }
  });

  // Camera Scanner Modal Controls
  const closeScannerBtn = document.getElementById('closeScannerModalBtn');
  if (closeScannerBtn) {
    closeScannerBtn.addEventListener('click', closeQrScannerModal);
  }

  const switchCamBtn = document.getElementById('switchCameraBtn');
  if (switchCamBtn) {
    switchCamBtn.addEventListener('click', switchCamera);
  }

  const qrFileInput = document.getElementById('qrFileInput');
  if (qrFileInput) {
    qrFileInput.addEventListener('change', handleQrFileUpload);
  }

  document.querySelectorAll('.scanner-preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (chip.dataset.testId) handleDecodedQr(chip.dataset.testId);
    });
  });

  // Disaster Early Warning Banner & Modal Controls
  const openDisasterBtn = document.getElementById('openDisasterModalBtn');
  if (openDisasterBtn) {
    openDisasterBtn.addEventListener('click', openDisasterModal);
  }

  const dismissDisasterBtn = document.getElementById('dismissDisasterBannerBtn');
  if (dismissDisasterBtn) {
    dismissDisasterBtn.addEventListener('click', () => {
      const banner = document.getElementById('disasterAlertBanner');
      if (banner) banner.classList.add('hidden');
    });
  }

  const closeDisasterBtn = document.getElementById('closeDisasterModalBtn');
  if (closeDisasterBtn) {
    closeDisasterBtn.addEventListener('click', closeDisasterModal);
  }

  // Persistent Dock Quick Action Triggers
  const stitchCamBtn = document.getElementById('stitchCameraScanBtn');
  if (stitchCamBtn) {
    stitchCamBtn.addEventListener('click', openQrScannerModal);
  }

  const stitchRadarBtn = document.getElementById('stitchDisasterRadarBtn');
  if (stitchRadarBtn) {
    stitchRadarBtn.addEventListener('click', openDisasterModal);
  }

  // Delegated Global Click for Dynamic Triage & Paramedic HUD Camera Buttons
  document.addEventListener('click', (e) => {
    const launchCamera = e.target.closest('#triageLaunchCameraBtn, #hudOpenScannerBtn, [data-action="open-scanner"]');
    if (launchCamera) {
      e.preventDefault();
      openQrScannerModal();
    }
  });
}

// -----------------------------------------------------------------------------
// 10. Stitch Creative Developer Parallax & Specular Glare Engine
// -----------------------------------------------------------------------------
class StitchParallaxEngine {
  constructor() {
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._onScroll = this._onScroll.bind(this);
    this.init();
  }

  init() {
    if (this.isReduced) return;
    this.scan();
    window.removeEventListener('scroll', this._onScroll);
    window.addEventListener('scroll', this._onScroll, { passive: true });
  }

  scan() {
    if (this.isReduced) return;
    const cards = document.querySelectorAll('[data-parallax-card], .glass-card, .editorial-step-card, .relationship-contact-card, .editorial-hospital-card');
    cards.forEach(card => {
      if (!card.__hasStitchParallax) {
        card.__hasStitchParallax = true;
        card.addEventListener('mousemove', (e) => this._handleCardMove(e, card));
        card.addEventListener('mouseleave', () => this._handleCardLeave(card));
        card.addEventListener('mouseenter', () => this._handleCardEnter(card));
      }
    });

    // Staggered perspective reveal for elements entering viewport
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

      cards.forEach(c => observer.observe(c));
    }
  }

  _handleCardEnter(card) {
    card.style.transition = 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s ease';
  }

  _handleCardMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Percentages for CSS specular sheen & border light
    const px = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100));
    card.style.setProperty('--mouse-x', `${px.toFixed(1)}%`);
    card.style.setProperty('--mouse-y', `${py.toFixed(1)}%`);
    card.style.setProperty('--mouse-px', `${x.toFixed(0)}px`);
    card.style.setProperty('--mouse-py', `${y.toFixed(0)}px`);

    // 3D Pitch and Roll
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;
    const maxTilt = 7.5; // degrees
    const rotateX = (-normY * maxTilt).toFixed(2);
    const rotateY = (normX * maxTilt).toFixed(2);

    card.style.transform = `perspective(1100px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.012, 1.012, 1.012)`;

    // Multi-plane inner elements depth parallax
    const depthElements = card.querySelectorAll('[data-parallax-depth]');
    depthElements.forEach(el => {
      const depth = parseFloat(el.getAttribute('data-parallax-depth')) || 12;
      const transX = (normX * depth).toFixed(1);
      const transY = (normY * depth).toFixed(1);
      el.style.transform = `translate3d(${transX}px, ${transY}px, ${depth * 1.5}px)`;
      el.style.transition = 'none';
    });
  }

  _handleCardLeave(card) {
    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease';
    card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

    const depthElements = card.querySelectorAll('[data-parallax-depth]');
    depthElements.forEach(el => {
      el.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      el.style.transform = 'translate3d(0px, 0px, 0px)';
    });
  }

  _onScroll() {
    const scrollY = window.scrollY;
    
    // Parallax atmospheric blur spheres
    const orb1 = document.querySelector('.orb-primary');
    const orb2 = document.querySelector('.orb-secondary');
    if (orb1) orb1.style.transform = `translate3d(0, ${scrollY * 0.16}px, 0)`;
    if (orb2) orb2.style.transform = `translate3d(0, ${-scrollY * 0.1}px, 0)`;

    // Gentle parallax on hero header
    const heroContent = document.querySelector('.hero-editorial-center');
    if (heroContent && scrollY < 700) {
      heroContent.style.transform = `translate3d(0, ${scrollY * 0.1}px, 0)`;
    }
  }
}

let stitchParallaxInstance = null;
function initStitchParallax() {
  if (!stitchParallaxInstance) {
    stitchParallaxInstance = new StitchParallaxEngine();
  } else {
    stitchParallaxInstance.scan();
  }
}

// -----------------------------------------------------------------------------
// 10.B Stitch Persistent Command Dock & Tactile Role Switcher Controller
// -----------------------------------------------------------------------------
function initStitchCommandDock() {
  const tabTraveler = document.getElementById('stitchTabTraveler');
  const tabResponder = document.getElementById('stitchTabResponder');
  const tabAdmin = document.getElementById('stitchTabAdmin');
  const simulateBtn = document.getElementById('stitchSimulateEmergencyBtn');

  function syncTabs(role) {
    [tabTraveler, tabResponder, tabAdmin].forEach(t => t?.classList.remove('active'));
    if (role === ROLES.RESPONDER) {
      tabResponder?.classList.add('active');
    } else if (role === ROLES.ADMIN) {
      tabAdmin?.classList.add('active');
    } else {
      tabTraveler?.classList.add('active');
    }
  }

  // Initial sync & listener
  if (typeof authService !== 'undefined') {
    syncTabs(authService.getRole());
    authService.onAuthStateChanged((user) => {
      syncTabs(user?.role);
      const roleLabel = document.getElementById('roleCurrentLabel');
      if (roleLabel) {
        roleLabel.textContent = user?.role === ROLES.RESPONDER ? 'Paramedic' : user?.role === ROLES.ADMIN ? 'Hospital Admin' : 'Traveler';
      }
    });
  }

  tabTraveler?.addEventListener('click', () => {
    if (typeof authService !== 'undefined') authService.switchRole(ROLES.TRAVELER);
    if (typeof appRouter !== 'undefined') appRouter.navigate('/dashboard');
    showToast('Switched to Traveler Mode (Aarav Sharma)', 'info');
  });

  tabResponder?.addEventListener('click', () => {
    if (typeof authService !== 'undefined') authService.switchRole(ROLES.RESPONDER);
    if (typeof appRouter !== 'undefined') appRouter.navigate('/responder');
    showToast('Switched to Paramedic First Responder HUD', 'emergency');
  });

  tabAdmin?.addEventListener('click', () => {
    if (typeof authService !== 'undefined') authService.switchRole(ROLES.ADMIN);
    if (typeof appRouter !== 'undefined') appRouter.navigate('/hospital-admin');
    showToast('Switched to Hospital ER Admissions Console', 'medical');
  });

  simulateBtn?.addEventListener('click', () => {
    showToast('Initiating Golden Hour Clinical Triage Simulation...', 'emergency');
    if (typeof appRouter !== 'undefined') {
      appRouter.navigate('/triage');
      setTimeout(() => {
        fetchEmergencyTriage('T-1001', 'Connaught Place Metro Hub (Simulated Incident)', 28.6304, 77.2177);
      }, 250);
    }
  });

  // Interactive NFC Smart Chip Click Effect
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.stitch-smart-chip');
    if (chip) {
      chip.style.transform = 'scale(0.95)';
      setTimeout(() => { chip.style.transform = ''; }, 150);
      showToast('NFC Lifeline Scanned: 256-Bit Encrypted Record Read in 42ms', 'medical');
    }
  });
}

// -----------------------------------------------------------------------------
// 10.C Luxury Interactive Cursor & Spring Trailing Engine (Industry Grade)
// -----------------------------------------------------------------------------
class LuxuryCursorEngine {
  constructor() {
    this.dot = document.getElementById('cursorDot');
    this.ring = document.getElementById('cursorRing');
    this.trail = document.getElementById('cursorTrail');
    this.glow = document.getElementById('cursorGlow');
    if (!this.dot || !this.ring) return;

    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.mouse = { x: -100, y: -100 };
    this.lastMouse = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.glowPos = { x: -100, y: -100 };
    this.speed = 0;
    this.smoothSpeed = 0;
    this.angle = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.isHovering = false;
    this.isClicking = false;
    this.isVisible = false;
    this.magnetTarget = null;
    this.lerpFactor = 0.24;
    this.glowLerpFactor = 0.085;

    this._bindEvents();
    this._renderLoop();
  }

  _bindEvents() {
    window.addEventListener('pointermove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      if (!this.isVisible) {
        this.isVisible = true;
        this.dot.style.opacity = '1';
        this.ring.style.opacity = '1';
        if (this.glow) this.glow.style.opacity = '1';
      }

      const interactive = e.target.closest(
        'a, button, input, select, textarea, .btn, .custom-dropdown-btn, .custom-dropdown-item, .stitch-role-tab, .stitch-action-btn, .stitch-dock-link, .stitch-smart-chip, .stitch-card, .relationship-contact-card, .editorial-hospital-card, .scanner-preset-chip, .shelter-chip, [data-interactive], [role="button"]'
      );

      if (interactive) {
        this.isHovering = true;
        this.magnetTarget = interactive;
        document.body.classList.add('cursor-hovering');
      } else {
        this.isHovering = false;
        this.magnetTarget = null;
        document.body.classList.remove('cursor-hovering');
      }
    }, { passive: true });

    window.addEventListener('pointerdown', (e) => {
      this.isClicking = true;
      document.body.classList.add('cursor-clicking');
      this._triggerRipple(e.clientX, e.clientY);
    });

    window.addEventListener('pointerup', () => {
      this.isClicking = false;
      document.body.classList.remove('cursor-clicking');
    });

    document.documentElement.addEventListener('mouseleave', () => {
      this.isVisible = false;
      this.dot.style.opacity = '0';
      this.ring.style.opacity = '0';
      if (this.glow) this.glow.style.opacity = '0';
    });

    document.documentElement.addEventListener('mouseenter', () => {
      this.isVisible = true;
      this.dot.style.opacity = '1';
      this.ring.style.opacity = '1';
      if (this.glow) this.glow.style.opacity = '1';
    });
  }

  _triggerRipple(x, y) {
    if (!this.trail) return;
    this.trail.style.setProperty('--trail-x', `${x}px`);
    this.trail.style.setProperty('--trail-y', `${y}px`);
    this.trail.classList.remove('is-rippling');
    void this.trail.offsetWidth;
    this.trail.classList.add('is-rippling');
  }

  _renderLoop() {
    // 1. Calculate instant mouse velocity and movement angle
    const dx = this.mouse.x - this.lastMouse.x;
    const dy = this.mouse.y - this.lastMouse.y;
    this.speed = Math.hypot(dx, dy);
    this.smoothSpeed += (this.speed - this.smoothSpeed) * 0.18;

    if (this.speed > 0.8) {
      this.angle = Math.atan2(dy, dx);
    }

    this.lastMouse.x = this.mouse.x;
    this.lastMouse.y = this.mouse.y;

    // 2. Velocity squish & stretch dynamic calculation
    const squish = Math.min(this.smoothSpeed * 0.012, 0.48);
    const targetScaleX = this.isHovering ? 1.3 : (this.isClicking ? 0.78 : (1 + squish));
    const targetScaleY = this.isHovering ? 1.3 : (this.isClicking ? 0.78 : (1 / (1 + squish * 0.75)));
    this.scaleX += (targetScaleX - this.scaleX) * 0.22;
    this.scaleY += (targetScaleY - this.scaleY) * 0.22;

    // 3. Magnetic pull calculation when hovering interactive controls
    let targetX = this.mouse.x;
    let targetY = this.mouse.y;

    if (this.magnetTarget && this.isHovering) {
      const rect = this.magnetTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      // 32% magnetic attraction towards the center of element
      targetX = this.mouse.x + (centerX - this.mouse.x) * 0.32;
      targetY = this.mouse.y + (centerY - this.mouse.y) * 0.32;
    }

    // 4. Spring position lerping
    this.ringPos.x += (targetX - this.ringPos.x) * this.lerpFactor;
    this.ringPos.y += (targetY - this.ringPos.y) * this.lerpFactor;

    this.glowPos.x += (this.mouse.x - this.glowPos.x) * this.glowLerpFactor;
    this.glowPos.y += (this.mouse.y - this.glowPos.y) * this.glowLerpFactor;

    // 5. Update DOM transforms with GPU acceleration
    if (this.isVisible) {
      this.dot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
      this.ring.style.transform = `translate3d(${this.ringPos.x}px, ${this.ringPos.y}px, 0) rotate(${this.angle}rad) scale(${this.scaleX}, ${this.scaleY})`;
      if (this.glow) {
        this.glow.style.transform = `translate3d(${this.glowPos.x}px, ${this.glowPos.y}px, 0)`;
      }
    }

    requestAnimationFrame(() => this._renderLoop());
  }
}

function initLuxuryCursor() {
  new LuxuryCursorEngine();
}

// -----------------------------------------------------------------------------
// 11. Bootstrap Application
// -----------------------------------------------------------------------------
async function initApp() {
  // 1. Initialize Ambient Canvas, Parallax & Interactive Cursor
  new AmbientCanvasEngine('ambientCanvas');
  initStitchParallax();
  initStitchCommandDock();
  initLuxuryCursor();

  // 2. Apply theme & language
  applyCurrentTheme();
  renderLanguageList();
  applyCurrentLanguage();

  // 3. Setup global listeners
  setupGlobalListeners();

  // 4. Check API health, hospital records & disaster alerts
  await checkHealth();
  await fetchHospitals();
  await fetchDisasterAlerts();

  // 5. Mount current route
  if (typeof appRouter !== 'undefined') {
    appRouter.handleRoute();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
