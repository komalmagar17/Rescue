/**
 * Emergency Passport — Client-Side Router & Route Guard
 * Handles SPA navigation, protected routes, and view mounting.
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = '/';
    this._init();
  }

  _init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('DOMContentLoaded', () => this.handleRoute());

    // Intercept clicks on links with data-route
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route') || link.getAttribute('href').replace(/^#/, '');
        this.navigate(route);
      }
    });

    // React to auth state changes
    authService.onAuthStateChanged(() => {
      this.handleRoute();
    });
  }

  navigate(route) {
    if (!route.startsWith('/')) route = '/' + route;
    window.location.hash = '#' + route;
  }

  getRoute() {
    const hash = window.location.hash.slice(1);
    if (!hash || hash === '') return '/';
    return hash.split('?')[0];
  }

  getQueryParams() {
    const hash = window.location.hash.slice(1);
    const queryIdx = hash.indexOf('?');
    if (queryIdx === -1) return {};
    const queryStr = hash.slice(queryIdx + 1);
    const params = new URLSearchParams(queryStr);
    const res = {};
    for (const [k, v] of params.entries()) res[k] = v;
    return res;
  }

  async handleRoute() {
    const route = this.getRoute();
    this.currentRoute = route;

    const user = authService.getUser();
    const passport = authService.getPassport();
    const isAuth = authService.isAuthenticated();

    // -------------------------------------------------------------------------
    // Route Protection Rules
    // -------------------------------------------------------------------------
    const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/triage', '/hospitals'];
    const isPublic = publicRoutes.includes(route);

    if (!isAuth && !isPublic) {
      // Redirect unauthenticated to login
      window.location.hash = '#/login';
      return;
    }

    if (isAuth && (route === '/login' || route === '/signup')) {
      // Already authenticated, redirect to dashboard or role dashboard
      if (user.role === ROLES.RESPONDER) {
        window.location.hash = '#/responder';
      } else if (user.role === ROLES.ADMIN) {
        window.location.hash = '#/hospital-admin';
      } else {
        window.location.hash = '#/dashboard';
      }
      return;
    }

    // Role-specific redirects
    if (isAuth) {
      if (route === '/responder' && user.role !== ROLES.RESPONDER) {
        authService.switchRole(ROLES.RESPONDER);
      } else if (route === '/hospital-admin' && user.role !== ROLES.ADMIN) {
        authService.switchRole(ROLES.ADMIN);
      }
    }

    // -------------------------------------------------------------------------
    // Mount App Shell & View
    // -------------------------------------------------------------------------
    this._renderAppShell(user, route);
    await this._renderRouteView(route, user, passport);

    // Re-bind global translations & themes on every route change
    if (typeof applyCurrentLanguage === 'function') applyCurrentLanguage();
    if (typeof applyCurrentTheme === 'function') applyCurrentTheme();
  }

  _renderAppShell(user, route) {
    const navMount = document.getElementById('navbarMount');
    if (navMount) {
      navMount.innerHTML = UI.renderNavbar(user, route);
      this._bindNavbarEvents();
    }
  }

  _bindNavbarEvents() {
    // User dropdown toggle
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    if (userMenuBtn && userDropdownMenu) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdownMenu.classList.toggle('hidden');
      });

      document.addEventListener('click', () => {
        userDropdownMenu.classList.add('hidden');
      });
    }

    // Role Switcher Select
    const roleSelect = document.getElementById('roleSwitchSelect');
    if (roleSelect) {
      roleSelect.addEventListener('change', (e) => {
        const newRole = e.target.value;
        authService.switchRole(newRole);
        if (newRole === ROLES.RESPONDER) {
          this.navigate('/responder');
        } else if (newRole === ROLES.ADMIN) {
          this.navigate('/hospital-admin');
        } else {
          this.navigate('/dashboard');
        }
        showToast(`Switched active role to ${newRole.toUpperCase()}`, 'info');
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await authService.logout();
        showToast('You have been logged out.', 'info');
        this.navigate('/login');
      });
    }

    // Language modal
    const navLangBtn = document.getElementById('navLangBtn');
    if (navLangBtn) {
      navLangBtn.addEventListener('click', () => {
        const modal = document.getElementById('langModal');
        if (modal) modal.classList.remove('hidden');
      });
    }

    // Theme modal
    const navThemeBtn = document.getElementById('navThemeBtn');
    if (navThemeBtn) {
      navThemeBtn.addEventListener('click', () => {
        const modal = document.getElementById('themeModal');
        if (modal) modal.classList.remove('hidden');
      });
    }

    // Siren
    const navSirenBtn = document.getElementById('navSirenBtn');
    if (navSirenBtn && typeof toggleEmergencySiren === 'function') {
      navSirenBtn.addEventListener('click', toggleEmergencySiren);
    }
  }

  async _renderRouteView(route, user, passport) {
    const viewMount = document.getElementById('viewMount');
    if (!viewMount) return;

    window.scrollTo(0, 0);

    switch (route) {
      case '/':
        viewMount.innerHTML = Views.renderLanding(user);
        break;

      case '/login':
        viewMount.innerHTML = Views.renderLogin();
        this._bindLoginEvents();
        break;

      case '/signup':
        viewMount.innerHTML = Views.renderSignup();
        this._bindSignupEvents();
        break;

      case '/forgot-password':
        viewMount.innerHTML = Views.renderForgotPassword();
        this._bindForgotEvents();
        break;

      case '/reset-password':
        viewMount.innerHTML = Views.renderResetPassword();
        this._bindResetEvents();
        break;

      case '/onboarding':
        viewMount.innerHTML = Views.renderOnboarding(user, passport);
        this._bindOnboardingEvents();
        break;

      case '/dashboard':
        viewMount.innerHTML = Views.renderDashboard(user, passport);
        break;

      case '/profile':
        viewMount.innerHTML = Views.renderProfile(user, passport);
        break;

      case '/passport':
        viewMount.innerHTML = Views.renderPassport(user, passport);
        this._bindPassportEvents();
        break;

      case '/passport/edit':
        viewMount.innerHTML = Views.renderPassportEdit(user, passport);
        this._bindEditPassportEvents();
        break;

      case '/emergency-contacts':
        viewMount.innerHTML = Views.renderEmergencyContacts(user, passport);
        this._bindContactsEvents();
        break;

      case '/qr':
        viewMount.innerHTML = Views.renderQR(user, passport);
        this._bindQREvents(passport || { passportId: user?.passportId || 'T-1001' });
        break;

      case '/hospitals':
        viewMount.innerHTML = Views.renderHospitals(state.hospitals || []);
        this._bindHospitalsEvents();
        break;

      case '/triage':
        // Reuse the rich Triage experience
        this._renderTriageView(viewMount);
        break;

      case '/responder':
        viewMount.innerHTML = Views.renderResponderHUD(user);
        break;

      case '/hospital-admin':
        viewMount.innerHTML = Views.renderHospitalAdmin(user);
        break;

      case '/settings':
        viewMount.innerHTML = Views.renderSettings(user, passport);
        this._bindSettingsEvents();
        break;

      default:
        viewMount.innerHTML = Views.renderLanding(user);
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // View-Specific Event Bindings
  // ---------------------------------------------------------------------------
  _bindLoginEvents() {
    const form = document.getElementById('loginForm');
    const toggleBtn = document.getElementById('togglePasswordBtn');
    const pwInput = document.getElementById('loginPassword');
    const googleBtn = document.getElementById('googleLoginBtn');

    if (toggleBtn && pwInput) {
      toggleBtn.addEventListener('click', () => {
        pwInput.type = pwInput.type === 'password' ? 'text' : 'password';
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitLoginBtn');
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-spinner').classList.remove('hidden');

        try {
          const email = document.getElementById('loginEmail').value.trim();
          const pass = pwInput.value;
          const remember = document.getElementById('rememberMe').checked;

          const u = await authService.login(email, pass, remember);
          showToast(`Welcome back, ${u.name}!`, 'success');
          this.navigate('/dashboard');
        } catch (err) {
          showToast(err.message || 'Login failed', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-spinner').classList.add('hidden');
        }
      });
    }

    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        await authService.loginWithGoogle();
        showToast('Signed in with Google.', 'success');
        this.navigate('/dashboard');
      });
    }
  }

  _bindSignupEvents() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pw = document.getElementById('signupPassword').value;
      const confirmPw = document.getElementById('signupConfirmPassword').value;

      if (pw !== confirmPw) {
        showToast('Passwords do not match.', 'error');
        return;
      }

      const submitBtn = document.getElementById('submitSignupBtn');
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-spinner').classList.remove('hidden');

      try {
        const payload = {
          fullName: document.getElementById('signupName').value.trim(),
          email: document.getElementById('signupEmail').value.trim(),
          password: pw,
          dob: document.getElementById('signupDob').value,
          country: document.getElementById('signupCountry').value.trim(),
          language: document.getElementById('signupLang').value.trim(),
          emergencyContact: document.getElementById('signupContact').value.trim(),
        };

        const newUser = await authService.signup(payload);
        showToast(`Account created for ${newUser.name}!`, 'success');
        this.navigate('/onboarding');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-spinner').classList.add('hidden');
      }
    });
  }

  _bindForgotEvents() {
    const form = document.getElementById('forgotForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgotEmail').value.trim();
        await authService.forgotPassword(email);
        showToast(`Password reset link sent to ${email}`, 'success');
        setTimeout(() => this.navigate('/reset-password'), 1200);
      });
    }
  }

  _bindResetEvents() {
    const form = document.getElementById('resetForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newPw = document.getElementById('newPassword').value;
        const confirmPw = document.getElementById('confirmNewPassword').value;
        if (newPw !== confirmPw) {
          showToast('Passwords do not match.', 'error');
          return;
        }
        await authService.resetPassword('mock-token', newPw);
        showToast('Password updated successfully! Please sign in.', 'success');
        setTimeout(() => this.navigate('/login'), 1000);
      });
    }
  }

  _bindOnboardingEvents() {
    const nextBtns = document.querySelectorAll('.next-step-btn');
    const prevBtns = document.querySelectorAll('.prev-step-btn');
    const form = document.getElementById('onboardingForm');

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const nextStep = btn.getAttribute('data-next');
        this._showWizardStep(nextStep);
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const prevStep = btn.getAttribute('data-prev');
        this._showWizardStep(prevStep);
      });
    });

    const addContactBtn = document.getElementById('obAddContactBtn');
    const contactsContainer = document.getElementById('obContactsContainer');
    if (addContactBtn && contactsContainer) {
      addContactBtn.addEventListener('click', () => {
        const card = document.createElement('div');
        card.className = 'contact-entry-card glass-card';
        card.style.marginTop = '10px';
        card.innerHTML = `
          <div class="form-row">
            <div class="form-field col-4">
              <label>Contact Name</label>
              <input type="text" class="contact-input-name" placeholder="Contact Name" required />
            </div>
            <div class="form-field col-4">
              <label>Relationship</label>
              <input type="text" class="contact-input-rel" placeholder="Relationship" required />
            </div>
            <div class="form-field col-4">
              <label>Phone Number</label>
              <input type="tel" class="contact-input-phone" placeholder="+1-555-..." required />
            </div>
          </div>
        `;
        contactsContainer.appendChild(card);
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Extract contacts
        const contactCards = document.querySelectorAll('#obContactsContainer .contact-entry-card');
        const contacts = [];
        contactCards.forEach((c, idx) => {
          const name = c.querySelector('.contact-input-name')?.value;
          const rel = c.querySelector('.contact-input-rel')?.value;
          const phone = c.querySelector('.contact-input-phone')?.value;
          if (name && phone) {
            contacts.push({ id: `c-${idx + 1}`, name, relationship: rel || 'Family', phone, isPrimary: idx === 0 });
          }
        });

        const onboardingData = {
          fullName: document.getElementById('obName')?.value,
          nationality: document.getElementById('obNationality')?.value,
          language: document.getElementById('obLanguage')?.value,
          bloodGroup: document.getElementById('obBloodGroup')?.value,
          allergies: (document.getElementById('obAllergies')?.value || '').split(',').map(s => s.trim()).filter(Boolean),
          conditions: (document.getElementById('obConditions')?.value || '').split(',').map(s => s.trim()).filter(Boolean),
          medications: (document.getElementById('obMedications')?.value || '').split(',').map(s => s.trim()).filter(Boolean),
          emergencyNotes: document.getElementById('obNotes')?.value,
          contacts,
          privacySettings: {
            emergencyAccess: true,
            shareBloodGroup: document.getElementById('privBlood')?.checked ?? true,
            shareAllergies: document.getElementById('privAllergies')?.checked ?? true,
            shareConditions: document.getElementById('privConditions')?.checked ?? true,
            shareContacts: document.getElementById('privContacts')?.checked ?? true,
          }
        };

        authService.onboardingComplete(onboardingData);
        showToast('Your Emergency Passport is ready! Welcome to your Dashboard.', 'success');
        this.navigate('/dashboard');
      });
    }
  }

  _showWizardStep(stepNum) {
    for (let i = 1; i <= 4; i++) {
      const stepElem = document.getElementById(`wizardStep${i}`);
      const indicator = document.getElementById(`stepIndicator${i}`);
      const line = document.getElementById(`stepLine${i - 1}`);

      if (stepElem) stepElem.classList.toggle('hidden', i.toString() !== stepNum.toString());
      if (indicator) indicator.classList.toggle('active', i <= parseInt(stepNum, 10));
      if (line) line.classList.toggle('active', i <= parseInt(stepNum, 10));
    }
  }

  _bindPassportEvents() {
    const printBtn = document.getElementById('printPassportCardBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  }

  _bindEditPassportEvents() {
    const form = document.getElementById('editPassportForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const blood = document.getElementById('editBloodGroup').value;
        const allergies = document.getElementById('editAllergies').value.split(',').map(s => s.trim()).filter(Boolean);
        const conditions = document.getElementById('editConditions').value.split(',').map(s => s.trim()).filter(Boolean);
        const medications = document.getElementById('editMedications').value.split(',').map(s => s.trim()).filter(Boolean);
        const notes = document.getElementById('editNotes').value.trim();

        authService.updatePassport({
          bloodGroup: blood,
          allergies,
          conditions,
          medications,
          emergencyNotes: notes,
        });

        showToast('Medical passport information updated successfully.', 'success');
        this.navigate('/passport');
      });
    }
  }

  _bindContactsEvents() {
    const openAddBtn = document.getElementById('openAddContactModalBtn');
    if (openAddBtn) {
      openAddBtn.addEventListener('click', () => {
        const name = prompt('Contact Name:');
        if (!name) return;
        const rel = prompt('Relationship (e.g. Spouse, Father):', 'Family');
        const phone = prompt('Phone Number:');
        if (!phone) return;

        authService.addEmergencyContact({ name, relationship: rel || 'Family', phone });
        showToast(`Contact ${name} added.`, 'success');
        this.handleRoute();
      });
    }

    const deleteBtns = document.querySelectorAll('.delete-contact-btn');
    deleteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Are you sure you want to remove this emergency contact?')) {
          authService.deleteEmergencyContact(id);
          showToast('Contact removed.', 'info');
          this.handleRoute();
        }
      });
    });
  }

  _bindQREvents(passport) {
    const qrHolder = document.getElementById('largeQrHolder');
    if (qrHolder) {
      qrHolder.innerHTML = generateQrSvg(passport.passportId);
    }

    const regenBtn = document.getElementById('regenerateQrBtn');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        showToast('Generating new secure cryptographic QR sequence...', 'info');
        setTimeout(() => {
          if (qrHolder) qrHolder.innerHTML = generateQrSvg(passport.passportId + '-' + Date.now().toString().slice(-4));
          showToast('Emergency QR regenerated and active.', 'success');
        }, 600);
      });
    }

    const downloadBtn = document.getElementById('downloadQrImageBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  _bindHospitalsEvents() {
    const select = document.getElementById('facilityFilterSelect');
    const grid = document.getElementById('facilitiesGrid');
    if (select && grid) {
      select.addEventListener('change', () => {
        const filter = select.value;
        const filtered = filter === 'all'
          ? (state.hospitals || [])
          : (state.hospitals || []).filter(h => {
              const s = Array.isArray(h.Services) ? h.Services : Array.from(h.Services || []);
              return s.some(serv => serv.toLowerCase().includes(filter.toLowerCase()));
            });
        grid.innerHTML = filtered.map(h => UI.renderHospitalCard(h)).join('');
      });
    }
  }

  _bindSettingsEvents() {
    const themeBtn = document.getElementById('settingsThemeBtn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const m = document.getElementById('themeModal');
        if (m) m.classList.remove('hidden');
      });
    }

    const langBtn = document.getElementById('settingsLangBtn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        const m = document.getElementById('langModal');
        if (m) m.classList.remove('hidden');
      });
    }

    const logoutBtn = document.getElementById('settingsLogoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await authService.logout();
        this.navigate('/login');
      });
    }
  }

  _renderTriageView(viewMount) {
    const query = this.getQueryParams();
    const defaultId = query.id || 'T-1001';

    viewMount.innerHTML = `
      <div class="triage-page-wrapper">
        <div class="triage-top-bar glass-card">
          <div class="triage-search-wrap">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" id="triageSearchInput" placeholder="Enter Tourist ID (e.g. T-1001)" value="${defaultId}" />
            <button class="btn btn-primary" id="triageExecuteBtn">TRIAGE NOW</button>
          </div>

          <div class="triage-demo-chips">
            <button class="preset-chip active" data-tourist="T-1001">Elena (Penicillin/Asthma)</button>
            <button class="preset-chip" data-tourist="T-1002">Kenji (Diabetes T1/Latex)</button>
            <button class="preset-chip" data-tourist="T-1003">Maria (Cardiac/Aspirin)</button>
            <button class="preset-chip" data-tourist="T-1004">Arjun (Heatstroke/T2)</button>
          </div>
        </div>

        <div id="triageActiveDisplay">
          <!-- Populated by fetchEmergencyTriage -->
        </div>
      </div>
    `;

    // Bind Triage Search
    const searchInput = document.getElementById('triageSearchInput');
    const execBtn = document.getElementById('triageExecuteBtn');
    if (execBtn && searchInput) {
      execBtn.addEventListener('click', () => {
        fetchEmergencyTriage(searchInput.value.trim());
      });
    }

    document.querySelectorAll('.triage-demo-chips .preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.triage-demo-chips .preset-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const id = chip.getAttribute('data-tourist');
        if (searchInput) searchInput.value = id;
        fetchEmergencyTriage(id);
      });
    });

    // Auto-trigger initial triage query
    fetchEmergencyTriage(defaultId);
  }
}

const appRouter = new Router();
