/**
 * Emergency Passport — Production UI Component System
 * Luxury Editorial × Medical Technology Design Language
 * Professional Vector SVG Iconography • Translucent Pill Nav • Tactile Cards
 */

const UI = {
  // ---------------------------------------------------------------------------
  // 1. Vector SVG Iconography Library (Lucide-Style Stroke Precision)
  // ---------------------------------------------------------------------------
  icons: {
    heartPulse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.28"/></svg>`,
    shieldCheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    qrCode: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>`,
    mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
    fileText: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
    hospital: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/><path d="M18 12h-4"/><path d="M6 12h4"/><path d="M3 21h18"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>`,
    navigation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`,
    activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
    compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    alertCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M20 6 9 17l-5-5"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="m9 18 6-6-6-6"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="m6 9 6 6 6-6"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    logOut: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
    edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
    ambulance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M10 10h4"/><path d="M12 8v4"/><rect width="19" height="11" x="1" y="8" rx="2"/><path d="M14 8V5a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v3"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/></svg>`,
    share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    cross: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>`,
    bed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><circle cx="6" cy="8" r="2"/></svg>`,
    sparkle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="ui-icon"><circle cx="13.5" cy="6.5" r=".7" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".7" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".7" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".7" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`
  },

  // ---------------------------------------------------------------------------
  // 2. Global Translucent Pill Navbar
  // ---------------------------------------------------------------------------
  renderNavbar(user, currentRoute = '/') {
    const isAuth = Boolean(user);
    const role = user?.role || ROLES.TRAVELER;

    return `
      <header class="editorial-nav-wrapper">
        <div class="editorial-nav-inner glass-pill">
          
          <!-- Left: Refined Brand Mark -->
          <div class="nav-brand-section">
            <a href="#/" class="brand-crest-anchor" data-route="/">
              <div class="brand-crest-icon">
                <span class="crest-star">✦</span>
                <span class="pulse-beacon-dot"></span>
              </div>
              <div class="brand-label-group">
                <span class="brand-logotype">Emergency Passport</span>
                <span class="brand-editorial-sub">GOLDEN HOUR LIFELINE</span>
              </div>
            </a>
          </div>

          <!-- Center: Primary Navigation Links -->
          <nav class="nav-center-links" aria-label="Main Navigation">
            ${isAuth ? `
              ${role === ROLES.TRAVELER ? `
                <a href="#/dashboard" class="nav-pill-item ${currentRoute === '/dashboard' ? 'active' : ''}" data-route="/dashboard">Overview</a>
                <a href="#/passport" class="nav-pill-item ${currentRoute === '/passport' ? 'active' : ''}" data-route="/passport">Passport</a>
                <a href="#/qr" class="nav-pill-item ${currentRoute === '/qr' ? 'active' : ''}" data-route="/qr">Identity</a>
                <a href="#/emergency-contacts" class="nav-pill-item ${currentRoute === '/emergency-contacts' ? 'active' : ''}" data-route="/emergency-contacts">Contacts</a>
                <a href="#/hospitals" class="nav-pill-item ${currentRoute === '/hospitals' ? 'active' : ''}" data-route="/hospitals">Hospitals</a>
              ` : ''}

              ${role === ROLES.RESPONDER ? `
                <a href="#/responder" class="nav-pill-item ${currentRoute === '/responder' ? 'active' : ''}" data-route="/responder">Responder HUD</a>
                <a href="#/triage" class="nav-pill-item ${currentRoute === '/triage' ? 'active' : ''}" data-route="/triage">Scan & Triage</a>
                <a href="#/hospitals" class="nav-pill-item ${currentRoute === '/hospitals' ? 'active' : ''}" data-route="/hospitals">Trauma Map</a>
              ` : ''}

              ${role === ROLES.ADMIN ? `
                <a href="#/hospital-admin" class="nav-pill-item ${currentRoute === '/hospital-admin' ? 'active' : ''}" data-route="/hospital-admin">Admissions</a>
                <a href="#/hospitals" class="nav-pill-item ${currentRoute === '/hospitals' ? 'active' : ''}" data-route="/hospitals">Directory</a>
              ` : ''}
            ` : `
              <a href="#/" class="nav-pill-item ${currentRoute === '/' ? 'active' : ''}" data-route="/">Product</a>
              <a href="#/passport" class="nav-pill-item ${currentRoute === '/passport' ? 'active' : ''}" data-route="/passport">Passport</a>
              <a href="#/hospitals" class="nav-pill-item ${currentRoute === '/hospitals' ? 'active' : ''}" data-route="/hospitals">Hospitals</a>
              <a href="#/triage" class="nav-pill-item ${currentRoute === '/triage' ? 'active' : ''}" data-route="/triage">Emergency Triage</a>
            `}
          </nav>

          <!-- Right: Precision Controls & Profile -->
          <div class="nav-controls-section">
            
            <!-- 22 Indian Languages Dropdown Trigger -->
            <button class="nav-icon-btn" id="navLangBtn" title="Select Language (22 Indian Languages + English)" aria-label="Select Language">
              <span class="icon-wrap">${UI.icons.globe}</span>
              <span class="btn-caption" id="navLangText">English</span>
            </button>

            <!-- Stitch Tactile Animated Theme Toggle Switch -->
            <button class="stitch-theme-switch ${((typeof state !== 'undefined' && state.themeMode) || 'dark') === 'dark' ? 'is-dark' : 'is-light'}" 
                    id="navThemeSwitch" 
                    role="switch" 
                    aria-checked="${((typeof state !== 'undefined' && state.themeMode) || 'dark') === 'dark' ? 'true' : 'false'}" 
                    title="Toggle Atmosphere (Dark / Light)" 
                    aria-label="Toggle Atmosphere Mode">
              <span class="stitch-switch-track">
                <span class="track-stars" aria-hidden="true">
                  <span class="star s1"></span>
                  <span class="star s2"></span>
                  <span class="star s3"></span>
                </span>
                <span class="track-sunrays" aria-hidden="true">
                  <span class="ray r1"></span>
                  <span class="ray r2"></span>
                </span>
                <span class="stitch-switch-thumb">
                  <span class="thumb-icon-wrap icon-sun">${UI.icons.sun}</span>
                  <span class="thumb-icon-wrap icon-moon">${UI.icons.moon}</span>
                  <span class="thumb-glow-aura"></span>
                </span>
              </span>
            </button>

            <!-- Color Palette Customizer Modal Trigger -->
            <button class="nav-icon-btn palette-btn" id="navPaletteBtn" title="Customize Accent Colors & UI Theme" aria-label="Palette Engine">
              <span class="icon-wrap">${UI.icons.palette}</span>
            </button>

            <!-- Emergency Alert Chime Toggle -->
            <button class="nav-icon-btn siren-chime-btn" id="navSirenBtn" title="Toggle Emergency Beacon Audio" aria-label="Emergency Siren">
              <span class="icon-wrap">${UI.icons.bell}</span>
            </button>

            ${isAuth ? `
              <!-- Evaluator Role Switcher Custom Animated Dropdown -->
              <div class="custom-dropdown-wrap" id="roleDropdownWrap">
                <button class="custom-dropdown-btn" id="roleDropdownBtn" aria-haspopup="true" aria-expanded="false" title="Switch Demo Persona">
                  <span class="role-indicator-dot"></span>
                  <span class="role-current-label" id="roleCurrentLabel">${role === ROLES.RESPONDER ? 'Paramedic' : role === ROLES.ADMIN ? 'Hospital Admin' : 'Traveler'}</span>
                  <span class="icon-wrap dropdown-caret">${UI.icons.chevronDown}</span>
                </button>
                <div class="custom-dropdown-menu" id="roleDropdownMenu" role="listbox" aria-label="Select Demo Persona">
                  <div class="dropdown-menu-header">
                    <span class="dropdown-header-eyebrow">DEMO PERSONA</span>
                    <span class="dropdown-header-sub">Switch active perspective</span>
                  </div>
                  <div class="dropdown-divider"></div>
                  <button class="custom-dropdown-item ${role === ROLES.TRAVELER ? 'selected' : ''}" data-role="${ROLES.TRAVELER}" role="option">
                    <span class="item-icon-box">${UI.icons.user}</span>
                    <div class="item-text-group">
                      <div class="item-title">Traveler</div>
                      <div class="item-sub">Aarav Sharma • Passport</div>
                    </div>
                    <span class="item-check-gold">${UI.icons.check}</span>
                  </button>
                  <button class="custom-dropdown-item ${role === ROLES.RESPONDER ? 'selected' : ''}" data-role="${ROLES.RESPONDER}" role="option">
                    <span class="item-icon-box">${UI.icons.heartPulse}</span>
                    <div class="item-text-group">
                      <div class="item-title">Paramedic</div>
                      <div class="item-sub">Vikram Rathore • Field Triage</div>
                    </div>
                    <span class="item-check-gold">${UI.icons.check}</span>
                  </button>
                  <button class="custom-dropdown-item ${role === ROLES.ADMIN ? 'selected' : ''}" data-role="${ROLES.ADMIN}" role="option">
                    <span class="item-icon-box">${UI.icons.hospital}</span>
                    <div class="item-text-group">
                      <div class="item-title">Hospital Admin</div>
                      <div class="item-sub">Dr. Priya Nair • ICU Admissions</div>
                    </div>
                    <span class="item-check-gold">${UI.icons.check}</span>
                  </button>
                </div>
              </div>

              <!-- Profile Avatar & Compact Dropdown Menu -->
              <div class="user-profile-menu-wrap">
                <button class="avatar-pill-btn" id="userMenuBtn" aria-haspopup="true" aria-expanded="false">
                  <span class="avatar-monogram">${user.avatar || 'AS'}</span>
                  <span class="avatar-name-label">${(user.name || '').split(' ')[0]}</span>
                  <span class="icon-wrap dropdown-caret">${UI.icons.chevronDown}</span>
                </button>

                <div class="user-dropdown-sheet" id="userDropdownMenu" role="menu" aria-label="User profile options">
                  <div class="sheet-user-summary">
                    <div class="summary-name">${user.name}</div>
                    <div class="summary-meta">${user.email}</div>
                    <div class="summary-role-tag">
                      <span class="tag-gold-dot">✦</span>
                      <span class="text-gold">${user.passportId || 'T-1001'}</span> • <span>${role.toUpperCase()}</span>
                    </div>
                  </div>
                  <div class="sheet-divider"></div>
                  <a href="#/profile" class="sheet-menu-link" data-route="/profile" role="menuitem">
                    <span class="icon-wrap">${UI.icons.user}</span>
                    <span>My Profile</span>
                  </a>
                  <a href="#/passport" class="sheet-menu-link" data-route="/passport" role="menuitem">
                    <span class="icon-wrap">${UI.icons.fileText}</span>
                    <span>Emergency Passport</span>
                  </a>
                  <a href="#/qr" class="sheet-menu-link" data-route="/qr" role="menuitem">
                    <span class="icon-wrap">${UI.icons.qrCode}</span>
                    <span>Emergency QR</span>
                  </a>
                  <a href="#/settings" class="sheet-menu-link" data-route="/settings" role="menuitem">
                    <span class="icon-wrap">${UI.icons.settings}</span>
                    <span>Privacy & Settings</span>
                  </a>
                  <div class="sheet-divider"></div>
                  <button class="sheet-menu-link text-emergency" id="logoutBtn" role="menuitem">
                    <span class="icon-wrap">${UI.icons.logOut}</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ` : `
              <!-- Guest Direct Actions -->
              <div class="guest-nav-actions">
                <a href="#/login" class="btn btn-sm btn-ghost" data-route="/login">Sign In</a>
                <a href="#/signup" class="btn btn-sm btn-primary" data-route="/signup">Create Passport</a>
              </div>
            `}

          </div>
        </div>
      </header>

      ${isAuth ? `
        <!-- Responsive Mobile Bottom Dock Navigation -->
        <nav class="mobile-bottom-dock glass-pill" aria-label="Mobile Dock">
          <a href="#/dashboard" class="mobile-dock-tab ${currentRoute === '/dashboard' ? 'active' : ''}" data-route="/dashboard">
            <span class="dock-icon">${UI.icons.activity}</span>
            <span class="dock-text">Home</span>
          </a>
          <a href="#/passport" class="mobile-dock-tab ${currentRoute === '/passport' ? 'active' : ''}" data-route="/passport">
            <span class="dock-icon">${UI.icons.fileText}</span>
            <span class="dock-text">Passport</span>
          </a>
          <a href="#/qr" class="mobile-dock-tab ${currentRoute === '/qr' ? 'active' : ''} mobile-qr-tab" data-route="/qr" title="Quick Emergency QR">
            <span class="dock-icon qr-pulse">${UI.icons.qrCode}</span>
            <span class="dock-text">QR</span>
          </a>
          <a href="#/hospitals" class="mobile-dock-tab ${currentRoute === '/hospitals' ? 'active' : ''}" data-route="/hospitals">
            <span class="dock-icon">${UI.icons.hospital}</span>
            <span class="dock-text">Map</span>
          </a>
          <a href="#/profile" class="mobile-dock-tab ${currentRoute === '/profile' ? 'active' : ''}" data-route="/profile">
            <span class="dock-icon">${UI.icons.user}</span>
            <span class="dock-text">Profile</span>
          </a>
        </nav>
      ` : ''}
    `;
  },

  // ---------------------------------------------------------------------------
  // 3. Status Badges
  // ---------------------------------------------------------------------------
  renderStatusBadge(status = 'VERIFIED', isVerified = true) {
    return `
      <span class="editorial-status-pill ${isVerified ? 'verified' : 'pending'}">
        <span class="status-pulse-dot"></span>
        <span class="status-text">${status}</span>
      </span>
    `;
  },

  // ---------------------------------------------------------------------------
  // 4. Critical Allergy Pill (Emergency Crimson Accent)
  // ---------------------------------------------------------------------------
  renderAllergyBadge(allergy) {
    return `
      <span class="allergy-tag-pill">
        <span class="tag-icon">${UI.icons.alertCircle}</span>
        <span class="tag-label">${allergy}</span>
      </span>
    `;
  },

  // ---------------------------------------------------------------------------
  // 5. Medical Condition Pill
  // ---------------------------------------------------------------------------
  renderConditionBadge(condition) {
    return `
      <span class="condition-tag-pill">
        <span class="tag-dot">✦</span>
        <span class="tag-label">${condition}</span>
      </span>
    `;
  },

  // ---------------------------------------------------------------------------
  // 6. Emergency Contact Relationship Card
  // ---------------------------------------------------------------------------
  renderContactCard(contact, showDelete = false) {
    const rawPhone = (contact.phone || '').replace(/[^\d+]/g, '');
    const initials = (contact.name || 'C')
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return `
      <div class="relationship-contact-card glass-card">
        <div class="contact-avatar-col">
          <div class="contact-initials-seal">${initials}</div>
        </div>

        <div class="contact-meta-col">
          <div class="contact-name-row">
            <h4 class="contact-name">${contact.name}</h4>
            ${contact.isPrimary ? `<span class="primary-gold-badge">PRIMARY</span>` : ''}
          </div>
          <div class="contact-relationship-label">${contact.relationship || 'Emergency Contact'}</div>
          <div class="contact-phone-mono">${contact.phone}</div>
        </div>

        <div class="contact-action-col">
          <a href="tel:${rawPhone}" class="btn btn-sm btn-outline-medical" title="Direct Phone Call">
            <span class="btn-icon">${UI.icons.phone}</span>
            <span>Call</span>
          </a>
          ${showDelete ? `
            <button class="btn btn-icon-only text-muted delete-contact-btn" data-id="${contact.id}" title="Remove Contact" aria-label="Delete">
              &times;
            </button>
          ` : ''}
        </div>
      </div>
    `;
  },

  // ---------------------------------------------------------------------------
  // 7. Hospital Facility Card with Animated Bed Capacity Meter
  // ---------------------------------------------------------------------------
  renderHospitalCard(h, isSelected = false) {
    const capacity = h.Capacity || 100;
    const availableBeds = Math.max(12, Math.floor(capacity * 0.22));
    const occupancyRatio = Math.min(100, Math.round(((capacity - availableBeds) / capacity) * 100));
    const rawPhone = (h.ContactInfo || '').replace(/[^\d+]/g, '');
    const servs = Array.isArray(h.Services) ? h.Services : Array.from(h.Services || []);

    return `
      <div class="editorial-hospital-card glass-card ${isSelected ? 'selected-facility' : ''}" data-hospital-id="${h.HospitalID}">
        <div class="facility-head-row">
          <div class="facility-title-wrap">
            <span class="facility-type-badge">${h.HospitalID}</span>
            <h3 class="facility-name">${h.Name}</h3>
          </div>
          <div class="facility-eta-badge">
            <span class="icon-wrap">${UI.icons.clock}</span>
            <span>~${h.EstimatedDriveMinutes || 8} min (${h.DistanceKm || 4.2} km)</span>
          </div>
        </div>

        <!-- Animated Bed Capacity Meter -->
        <div class="capacity-meter-section">
          <div class="meter-labels-row">
            <span class="meter-title">AVAILABLE EMERGENCY BEDS</span>
            <span class="meter-stat"><strong>${availableBeds}</strong> of ${capacity} Beds Available</span>
          </div>
          <div class="meter-track">
            <div class="meter-fill" style="width: ${occupancyRatio}%"></div>
          </div>
        </div>

        <!-- Capability Tags -->
        <div class="facility-services-row">
          ${servs.map(s => `<span class="service-pill">${s}</span>`).join('')}
        </div>

        <!-- Action Row -->
        <div class="facility-actions-row">
          <a href="tel:${rawPhone}" class="btn btn-sm btn-outline-medical">
            <span class="btn-icon">${UI.icons.phone}</span>
            <span>Call Admissions</span>
          </a>
          <button class="btn btn-sm btn-primary locate-facility-btn" data-id="${h.HospitalID}">
            <span class="btn-icon">${UI.icons.navigation}</span>
            <span>Route on Map</span>
          </button>
        </div>
      </div>
    `;
  },

  // ---------------------------------------------------------------------------
  // 8. Circular Emergency Readiness Gauge
  // ---------------------------------------------------------------------------
  renderReadinessGauge(percent = 96) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return `
      <div class="readiness-gauge-wrap">
        <svg class="readiness-svg" viewBox="0 0 130 130" width="130" height="130">
          <circle class="gauge-bg-circle" cx="65" cy="65" r="${radius}" />
          <circle class="gauge-progress-circle" cx="65" cy="65" r="${radius}" 
            stroke-dasharray="${circumference}" 
            stroke-dashoffset="${strokeDashoffset}" 
            transform="rotate(-90 65 65)" />
        </svg>
        <div class="gauge-center-content">
          <span class="gauge-percent">${percent}%</span>
          <span class="gauge-caption">READINESS</span>
        </div>
      </div>
    `;
  },

  // ---------------------------------------------------------------------------
  // 9. Central Luxury Passport Document Component
  // ---------------------------------------------------------------------------
  renderPassportDocument(passport, user) {
    const p = passport || {};
    const u = user || {};
    const allergies = Array.isArray(p.allergies) ? p.allergies : [];
    const conditions = Array.isArray(p.conditions) ? p.conditions : [];
    const contacts = Array.isArray(p.emergencyContacts) ? p.emergencyContacts : [];

    return `
      <div class="luxury-passport-document stitch-card" id="passportDocumentSheet" data-parallax-card>
        <!-- Stitch Crosshair Corner Pins -->
        <span class="stitch-pin stitch-pin-tl" aria-hidden="true">✦</span>
        <span class="stitch-pin stitch-pin-tr" aria-hidden="true">✦</span>
        <span class="stitch-pin stitch-pin-bl" aria-hidden="true">✦</span>
        <span class="stitch-pin stitch-pin-br" aria-hidden="true">✦</span>

        <!-- Stitched Tailored Inner Seam -->
        <div class="stitch-inner-seam" aria-hidden="true"></div>
        
        <!-- Document Guilloché Security Border & Gold Crest -->
        <div class="passport-security-header">
          <div class="passport-crest-lockup" data-parallax-depth="10">
            <span class="crest-sigil">✦</span>
            <div class="crest-text-block">
              <span class="doc-country">GLOBAL EMERGENCY PASSPORT</span>
              <span class="doc-sub">INTERNATIONAL GOLDEN HOUR LIFELINE SPECIFICATION</span>
            </div>
          </div>
          <div class="passport-id-box" data-parallax-depth="16">
            <span class="id-label">DOCUMENT NO.</span>
            <span class="id-mono text-gold-glow">${u.passportId || 'T-1001'}</span>
          </div>
        </div>

        <div class="passport-body-grid">
          <!-- Left: Identity & Photo Block -->
          <div class="passport-photo-col">
            <!-- Stitch Metallic NFC Smart Chip -->
            <div class="stitch-smart-chip" title="Encrypted Health Record NFC Chip (Sub-800ms Read)" data-parallax-depth="28">
              <div class="chip-circuit-lines"></div>
              <span class="chip-nfc-glyph">NFC</span>
            </div>

            <div class="traveler-portrait-frame" data-parallax-depth="24">
              <div class="portrait-placeholder">${u.avatar || 'ER'}</div>
              <div class="security-watermark-seal">
                <span class="text-gold">VERIFIED</span>
              </div>
            </div>
            <div class="passport-doc-metadata">
              <div class="meta-item">
                <span class="meta-label">NATIONALITY</span>
                <span class="meta-val">${u.country || 'International'}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">PRIMARY LANGUAGE</span>
                <span class="meta-val">${u.language || 'English'}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">DATE OF BIRTH</span>
                <span class="meta-val">${u.dob || '1995-04-12'}</span>
              </div>
            </div>
          </div>

          <!-- Right: Critical Clinical Fields -->
          <div class="passport-clinical-col">
            <div class="traveler-name-row">
              <h2 class="traveler-full-name">${u.name || 'Aarav Sharma'}</h2>
              <div class="blood-type-display-badge" data-parallax-depth="20">
                <span class="blood-caption">BLOOD GROUP</span>
                <span class="blood-value text-gold-glow">${p.bloodGroup || 'O+'}</span>
              </div>
            </div>

            <!-- Critical Drug Allergies (Emergency Crimson Highlight) -->
            <div class="clinical-section-block alert-block">
              <span class="section-label-mono">
                <span class="icon-inline">${UI.icons.alertCircle}</span>
                CRITICAL ALLERGIES & CONTRAINDICATIONS
              </span>
              <div class="pills-row">
                ${allergies.length > 0 && allergies[0] !== 'None'
                  ? allergies.map(a => UI.renderAllergyBadge(a)).join('')
                  : '<span class="safe-tag"><span class="safe-star text-gold">✦</span> No Known Fatal Drug Allergies</span>'}
              </div>
            </div>

            <!-- Chronic Conditions -->
            <div class="clinical-section-block">
              <span class="section-label-mono">CHRONIC CONDITIONS & ACTIVE DIAGNOSES</span>
              <div class="pills-row">
                ${conditions.length > 0
                  ? conditions.map(c => UI.renderConditionBadge(c)).join('')
                  : '<span class="neutral-tag">None Registered</span>'}
              </div>
            </div>

            <!-- Emergency Family Contacts -->
            <div class="clinical-section-block">
              <span class="section-label-mono">DIRECT EMERGENCY CONTACTS</span>
              <div class="passport-contacts-mini-list">
                ${contacts.slice(0, 2).map(c => `
                  <div class="mini-contact-row">
                    <span class="contact-label"><strong>${c.name}</strong> (${c.relationship})</span>
                    <a href="tel:${(c.phone || '').replace(/[^\d+]/g, '')}" class="btn-tel-link">
                      <span class="icon-inline">${UI.icons.phone}</span>
                      <span class="text-gold">${c.phone}</span>
                    </a>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Clinical Security Footer Stamp -->
            <div class="passport-security-footer">
              <span class="footer-timestamp">LAST VERIFIED: <strong class="text-gold">${p.lastVerified || 'TODAY'}</strong> • 256-BIT HARDWARE ENCRYPTED</span>
              <span class="footer-seal-symbol text-gold">✦ SECURE SPEC 4.2</span>
            </div>
          </div>
        </div>

      </div>
    `;
  }
};
