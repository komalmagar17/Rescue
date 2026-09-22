/**
 * Emergency Passport — Reusable UI Components
 * Consistent SaaS Component System (Navbar, Badges, Cards, Modals, Dialogs)
 */

const UI = {
  // ---------------------------------------------------------------------------
  // Top Navbar
  // ---------------------------------------------------------------------------
  renderNavbar(user, currentRoute = '/') {
    const isAuth = Boolean(user);
    const role = user?.role || ROLES.TRAVELER;

    return `
      <header class="app-header-wrapper">
        <div class="app-header-inner glass-card">
          <div class="header-left">
            <a href="#/" class="brand-link" data-route="/">
              <div class="brand-heart-icon">
                <span class="heart-pulse-dot"></span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="brand-svg-icon">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                </svg>
              </div>
              <div class="brand-text-block">
                <span class="brand-main-title" data-i18n="app_title">Emergency Passport</span>
                <span class="brand-tagline">GOLDEN HOUR LIFELINE</span>
              </div>
            </a>

            ${isAuth ? `
              <!-- Navigation Links for Authenticated Users -->
              <nav class="desktop-nav-links">
                ${role === ROLES.TRAVELER ? `
                  <a href="#/dashboard" class="nav-item ${currentRoute === '/dashboard' ? 'active' : ''}" data-route="/dashboard">Dashboard</a>
                  <a href="#/passport" class="nav-item ${currentRoute === '/passport' ? 'active' : ''}" data-route="/passport">My Passport</a>
                  <a href="#/qr" class="nav-item ${currentRoute === '/qr' ? 'active' : ''}" data-route="/qr">QR Identity</a>
                  <a href="#/emergency-contacts" class="nav-item ${currentRoute === '/emergency-contacts' ? 'active' : ''}" data-route="/emergency-contacts">Contacts</a>
                  <a href="#/hospitals" class="nav-item ${currentRoute === '/hospitals' ? 'active' : ''}" data-route="/hospitals">Hospitals</a>
                ` : ''}

                ${role === ROLES.RESPONDER ? `
                  <a href="#/responder" class="nav-item ${currentRoute === '/responder' ? 'active' : ''}" data-route="/responder">Responder HUD</a>
                  <a href="#/triage" class="nav-item ${currentRoute === '/triage' ? 'active' : ''}" data-route="/triage">Scan & Triage</a>
                  <a href="#/hospitals" class="nav-item ${currentRoute === '/hospitals' ? 'active' : ''}" data-route="/hospitals">Trauma Facilities</a>
                ` : ''}

                ${role === ROLES.ADMIN ? `
                  <a href="#/hospital-admin" class="nav-item ${currentRoute === '/hospital-admin' ? 'active' : ''}" data-route="/hospital-admin">Facility Admin</a>
                  <a href="#/hospitals" class="nav-item ${currentRoute === '/hospitals' ? 'active' : ''}" data-route="/hospitals">Directory</a>
                ` : ''}
              </nav>
            ` : `
              <!-- Navigation Links for Guests -->
              <nav class="desktop-nav-links">
                <a href="#/" class="nav-item ${currentRoute === '/' ? 'active' : ''}" data-route="/">Product</a>
                <a href="#/triage" class="nav-item ${currentRoute === '/triage' ? 'active' : ''}" data-route="/triage">Emergency Triage</a>
                <a href="#/hospitals" class="nav-item ${currentRoute === '/hospitals' ? 'active' : ''}" data-route="/hospitals">Hospital Directory</a>
              </nav>
            `}
          </div>

          <div class="header-right">
            <!-- 22 Indian Languages Switcher Button -->
            <button class="nav-tool-btn" id="navLangBtn" title="Switch Language (All 22 Indian Languages)">
              <span class="tool-flag">🇮🇳</span>
              <span id="navLangText">English</span>
            </button>

            <!-- Theme & Custom Color Customizer Button -->
            <button class="nav-tool-btn" id="navThemeBtn" title="Customize UI Colors & Mode">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <circle cx="12" cy="12" r="10"/><path d="M12 2a7 7 0 0 0 7 7c0 2-2 3-2 3"/><path d="M12 22a7 7 0 0 0-7-7c0-2 2-3 2-3"/>
              </svg>
            </button>

            <!-- Audio Siren Chime -->
            <button class="nav-tool-btn siren-btn" id="navSirenBtn" title="Toggle Emergency Siren Chime">
              <span class="siren-icon">🔔</span>
            </button>

            ${isAuth ? `
              <!-- Role Switcher Quick Pill (Evaluator Convenience) -->
              <div class="role-selector-pill" title="Switch Demo User Role">
                <select id="roleSwitchSelect" class="role-select">
                  <option value="${ROLES.TRAVELER}" ${role === ROLES.TRAVELER ? 'selected' : ''}>👤 Traveler</option>
                  <option value="${ROLES.RESPONDER}" ${role === ROLES.RESPONDER ? 'selected' : ''}>🚑 Paramedic</option>
                  <option value="${ROLES.ADMIN}" ${role === ROLES.ADMIN ? 'selected' : ''}>🏥 Hospital Admin</option>
                </select>
              </div>

              <!-- User Profile Dropdown -->
              <div class="user-menu-wrapper">
                <button class="user-avatar-btn" id="userMenuBtn" aria-haspopup="true" aria-expanded="false">
                  <div class="user-avatar-circle">${user.avatar || 'US'}</div>
                  <span class="user-firstname">${(user.name || '').split(' ')[0]}</span>
                  <svg class="dropdown-arrow" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                </button>

                <div class="user-dropdown-menu hidden" id="userDropdownMenu">
                  <div class="dropdown-header">
                    <div class="dropdown-name">${user.name}</div>
                    <div class="dropdown-email">${user.email}</div>
                    <div class="dropdown-badge">${role.toUpperCase()}</div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <a href="#/profile" class="dropdown-item" data-route="/profile">
                    <span>👤</span> My Profile
                  </a>
                  <a href="#/passport" class="dropdown-item" data-route="/passport">
                    <span>💳</span> Emergency Passport
                  </a>
                  <a href="#/settings" class="dropdown-item" data-route="/settings">
                    <span>⚙️</span> Privacy & Settings
                  </a>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item text-danger" id="logoutBtn">
                    <span>🚪</span> Log Out
                  </button>
                </div>
              </div>
            ` : `
              <!-- Guest Action Buttons -->
              <div class="guest-auth-actions">
                <a href="#/login" class="btn btn-ghost btn-sm" data-route="/login">Log In</a>
                <a href="#/signup" class="btn btn-primary btn-sm" data-route="/signup">Create Passport</a>
              </div>
            `}
          </div>
        </div>
      </header>

      ${isAuth ? `
        <!-- Mobile Bottom Dock Navigation -->
        <nav class="mobile-bottom-dock glass-card">
          <a href="#/dashboard" class="mobile-dock-item ${currentRoute === '/dashboard' ? 'active' : ''}" data-route="/dashboard">
            <span class="dock-icon">⚡</span>
            <span class="dock-label">Home</span>
          </a>
          <a href="#/passport" class="mobile-dock-item ${currentRoute === '/passport' ? 'active' : ''}" data-route="/passport">
            <span class="dock-icon">💳</span>
            <span class="dock-label">Passport</span>
          </a>
          <a href="#/qr" class="mobile-dock-item ${currentRoute === '/qr' ? 'active' : ''}" data-route="/qr">
            <span class="dock-icon">📲</span>
            <span class="dock-label">QR</span>
          </a>
          <a href="#/triage" class="mobile-dock-item ${currentRoute === '/triage' ? 'active' : ''}" data-route="/triage">
            <span class="dock-icon">🚑</span>
            <span class="dock-label">Triage</span>
          </a>
          <a href="#/profile" class="mobile-dock-item ${currentRoute === '/profile' ? 'active' : ''}" data-route="/profile">
            <span class="dock-icon">👤</span>
            <span class="dock-label">Profile</span>
          </a>
        </nav>
      ` : ''}
    `;
  },

  // ---------------------------------------------------------------------------
  // Status Badge
  // ---------------------------------------------------------------------------
  renderStatusBadge(status = 'ACTIVE', isVerified = true) {
    return `
      <span class="status-pill-badge ${isVerified ? 'verified' : 'pending'}">
        <span class="status-dot-pulse"></span>
        <span>${status}</span>
      </span>
    `;
  },

  // ---------------------------------------------------------------------------
  // Allergy Badge
  // ---------------------------------------------------------------------------
  renderAllergyBadge(allergy) {
    return `
      <span class="allergy-tag-pill">
        <span class="allergy-symbol">⛔</span>
        <span>${allergy}</span>
      </span>
    `;
  },

  // ---------------------------------------------------------------------------
  // Condition Badge
  // ---------------------------------------------------------------------------
  renderConditionBadge(condition) {
    return `
      <span class="condition-tag-pill">
        <span>${condition}</span>
      </span>
    `;
  },

  // ---------------------------------------------------------------------------
  // Emergency Contact Card
  // ---------------------------------------------------------------------------
  renderContactCard(contact, showDelete = false) {
    const rawPhone = (contact.phone || '').replace(/[^\d+]/g, '');
    return `
      <div class="contact-entry-card glass-card">
        <div class="contact-bio">
          <div class="contact-name">${contact.name}</div>
          <div class="contact-relation">
            ${contact.relationship}
            ${contact.isPrimary ? '<span class="primary-flag">PRIMARY</span>' : ''}
          </div>
          <div class="contact-phone-number">📞 ${contact.phone}</div>
        </div>
        <div class="contact-card-actions">
          <a href="tel:${rawPhone}" class="btn btn-sm btn-call-primary">
            📞 Call Now
          </a>
          ${showDelete ? `
            <button class="btn btn-xs btn-outline-danger delete-contact-btn" data-id="${contact.id}">
              &times;
            </button>
          ` : ''}
        </div>
      </div>
    `;
  },

  // ---------------------------------------------------------------------------
  // Quick Action Card
  // ---------------------------------------------------------------------------
  renderQuickAction(icon, title, subtitle, route, isDanger = false) {
    return `
      <a href="#${route}" class="quick-action-card glass-card ${isDanger ? 'action-danger' : ''}" data-route="${route}">
        <div class="action-icon-box">${icon}</div>
        <div class="action-content">
          <div class="action-title">${title}</div>
          <div class="action-desc">${subtitle}</div>
        </div>
        <svg class="action-arrow" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
      </a>
    `;
  },

  // ---------------------------------------------------------------------------
  // Hospital Facility Card
  // ---------------------------------------------------------------------------
  renderHospitalCard(hospital) {
    const capacity = hospital.Capacity || 100;
    const services = Array.isArray(hospital.Services) ? hospital.Services : Array.from(hospital.Services || []);
    const servPills = services.map(s => `<span class="service-chip">${s}</span>`).join(' ');

    return `
      <div class="facility-card glass-card">
        <div class="facility-head">
          <div class="facility-meta">
            <h4 class="facility-name">${hospital.Name}</h4>
            <span class="facility-id">${hospital.HospitalID}</span>
          </div>
          <a href="tel:${(hospital.ContactInfo || '').replace(/[^\d+]/g, '')}" class="btn btn-sm btn-outline">
            📞 Hotline
          </a>
        </div>
        <div class="facility-capacity-row">
          <span>Bed Capacity: <strong>${capacity} Beds</strong></span>
          <div class="capacity-track">
            <div class="capacity-bar" style="width: ${Math.min(Math.round(capacity / 5), 100)}%;"></div>
          </div>
        </div>
        <div class="facility-phone">📞 ${hospital.ContactInfo || 'Direct ambulance desk'}</div>
        <div class="facility-services-list">
          ${servPills}
        </div>
      </div>
    `;
  },

  // ---------------------------------------------------------------------------
  // Empty State Component
  // ---------------------------------------------------------------------------
  renderEmptyState(title, message, buttonText, buttonRoute) {
    return `
      <div class="empty-state-box glass-card">
        <div class="empty-icon-circle">📂</div>
        <h3 class="empty-title">${title}</h3>
        <p class="empty-message">${message}</p>
        ${buttonText ? `
          <a href="#${buttonRoute}" class="btn btn-primary btn-sm" data-route="${buttonRoute}">
            ${buttonText}
          </a>
        ` : ''}
      </div>
    `;
  },
};
