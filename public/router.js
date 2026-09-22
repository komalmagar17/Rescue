/**
 * Emergency Passport — Client-Side Router & Route Guard
 * Handles SPA navigation, protected routes, and view mounting.
 * Shared-Element Motion Transitions • Map Lifecycle Hooks
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
      window.location.hash = '#/login';
      return;
    }

    if (isAuth && (route === '/login' || route === '/signup')) {
      if (user.role === ROLES.RESPONDER) {
        window.location.hash = '#/responder';
      } else if (user.role === ROLES.ADMIN) {
        window.location.hash = '#/hospital-admin';
      } else {
        window.location.hash = '#/dashboard';
      }
      return;
    }

    // Role-specific auto switches
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
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    if (userMenuBtn && userDropdownMenu) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !userDropdownMenu.classList.contains('is-open');
        userDropdownMenu.classList.toggle('is-open', willOpen);
        userDropdownMenu.classList.toggle('hidden', !willOpen);
        userMenuBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });

      document.addEventListener('click', (e) => {
        if (!userMenuBtn.contains(e.target) && !userDropdownMenu.contains(e.target)) {
          userDropdownMenu.classList.remove('is-open');
          userDropdownMenu.classList.add('hidden');
          userMenuBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const roleDropdownBtn = document.getElementById('roleDropdownBtn');
    const roleDropdownMenu = document.getElementById('roleDropdownMenu');
    if (roleDropdownBtn && roleDropdownMenu) {
      roleDropdownBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (userDropdownMenu) {
          userDropdownMenu.classList.remove('is-open');
          userDropdownMenu.classList.add('hidden');
          userMenuBtn?.setAttribute('aria-expanded', 'false');
        }
        const willOpen = !roleDropdownMenu.classList.contains('is-open');
        roleDropdownMenu.classList.toggle('is-open', willOpen);
        roleDropdownMenu.classList.toggle('hidden', !willOpen);
        roleDropdownBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });

      const roleItems = roleDropdownMenu.querySelectorAll('.custom-dropdown-item');
      roleItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const newRole = item.dataset.role;
          if (!newRole) return;

          roleItems.forEach(i => i.classList.remove('selected'));
          item.classList.add('selected');

          roleDropdownMenu.classList.remove('is-open');
          roleDropdownMenu.classList.add('hidden');
          roleDropdownBtn.setAttribute('aria-expanded', 'false');

          authService.switchRole(newRole);
          const roleLabel = document.getElementById('roleCurrentLabel');
          if (roleLabel) {
            roleLabel.textContent = newRole === ROLES.RESPONDER ? 'Paramedic' : newRole === ROLES.ADMIN ? 'Hospital Admin' : 'Traveler';
          }
          if (newRole === ROLES.RESPONDER) {
            this.navigate('/responder');
          } else if (newRole === ROLES.ADMIN) {
            this.navigate('/hospital-admin');
          } else {
            this.navigate('/dashboard');
          }
          showToast(`Switched active persona to ${newRole.toUpperCase()}`, 'info');
        });
      });

      document.addEventListener('click', (e) => {
        if (!roleDropdownBtn.contains(e.target) && !roleDropdownMenu.contains(e.target)) {
          roleDropdownMenu.classList.remove('is-open');
          roleDropdownMenu.classList.add('hidden');
          roleDropdownBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        await authService.logout();
        showToast('You have been logged out.', 'info');
        this.navigate('/login');
      });
    }

    const navLangBtn = document.getElementById('navLangBtn');
    if (navLangBtn) {
      navLangBtn.addEventListener('click', () => {
        const modal = document.getElementById('langModal');
        if (modal) modal.classList.remove('hidden');
      });
    }

    const navThemeSwitch = document.getElementById('navThemeSwitch');
    if (navThemeSwitch) {
      navThemeSwitch.addEventListener('click', (e) => {
        if (typeof triggerThemeWaveTransition === 'function') {
          triggerThemeWaveTransition(e);
        }
      });
    }

    const navPaletteBtn = document.getElementById('navPaletteBtn');
    if (navPaletteBtn) {
      navPaletteBtn.addEventListener('click', () => {
        const modal = document.getElementById('themeModal');
        if (modal) modal.classList.remove('hidden');
      });
    }

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
        if (typeof initHeroMap === 'function') {
          setTimeout(() => initHeroMap(), 60);
        }
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
        if (typeof initHospitalsMap === 'function') {
          setTimeout(() => initHospitalsMap(state.hospitals || []), 60);
        }
        break;

      case '/triage':
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
        if (typeof initHeroMap === 'function') {
          setTimeout(() => initHeroMap(), 60);
        }
        break;
    }

    if (typeof initStitchParallax === 'function') {
      setTimeout(() => initStitchParallax(), 70);
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
        }
      });
    }

    if (googleBtn) {
      googleBtn.addEventListener('click', async () => {
        await authService.loginWithGoogle();
        showToast('Signed in with Google authentication.', 'success');
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

      try {
        const payload = {
          fullName: document.getElementById('signupName').value.trim(),
          email: document.getElementById('signupEmail').value.trim(),
          password: pw,
          dob: document.getElementById('signupDob').value,
          country: document.getElementById('signupCountry').value.trim(),
          language: 'English',
          emergencyContact: document.getElementById('signupContact').value.trim(),
        };

        const newUser = await authService.signup(payload);
        showToast(`Account created for ${newUser.name}!`, 'success');
        this.navigate('/onboarding');
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        submitBtn.disabled = false;
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
        card.style.padding = '16px';
        card.innerHTML = `
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
            <input type="text" class="contact-input-name editorial-input" placeholder="Contact Name" required />
            <input type="text" class="contact-input-rel editorial-input" placeholder="Relationship" required />
            <input type="tel" class="contact-input-phone editorial-input" placeholder="Phone Number" required />
          </div>
        `;
        contactsContainer.appendChild(card);
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

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
          emergencyNotes: '',
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
      if (stepElem) stepElem.classList.toggle('hidden', i.toString() !== stepNum.toString());
      if (indicator) indicator.classList.toggle('active', i <= parseInt(stepNum, 10));
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
        const name = prompt('Contact Full Name:');
        if (!name) return;
        const rel = prompt('Relationship (e.g. Spouse, Father, Physician):', 'Family');
        const phone = prompt('Emergency Phone Number:');
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
        if (confirm('Remove this emergency contact?')) {
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
      const scanLine = qrHolder.querySelector('.qr-scan-line');
      qrHolder.innerHTML = generateQrSvg(passport.passportId);
      if (scanLine) qrHolder.appendChild(scanLine);
    }

    const regenBtn = document.getElementById('regenerateQrBtn');
    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        showToast('Re-keying cryptographic emergency identity token...', 'info');
        setTimeout(() => {
          if (qrHolder) {
            qrHolder.innerHTML = generateQrSvg(passport.passportId + '-' + Date.now().toString().slice(-4));
            const sl = document.createElement('div');
            sl.className = 'qr-scan-line';
            qrHolder.appendChild(sl);
          }
          showToast('Emergency QR regenerated and active.', 'success');
        }, 600);
      });
    }

    const downloadBtn = document.getElementById('downloadQrImageBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => window.print());
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
        this._bindHospitalCardActions();
      });
    }
    this._bindHospitalCardActions();
  }

  _bindHospitalCardActions() {
    document.querySelectorAll('.locate-facility-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (typeof focusHospitalOnMap === 'function') {
          focusHospitalOnMap(id);
        }
      });
    });
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

    viewMount.innerHTML = Views.renderTriageExperience(defaultId);

    const searchInput = document.getElementById('triageSearchInput');
    const execBtn = document.getElementById('triageExecuteBtn');
    if (execBtn && searchInput) {
      execBtn.addEventListener('click', () => {
        fetchEmergencyTriage(searchInput.value.trim());
      });
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') fetchEmergencyTriage(searchInput.value.trim());
      });
    }

    fetchEmergencyTriage(defaultId);
  }
}

const appRouter = new Router();
