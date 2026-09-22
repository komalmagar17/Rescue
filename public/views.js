/**
 * Emergency Passport — Page Views & Renderers
 * Implements Landing, Auth (Login/Signup/Forgot/Reset), Onboarding Wizard,
 * Dashboard, Profile, Digital Passport, QR Identity, Contacts, Triage, and Admin.
 */

const Views = {
  // ===========================================================================
  // 1. LANDING PAGE
  // ===========================================================================
  renderLanding(user) {
    const isAuth = Boolean(user);

    return `
      <div class="landing-page-wrapper">
        <!-- Hero Section -->
        <section class="landing-hero">
          <div class="hero-chip">
            <span class="chip-spark">⚡</span>
            <span>AMAZON BEDROCK AI + DYNAMODB • GOLDEN HOUR NETWORK</span>
          </div>

          <h1 class="landing-title">
            Your Emergency Information.<br>
            <span class="text-gradient">Available When It Matters.</span>
          </h1>

          <p class="landing-subtitle">
            Carry verified medical and emergency information wherever you go. When crisis strikes abroad, first responders scan your universal QR to access blood types, fatal allergies, and AI clinical briefings in under 800 milliseconds.
          </p>

          <div class="landing-cta-group">
            ${isAuth ? `
              <a href="#/passport" class="btn btn-primary btn-lg" data-route="/passport">
                💳 Open My Passport
              </a>
              <a href="#/qr" class="btn btn-outline btn-lg" data-route="/qr">
                📲 View Emergency QR
              </a>
            ` : `
              <a href="#/signup" class="btn btn-primary btn-lg" data-route="/signup">
                🚑 Create Emergency Passport
              </a>
              <a href="#/triage" class="btn btn-outline btn-lg" data-route="/triage">
                ⚡ View Live Responder Demo
              </a>
            `}
          </div>
        </section>

        <!-- 4-Step Golden Hour Workflow -->
        <section class="workflow-section">
          <div class="section-title-wrap">
            <span class="sub-label">HOW IT WORKS</span>
            <h2 class="section-heading">Four Steps to Borderless Emergency Care</h2>
          </div>

          <div class="workflow-grid">
            <div class="workflow-card glass-card">
              <div class="step-badge">01</div>
              <h3 class="step-title">Create Your Passport</h3>
              <p class="step-desc">Enter your verified blood group, fatal drug allergies, chronic conditions, and emergency family contacts in under 2 minutes.</p>
            </div>

            <div class="workflow-card glass-card">
              <div class="step-badge">02</div>
              <h3 class="step-title">Verify Your Information</h3>
              <p class="step-desc">Your clinical records are encrypted at rest with AWS KMS and validated with point-in-time recovery on Amazon DynamoDB.</p>
            </div>

            <div class="workflow-card glass-card">
              <div class="step-badge">03</div>
              <h3 class="step-title">Carry Your Emergency QR</h3>
              <p class="step-desc">Save your universal QR code to your phone lockscreen, smartwatch, or print an ultra-durable wallet card.</p>
            </div>

            <div class="workflow-card glass-card">
              <div class="step-badge">04</div>
              <h3 class="step-title">Responders Save Your Life</h3>
              <p class="step-desc">Paramedics scan your QR with zero app installation. Bedrock Claude 3 synthesizes an urgent 5-point clinical brief.</p>
            </div>
          </div>
        </section>

        <!-- Trust & Security Section -->
        <section class="trust-security-section glass-card">
          <div class="trust-content">
            <div class="trust-badge">🔒 ZERO UNNECESSARY DATA EXPOSURE</div>
            <h3 class="trust-heading">Medical Privacy First Architecture</h3>
            <p class="trust-desc">
              We never expose financial data, national IDs, or continuous GPS tracking. In life-or-death emergencies, first responders access only actionable clinical contraindications (allergies, blood group, vital contacts) according to your explicit sharing settings.
            </p>
            <div class="trust-tags">
              <span>✓ HIPAA-Ready Encryption</span>
              <span>✓ Sub-800ms Retrieval</span>
              <span>✓ Zero-Login Paramedic Access</span>
              <span>✓ Offline Clinical Fallback</span>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  // ===========================================================================
  // 2. AUTHENTICATION: LOGIN
  // ===========================================================================
  renderLogin() {
    return `
      <div class="auth-page-container">
        <div class="auth-card glass-card">
          <div class="auth-header">
            <div class="auth-brand-icon">🚑</div>
            <h2 class="auth-title">Welcome Back</h2>
            <p class="auth-subtitle">Sign in to manage your Emergency Medical Passport</p>
          </div>

          <form id="loginForm" class="auth-form">
            <div class="form-field">
              <label for="loginEmail">Email Address or Username</label>
              <input type="text" id="loginEmail" required placeholder="elena@rescue.io" value="elena@rescue.io" />
            </div>

            <div class="form-field">
              <div class="field-label-row">
                <label for="loginPassword">Password</label>
                <a href="#/forgot-password" class="forgot-link" data-route="/forgot-password">Forgot password?</a>
              </div>
              <div class="password-input-wrap">
                <input type="password" id="loginPassword" required placeholder="••••••••" value="password123" />
                <button type="button" class="btn-toggle-pw" id="togglePasswordBtn" title="Show/Hide Password">👁️</button>
              </div>
            </div>

            <div class="remember-row">
              <label class="checkbox-label">
                <input type="checkbox" id="rememberMe" checked />
                <span>Remember me on this device</span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" id="submitLoginBtn">
              <span class="btn-text">Sign In to Passport</span>
              <span class="btn-spinner hidden"></span>
            </button>

            <div class="auth-divider">
              <span>OR</span>
            </div>

            <button type="button" class="btn btn-outline btn-block btn-google" id="googleLoginBtn">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              <span>Continue with Google</span>
            </button>
          </form>

          <div class="auth-footer">
            <span>Don't have an Emergency Passport?</span>
            <a href="#/signup" class="signup-link" data-route="/signup">Create Account</a>
          </div>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 3. AUTHENTICATION: SIGNUP
  // ===========================================================================
  renderSignup() {
    return `
      <div class="auth-page-container">
        <div class="auth-card glass-card">
          <div class="auth-header">
            <div class="auth-brand-icon">💳</div>
            <h2 class="auth-title">Create Emergency Passport</h2>
            <p class="auth-subtitle">Set up your borderless life-saving medical identity</p>
          </div>

          <form id="signupForm" class="auth-form">
            <div class="form-field">
              <label for="signupName">Full Legal Name *</label>
              <input type="text" id="signupName" required placeholder="Elena Rostova" />
            </div>

            <div class="form-field">
              <label for="signupEmail">Email Address *</label>
              <input type="email" id="signupEmail" required placeholder="elena@example.com" />
            </div>

            <div class="form-row">
              <div class="form-field col-6">
                <label for="signupPassword">Password *</label>
                <input type="password" id="signupPassword" required minlength="8" placeholder="••••••••" />
              </div>
              <div class="form-field col-6">
                <label for="signupConfirmPassword">Confirm Password *</label>
                <input type="password" id="signupConfirmPassword" required minlength="8" placeholder="••••••••" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field col-6">
                <label for="signupDob">Date of Birth *</label>
                <input type="date" id="signupDob" required value="1997-04-12" />
              </div>
              <div class="form-field col-6">
                <label for="signupCountry">Country of Residence *</label>
                <input type="text" id="signupCountry" required placeholder="United States" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field col-6">
                <label for="signupLang">Preferred Language</label>
                <input type="text" id="signupLang" placeholder="English, Spanish, Hindi..." />
              </div>
              <div class="form-field col-6">
                <label for="signupContact">Primary Emergency Phone</label>
                <input type="tel" id="signupContact" placeholder="+1-555-0199" />
              </div>
            </div>

            <div class="terms-row">
              <label class="checkbox-label">
                <input type="checkbox" id="signupTerms" required checked />
                <span>I agree to the Terms of Medical Data Protection & Emergency Access.</span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" id="submitSignupBtn">
              <span class="btn-text">Create Account & Start Onboarding</span>
              <span class="btn-spinner hidden"></span>
            </button>
          </form>

          <div class="auth-footer">
            <span>Already have an account?</span>
            <a href="#/login" class="signup-link" data-route="/login">Sign In</a>
          </div>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 4. FORGOT & RESET PASSWORD
  // ===========================================================================
  renderForgotPassword() {
    return `
      <div class="auth-page-container">
        <div class="auth-card glass-card">
          <div class="auth-header">
            <div class="auth-brand-icon">🔑</div>
            <h2 class="auth-title">Reset Password</h2>
            <p class="auth-subtitle">Enter your registered email and we'll send recovery instructions.</p>
          </div>

          <form id="forgotForm" class="auth-form">
            <div class="form-field">
              <label for="forgotEmail">Email Address</label>
              <input type="email" id="forgotEmail" required placeholder="elena@rescue.io" />
            </div>

            <button type="submit" class="btn btn-primary btn-block" id="submitForgotBtn">
              Send Password Reset Link
            </button>
          </form>

          <div class="auth-footer">
            <a href="#/login" class="signup-link" data-route="/login">← Back to Sign In</a>
          </div>
        </div>
      </div>
    `;
  },

  renderResetPassword() {
    return `
      <div class="auth-page-container">
        <div class="auth-card glass-card">
          <div class="auth-header">
            <div class="auth-brand-icon">🔐</div>
            <h2 class="auth-title">Set New Password</h2>
            <p class="auth-subtitle">Create a secure password for your Emergency Passport.</p>
          </div>

          <form id="resetForm" class="auth-form">
            <div class="form-field">
              <label for="newPassword">New Password</label>
              <input type="password" id="newPassword" required minlength="8" placeholder="••••••••" />
            </div>

            <div class="form-field">
              <label for="confirmNewPassword">Confirm New Password</label>
              <input type="password" id="confirmNewPassword" required minlength="8" placeholder="••••••••" />
            </div>

            <button type="submit" class="btn btn-primary btn-block">
              Update Password
            </button>
          </form>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 5. ONBOARDING WIZARD (4 STEPS)
  // ===========================================================================
  renderOnboarding(user, passport) {
    return `
      <div class="onboarding-page-container">
        <div class="onboarding-card glass-card">
          <!-- Step Progress Indicator -->
          <div class="onboarding-progress-bar">
            <div class="step-indicator active" id="stepIndicator1">
              <span class="indicator-num">1</span>
              <span class="indicator-label">Identity</span>
            </div>
            <div class="step-line" id="stepLine1"></div>
            <div class="step-indicator" id="stepIndicator2">
              <span class="indicator-num">2</span>
              <span class="indicator-label">Medical</span>
            </div>
            <div class="step-line" id="stepLine2"></div>
            <div class="step-indicator" id="stepIndicator3">
              <span class="indicator-num">3</span>
              <span class="indicator-label">Contacts</span>
            </div>
            <div class="step-line" id="stepLine3"></div>
            <div class="step-indicator" id="stepIndicator4">
              <span class="indicator-num">4</span>
              <span class="indicator-label">Privacy</span>
            </div>
          </div>

          <!-- Wizard Content Area -->
          <form id="onboardingForm" class="onboarding-form-content">
            <!-- STEP 1: Basic Identity -->
            <div class="wizard-step" id="wizardStep1">
              <h2 class="step-heading">Step 1: Traveler Identity</h2>
              <p class="step-subheading">Verify your legal traveler profile as it appears on official travel documents.</p>

              <div class="form-field">
                <label for="obName">Full Legal Name *</label>
                <input type="text" id="obName" required value="${user?.name || ''}" />
              </div>

              <div class="form-row">
                <div class="form-field col-6">
                  <label for="obDob">Date of Birth</label>
                  <input type="date" id="obDob" value="${user?.dob || '1997-04-12'}" />
                </div>
                <div class="form-field col-6">
                  <label for="obNationality">Nationality</label>
                  <input type="text" id="obNationality" value="${user?.country || 'United States'}" />
                </div>
              </div>

              <div class="form-field">
                <label for="obLanguage">Primary Spoken Languages</label>
                <input type="text" id="obLanguage" value="${user?.language || 'English, Russian'}" placeholder="English, Spanish, Hindi..." />
              </div>

              <div class="wizard-actions">
                <div></div>
                <button type="button" class="btn btn-primary next-step-btn" data-next="2">
                  Continue to Medical Info →
                </button>
              </div>
            </div>

            <!-- STEP 2: Emergency Medical Info -->
            <div class="wizard-step hidden" id="wizardStep2">
              <h2 class="step-heading">Step 2: Emergency Medical Details</h2>
              <p class="step-subheading">Critical clinical facts needed by first responders during the Golden Hour.</p>

              <div class="form-row">
                <div class="form-field col-6">
                  <label for="obBloodGroup">Verified Blood Group *</label>
                  <select id="obBloodGroup" required>
                    <option value="O+" selected>O+ (Positive)</option>
                    <option value="O-">O- (Negative)</option>
                    <option value="A+">A+ (Positive)</option>
                    <option value="A-">A- (Negative)</option>
                    <option value="B+">B+ (Positive)</option>
                    <option value="B-">B- (Negative)</option>
                    <option value="AB+">AB+ (Positive)</option>
                    <option value="AB-">AB- (Negative)</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div class="form-field col-6">
                  <label for="obAllergies">Fatal & Severe Drug Allergies *</label>
                  <input type="text" id="obAllergies" placeholder="e.g. Penicillin, Peanuts, Latex" value="${(passport?.allergies || []).join(', ')}" />
                </div>
              </div>

              <div class="form-field">
                <label for="obConditions">Pre-existing Medical Conditions</label>
                <input type="text" id="obConditions" placeholder="e.g. Asthma, Type 1 Diabetes, Cardiac Arrhythmia" value="${(passport?.conditions || []).join(', ')}" />
              </div>

              <div class="form-field">
                <label for="obMedications">Current Prescription Medications</label>
                <input type="text" id="obMedications" placeholder="e.g. Albuterol Inhaler, Insulin, Lisinopril" value="${(passport?.medications || []).join(', ')}" />
              </div>

              <div class="form-field">
                <label for="obNotes">Emergency Responder Rescue Instructions</label>
                <textarea id="obNotes" rows="2" placeholder="e.g. Carries inhaler in right coat pocket. Insulin pump on abdomen.">${passport?.emergencyNotes || ''}</textarea>
              </div>

              <div class="wizard-actions">
                <button type="button" class="btn btn-ghost prev-step-btn" data-prev="1">← Back</button>
                <button type="button" class="btn btn-primary next-step-btn" data-next="3">Continue to Contacts →</button>
              </div>
            </div>

            <!-- STEP 3: Emergency Contacts -->
            <div class="wizard-step hidden" id="wizardStep3">
              <h2 class="step-heading">Step 3: Family Emergency Contacts</h2>
              <p class="step-subheading">Who should paramedics call when emergency care begins?</p>

              <div id="obContactsContainer" class="ob-contacts-list">
                <div class="contact-entry-card glass-card">
                  <div class="form-row">
                    <div class="form-field col-4">
                      <label>Contact Name</label>
                      <input type="text" class="contact-input-name" placeholder="Mark Rostova" value="Mark Rostova" required />
                    </div>
                    <div class="form-field col-4">
                      <label>Relationship</label>
                      <input type="text" class="contact-input-rel" placeholder="Spouse" value="Spouse" required />
                    </div>
                    <div class="form-field col-4">
                      <label>Phone Number</label>
                      <input type="tel" class="contact-input-phone" placeholder="+1-555-0199" value="+1-555-0199" required />
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" class="btn btn-outline btn-sm" id="obAddContactBtn" style="margin-top: 12px;">
                + Add Another Emergency Contact
              </button>

              <div class="wizard-actions">
                <button type="button" class="btn btn-ghost prev-step-btn" data-prev="2">← Back</button>
                <button type="button" class="btn btn-primary next-step-btn" data-next="4">Continue to Privacy →</button>
              </div>
            </div>

            <!-- STEP 4: Privacy Settings -->
            <div class="wizard-step hidden" id="wizardStep4">
              <h2 class="step-heading">Step 4: Privacy & Emergency Sharing</h2>
              <p class="step-subheading">Control exactly what first responders can see upon scanning your Emergency Passport QR code.</p>

              <div class="privacy-explainer-box glass-card">
                <div class="privacy-alert-title">🛡️ Emergency Responder Access Policy</div>
                <p>When an emergency worker scans your physical or digital QR code, they receive read-only clinical access. No banking, location history, or financial data is ever shared.</p>
              </div>

              <div class="privacy-toggle-list">
                <label class="privacy-switch-item">
                  <input type="checkbox" id="privBlood" checked />
                  <div>
                    <strong>Share Blood Group & Rh Factor</strong>
                    <p>Enables instant blood transfusions without testing delays.</p>
                  </div>
                </label>

                <label class="privacy-switch-item">
                  <input type="checkbox" id="privAllergies" checked />
                  <div>
                    <strong>Share Severe Allergies</strong>
                    <p>Alerts paramedics against fatal antibiotic and drug contraindications.</p>
                  </div>
                </label>

                <label class="privacy-switch-item">
                  <input type="checkbox" id="privConditions" checked />
                  <div>
                    <strong>Share Chronic Conditions</strong>
                    <p>Informs hospital triage for specialized department matching (ICU, Cardiology).</p>
                  </div>
                </label>

                <label class="privacy-switch-item">
                  <input type="checkbox" id="privContacts" checked />
                  <div>
                    <strong>Share Emergency Contacts</strong>
                    <p>Allows first responders to notify family with a single tap.</p>
                  </div>
                </label>
              </div>

              <div class="wizard-actions">
                <button type="button" class="btn btn-ghost prev-step-btn" data-prev="3">← Back</button>
                <button type="submit" class="btn btn-primary btn-lg" id="finishOnboardingBtn">
                  🚀 Your Emergency Passport is Ready → Complete Setup
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 6. AUTHENTICATED DASHBOARD (/dashboard)
  // ===========================================================================
  renderDashboard(user, passport) {
    const blood = passport?.bloodGroup || 'O+';
    const allergies = passport?.allergies || ['None Reported'];
    const conditions = passport?.conditions || ['None Reported'];
    const medications = passport?.medications || [];
    const contacts = passport?.emergencyContacts || [];

    return `
      <div class="dashboard-wrapper">
        <!-- WELCOME CARD -->
        <section class="welcome-banner glass-card">
          <div class="welcome-text-group">
            <h1 class="welcome-title">Good evening, ${user?.name || 'Traveler'}.</h1>
            <p class="welcome-status-line">
              <span class="status-pulse-dot"></span>
              Your Emergency Passport <strong>${user?.passportId || 'T-1001'}</strong> is active and protected.
            </p>
          </div>
          <div class="welcome-actions">
            <a href="#/qr" class="btn btn-primary btn-sm" data-route="/qr">
              📲 View Emergency QR
            </a>
            <a href="#/passport" class="btn btn-outline btn-sm" data-route="/passport">
              💳 Open Medical Passport
            </a>
          </div>
        </section>

        <!-- STATUS & MEDICAL SUMMARY GRID -->
        <section class="dashboard-grid">
          <!-- Passport Status Card -->
          <div class="dash-card glass-card">
            <div class="dash-card-header">
              <span class="dash-card-title">PASSPORT STATUS</span>
              ${UI.renderStatusBadge('VERIFIED / ACTIVE', true)}
            </div>

            <div class="passport-summary-body">
              <div class="summary-blood-highlight">
                <span class="blood-label">BLOOD GROUP</span>
                <span class="blood-value">${blood}</span>
              </div>

              <div class="summary-list-group">
                <div class="summary-line">
                  <span class="line-label">Critical Allergies:</span>
                  <div class="tags-group">
                    ${allergies.map(a => `<span class="allergy-tag-pill">⛔ ${a}</span>`).join('')}
                  </div>
                </div>

                <div class="summary-line">
                  <span class="line-label">Conditions:</span>
                  <div class="tags-group">
                    ${conditions.map(c => `<span class="condition-tag-pill">${c}</span>`).join('')}
                  </div>
                </div>

                ${medications.length > 0 ? `
                  <div class="summary-line">
                    <span class="line-label">Medications:</span>
                    <span class="meds-text">${medications.join(', ')}</span>
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="dash-card-footer">
              <span class="last-checked">Last Verified: ${passport?.lastVerified ? passport.lastVerified.split('T')[0] : 'Today'}</span>
              <a href="#/passport/edit" class="edit-link" data-route="/passport/edit">Edit Information →</a>
            </div>
          </div>

          <!-- Emergency Contacts Quick Card -->
          <div class="dash-card glass-card">
            <div class="dash-card-header">
              <span class="dash-card-title">PRIMARY EMERGENCY CONTACTS</span>
              <a href="#/emergency-contacts" class="btn btn-xs btn-ghost" data-route="/emergency-contacts">Manage All</a>
            </div>

            <div class="dash-contacts-list">
              ${contacts.slice(0, 3).map(c => UI.renderContactCard(c, false)).join('')}
            </div>

            <div class="dash-card-footer">
              <span>First responders can call family with 1-tap</span>
              <a href="#/emergency-contacts" class="edit-link" data-route="/emergency-contacts">+ Add Contact</a>
            </div>
          </div>
        </section>

        <!-- QUICK ACTIONS GRID -->
        <section class="quick-actions-section">
          <h3 class="section-subheading">QUICK ACTIONS</h3>
          <div class="quick-actions-grid">
            ${UI.renderQuickAction('💳', 'Open Medical Passport', 'View your emergency card formatted for responders', '/passport')}
            ${UI.renderQuickAction('📲', 'Show Emergency QR', 'Display lockscreen barcode for instant scanning', '/qr')}
            ${UI.renderQuickAction('🏥', 'Find Nearby Hospital', 'Check regional facility services and bed capacity', '/hospitals')}
            ${UI.renderQuickAction('⚡', 'Emergency Triage', 'Test sub-800ms Bedrock AI triage briefing', '/triage')}
            ${UI.renderQuickAction('✏️', 'Edit Medical Information', 'Update prescriptions, notes, and conditions', '/passport/edit')}
          </div>
        </section>

        <!-- RECENT ACTIVITY LOG -->
        <section class="activity-section glass-card">
          <h3 class="dash-card-title" style="margin-bottom: 16px;">RECENT SECURITY & PROFILE ACTIVITY</h3>
          <div class="activity-timeline">
            ${DEFAULT_ACTIVITIES.map(act => `
              <div class="timeline-row">
                <div class="timeline-icon ${act.type}"></div>
                <div class="timeline-info">
                  <div class="timeline-title">${act.title}</div>
                  <div class="timeline-desc">${act.desc}</div>
                </div>
                <div class="timeline-time">${act.time}</div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  },

  // ===========================================================================
  // 7. USER PROFILE (/profile)
  // ===========================================================================
  renderProfile(user, passport) {
    return `
      <div class="profile-page-wrapper">
        <!-- Profile Header -->
        <section class="profile-header-card glass-card">
          <div class="profile-avatar-huge">${user?.avatar || 'ER'}</div>
          <div class="profile-identity-info">
            <div class="profile-title-row">
              <h1 class="profile-name">${user?.name || 'Elena Rostova'}</h1>
              ${UI.renderStatusBadge('VERIFIED', true)}
            </div>
            <div class="profile-meta-pills">
              <span>🆔 Passport ID: <strong>${user?.passportId || 'T-1001'}</strong></span>
              <span>🌍 ${user?.country || 'United States'}</span>
              <span>🗣️ ${user?.language || 'English, Russian'}</span>
              <span>📅 Last Verified: ${passport?.lastVerified ? passport.lastVerified.split('T')[0] : 'Today'}</span>
            </div>
          </div>
        </section>

        <!-- Section Cards -->
        <div class="profile-cards-grid">
          <!-- 1. Personal Information -->
          <div class="profile-subcard glass-card">
            <div class="subcard-header">
              <h3>Personal Information</h3>
              <a href="#/passport/edit" class="btn btn-xs btn-outline">Edit</a>
            </div>
            <div class="info-list">
              <div class="info-item"><span>Full Legal Name:</span> <strong>${user?.name}</strong></div>
              <div class="info-item"><span>Email Address:</span> <strong>${user?.email}</strong></div>
              <div class="info-item"><span>Date of Birth:</span> <strong>${user?.dob || '1997-04-12'}</strong></div>
              <div class="info-item"><span>Nationality:</span> <strong>${user?.country || 'Global'}</strong></div>
            </div>
          </div>

          <!-- 2. Medical Information -->
          <div class="profile-subcard glass-card">
            <div class="subcard-header">
              <h3>Medical Information</h3>
              <a href="#/passport/edit" class="btn btn-xs btn-outline">Edit</a>
            </div>
            <div class="info-list">
              <div class="info-item"><span>Blood Group:</span> <strong class="text-danger">${passport?.bloodGroup || 'O+'}</strong></div>
              <div class="info-item">
                <span>Severe Allergies:</span>
                <div class="tags-group">
                  ${(passport?.allergies || []).map(a => `<span class="allergy-tag-pill">⛔ ${a}</span>`).join('')}
                </div>
              </div>
              <div class="info-item">
                <span>Conditions:</span>
                <div class="tags-group">
                  ${(passport?.conditions || []).map(c => `<span class="condition-tag-pill">${c}</span>`).join('')}
                </div>
              </div>
              <div class="info-item"><span>Medications:</span> <strong>${(passport?.medications || []).join(', ') || 'None'}</strong></div>
            </div>
          </div>

          <!-- 3. Emergency Contacts -->
          <div class="profile-subcard glass-card">
            <div class="subcard-header">
              <h3>Emergency Contacts</h3>
              <a href="#/emergency-contacts" class="btn btn-xs btn-outline">Manage</a>
            </div>
            <div class="contacts-mini-list">
              ${(passport?.emergencyContacts || []).map(c => `
                <div class="contact-mini-row">
                  <div>
                    <strong>${c.name}</strong> (${c.relationship})
                    <div style="font-size:0.8rem; color:var(--text-muted);">${c.phone}</div>
                  </div>
                  <a href="tel:${c.phone}" class="btn btn-xs btn-call-primary">Call</a>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 4. Privacy & Sharing -->
          <div class="profile-subcard glass-card">
            <div class="subcard-header">
              <h3>Privacy & Sharing</h3>
              <a href="#/settings" class="btn btn-xs btn-outline">Settings</a>
            </div>
            <div class="privacy-status-lines">
              <div class="p-status-line"><span>Emergency QR Access:</span> <strong class="text-success">ENABLED</strong></div>
              <div class="p-status-line"><span>Blood Group Sharing:</span> <strong>YES</strong></div>
              <div class="p-status-line"><span>Fatal Allergies Sharing:</span> <strong>YES</strong></div>
              <div class="p-status-line"><span>Pre-existing Conditions:</span> <strong>YES</strong></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 8. DIGITAL MEDICAL PASSPORT (/passport)
  // ===========================================================================
  renderPassport(user, passport) {
    const blood = passport?.bloodGroup || 'O+';
    const allergies = passport?.allergies || ['None Reported'];
    const conditions = passport?.conditions || ['None Reported'];
    const medications = passport?.medications || [];
    const contacts = passport?.emergencyContacts || [];

    return `
      <div class="passport-page-wrapper">
        <div class="passport-container">
          <!-- Physical Card Canvas (Optimized for First Responders) -->
          <div class="premium-passport-card glass-card" id="digitalPassportCard">
            <div class="passport-top-header">
              <div class="header-logo-group">
                <span class="red-cross-symbol">✚</span>
                <div>
                  <div class="doc-title">EMERGENCY MEDICAL PASSPORT</div>
                  <div class="doc-sub">INTERNATIONAL GOLDEN HOUR RECORD</div>
                </div>
              </div>
              <div class="passport-id-badge">${passport?.passportId || 'T-1001'}</div>
            </div>

            <div class="passport-hero-row">
              <div class="patient-profile-photo-circle">${user?.avatar || 'ER'}</div>
              <div class="patient-main-bio">
                <h1 class="passport-patient-name">${user?.name || 'Elena Rostova'}</h1>
                <div class="passport-meta-line">
                  <span>DOB: ${user?.dob || '1997-04-12'}</span> • 
                  <span>LANG: ${user?.language || 'English, Russian'}</span> • 
                  <span>NAT: ${user?.country || 'USA / Russia'}</span>
                </div>
              </div>
              <div class="passport-blood-large">
                <span class="p-blood-lbl">BLOOD</span>
                <span class="p-blood-val">${blood}</span>
              </div>
            </div>

            <!-- Prominent Critical Allergies Box -->
            <div class="passport-allergy-alert-banner">
              <div class="alert-banner-head">
                <span class="alert-icon">⚠️</span>
                <strong>CRITICAL ALLERGIES — DO NOT ADMINISTER:</strong>
              </div>
              <div class="allergy-tags-wrap">
                ${allergies.map(a => `<span class="allergy-badge-prominent">⛔ ${a}</span>`).join('')}
              </div>
            </div>

            <!-- Medical Conditions -->
            <div class="passport-section-row">
              <span class="p-sec-label">CHRONIC CONDITIONS:</span>
              <div class="tags-group">
                ${conditions.map(c => `<span class="condition-tag-pill">${c}</span>`).join('')}
              </div>
            </div>

            <!-- Current Medications -->
            ${medications.length > 0 ? `
              <div class="passport-section-row">
                <span class="p-sec-label">CURRENT MEDICATIONS:</span>
                <span class="p-sec-value">${medications.join(', ')}</span>
              </div>
            ` : ''}

            <!-- Emergency Contacts -->
            <div class="passport-section-row">
              <span class="p-sec-label">PRIMARY EMERGENCY CONTACTS:</span>
              <div class="contacts-grid">
                ${contacts.map(c => `
                  <div class="p-contact-chip">
                    <span>📞 ${c.name} (${c.relationship}): <strong>${c.phone}</strong></span>
                    <a href="tel:${c.phone}" class="btn btn-xs btn-call-primary">Call</a>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Emergency Notes -->
            ${passport?.emergencyNotes ? `
              <div class="passport-section-row">
                <span class="p-sec-label">CLINICAL & RESCUE NOTES:</span>
                <div class="p-notes-box">${passport.emergencyNotes}</div>
              </div>
            ` : ''}

            <div class="passport-card-bottom-bar">
              <span>SECURED VIA AMAZON DYNAMODB • VERIFIED RECORD</span>
              <span>LAST VERIFIED: ${passport?.lastVerified ? passport.lastVerified.split('T')[0] : 'TODAY'}</span>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="passport-actions-bar">
            <a href="#/qr" class="btn btn-primary btn-lg" data-route="/qr">
              📲 SHOW EMERGENCY QR
            </a>
            <button class="btn btn-outline btn-lg" id="printPassportCardBtn">
              🖨️ PRINT MEDICAL CARD
            </button>
            <a href="#/passport/edit" class="btn btn-ghost btn-lg" data-route="/passport/edit">
              ✏️ Edit Passport
            </a>
          </div>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 9. EDIT MEDICAL PASSPORT (/passport/edit)
  // ===========================================================================
  renderPassportEdit(user, passport) {
    return `
      <div class="edit-page-container">
        <div class="edit-card glass-card">
          <div class="edit-header">
            <h2>Edit Medical Information</h2>
            <p>Update your emergency profile. Changes are synchronized immediately to the database and your QR code.</p>
          </div>

          <form id="editPassportForm" class="edit-form">
            <div class="form-row">
              <div class="form-field col-6">
                <label for="editBloodGroup">Blood Group</label>
                <select id="editBloodGroup">
                  <option value="O+" ${passport?.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                  <option value="O-" ${passport?.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
                  <option value="A+" ${passport?.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                  <option value="A-" ${passport?.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                  <option value="B+" ${passport?.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                  <option value="B-" ${passport?.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                  <option value="AB+" ${passport?.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                  <option value="AB-" ${passport?.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                  <option value="Unknown" ${passport?.bloodGroup === 'Unknown' ? 'selected' : ''}>Unknown</option>
                </select>
              </div>
              <div class="form-field col-6">
                <label for="editAllergies">Severe Allergies (comma separated)</label>
                <input type="text" id="editAllergies" value="${(passport?.allergies || []).join(', ')}" />
              </div>
            </div>

            <div class="form-field">
              <label for="editConditions">Pre-existing Conditions (comma separated)</label>
              <input type="text" id="editConditions" value="${(passport?.conditions || []).join(', ')}" />
            </div>

            <div class="form-field">
              <label for="editMedications">Current Medications (comma separated)</label>
              <input type="text" id="editMedications" value="${(passport?.medications || []).join(', ')}" />
            </div>

            <div class="form-field">
              <label for="editNotes">Clinical & Rescue Notes</label>
              <textarea id="editNotes" rows="3">${passport?.emergencyNotes || ''}</textarea>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary btn-lg">
                💾 Save Changes
              </button>
              <a href="#/passport" class="btn btn-ghost btn-lg" data-route="/passport">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 10. EMERGENCY CONTACTS PAGE (/emergency-contacts)
  // ===========================================================================
  renderEmergencyContacts(user, passport) {
    const contacts = passport?.emergencyContacts || [];

    return `
      <div class="contacts-page-wrapper">
        <div class="contacts-header-row">
          <div>
            <h1>Emergency Family Contacts</h1>
            <p>Paramedics and hospital dispatch teams will call these numbers first.</p>
          </div>
          <button class="btn btn-primary btn-sm" id="openAddContactModalBtn">
            + Add New Contact
          </button>
        </div>

        <div class="contacts-grid-cards">
          ${contacts.length > 0 
            ? contacts.map(c => UI.renderContactCard(c, true)).join('')
            : UI.renderEmptyState('No Emergency Contacts Registered', 'Add at least 1 emergency contact so first responders can notify your family.', 'Add Contact', null)
          }
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 11. EMERGENCY QR CODE PAGE (/qr)
  // ===========================================================================
  renderQR(user, passport) {
    const pid = passport?.passportId || user?.passportId || 'T-1001';

    return `
      <div class="qr-page-wrapper">
        <div class="qr-card glass-card">
          <div class="qr-card-header">
            <h1 class="qr-main-title">Emergency Identity QR</h1>
            <p class="qr-sub-title">Scan this code with any camera to access verified emergency information in &lt;800ms.</p>
          </div>

          <!-- Large QR Display in Center -->
          <div class="qr-center-box">
            <div class="qr-svg-holder" id="largeQrHolder">
              <!-- SVG inserted dynamically -->
            </div>
            <div class="qr-pulse-ring"></div>
          </div>

          <!-- Identity Details Below QR -->
          <div class="qr-meta-block">
            <div class="qr-meta-item">
              <span>Passport ID:</span> <strong>${pid}</strong>
            </div>
            <div class="qr-meta-item">
              <span>Status:</span> ${UI.renderStatusBadge('ACTIVE / VERIFIED', true)}
            </div>
            <div class="qr-meta-item">
              <span>Last Verified:</span> <strong>${passport?.lastVerified ? passport.lastVerified.split('T')[0] : 'Today'}</strong>
            </div>
          </div>

          <!-- Privacy Control Box -->
          <div class="qr-privacy-control-box">
            <div class="privacy-switch-header">
              <div class="p-title-wrap">
                <strong>Emergency Public Access</strong>
                <span class="access-pill">ON</span>
              </div>
              <p>Allow first responders to scan and view authorized clinical contraindications:</p>
            </div>

            <div class="privacy-checklist">
              <div class="check-line">✓ Verified Blood Group (${passport?.bloodGroup || 'O+'})</div>
              <div class="check-line">✓ Critical Allergies (${(passport?.allergies || []).join(', ')})</div>
              <div class="check-line">✓ Medical Conditions</div>
              <div class="check-line">✓ Primary Emergency Contacts</div>
              <div class="check-line">✓ Current Prescription Medications</div>
            </div>
            <div class="privacy-notice">
              🛡️ Zero unnecessary personal or financial data is exposed.
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="qr-action-buttons">
            <button class="btn btn-outline" id="regenerateQrBtn">
              🔄 Regenerate QR
            </button>
            <button class="btn btn-primary" id="downloadQrImageBtn">
              📥 Download QR Code
            </button>
            <a href="#/passport" class="btn btn-ghost" data-route="/passport">
              💳 Show Emergency Card
            </a>
          </div>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 12. HOSPITALS DIRECTORY (/hospitals)
  // ===========================================================================
  renderHospitals(hospitals = []) {
    return `
      <div class="hospitals-page-wrapper">
        <div class="hospitals-head-row">
          <div>
            <h1>Regional Emergency Hospitals Directory</h1>
            <p>Real-time regional capacity, trauma centers, and specialized department directory.</p>
          </div>
          <div class="hospitals-filter">
            <select id="facilityFilterSelect" class="styled-select">
              <option value="all">All Regional Facilities</option>
              <option value="ICU">Intensive Care Unit (ICU)</option>
              <option value="Trauma Center Level 1">Trauma Center Level 1</option>
              <option value="Cardiology">Cardiology Unit</option>
              <option value="Air Ambulance">Air Ambulance / Helipad</option>
              <option value="Hyperbaric Medicine">Hyperbaric Medicine</option>
            </select>
          </div>
        </div>

        <div class="hospitals-grid-list" id="facilitiesGrid">
          ${hospitals.map(h => UI.renderHospitalCard(h)).join('')}
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 13. SETTINGS PAGE (/settings)
  // ===========================================================================
  renderSettings(user, passport) {
    return `
      <div class="settings-page-wrapper">
        <div class="settings-card glass-card">
          <h1>Settings & Preferences</h1>
          <p class="settings-sub">Manage your security, appearance, language, and emergency response settings.</p>

          <div class="settings-group">
            <h3>Appearance & Interface</h3>
            <div class="settings-row">
              <div>
                <strong>Theme Display Mode</strong>
                <p>Toggle between dark command center and light clinical day mode</p>
              </div>
              <button class="btn btn-sm btn-outline" id="settingsThemeBtn">Customize Theme</button>
            </div>
          </div>

          <div class="settings-group">
            <h3>Language & Localization</h3>
            <div class="settings-row">
              <div>
                <strong>Application Language</strong>
                <p>Available in all 22 officially scheduled Indian languages + English</p>
              </div>
              <button class="btn btn-sm btn-outline" id="settingsLangBtn">Change Language (22 Languages)</button>
            </div>
          </div>

          <div class="settings-group">
            <h3>Account & Security</h3>
            <div class="settings-row">
              <div>
                <strong>Password</strong>
                <p>Last changed 2 months ago</p>
              </div>
              <a href="#/forgot-password" class="btn btn-sm btn-outline" data-route="/forgot-password">Change Password</a>
            </div>
            <div class="settings-row">
              <div>
                <strong>Active Session</strong>
                <p>Logged in as ${user?.email || 'elena@rescue.io'}</p>
              </div>
              <button class="btn btn-sm btn-outline-danger" id="settingsLogoutBtn">Log Out</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 14. RESPONDER HUD (ROLE 2: PARAMEDIC)
  // ===========================================================================
  renderResponderHUD(user) {
    return `
      <div class="responder-hud-wrapper">
        <div class="responder-banner glass-card">
          <div>
            <div class="hud-badge">🚑 FIRST RESPONDER TERMINAL</div>
            <h1>Paramedic Field Command</h1>
            <p>Logged in as <strong>${user?.name}</strong> • Station: Central EMS Battalion 4</p>
          </div>
          <a href="#/triage" class="btn btn-primary btn-lg" data-route="/triage">
            📷 SCAN NEW EMERGENCY QR
          </a>
        </div>

        <h3 class="section-subheading">ACTIVE EMERGENCY DISPATCH CASES</h3>
        <div class="cases-grid">
          ${DEFAULT_EMERGENCY_CASES.map(c => `
            <div class="case-card glass-card">
              <div class="case-header">
                <span class="case-id">${c.id}</span>
                <span class="case-severity ${c.severity === 'CRITICAL' ? 'critical' : 'high'}">${c.severity}</span>
              </div>
              <div class="case-patient-name">${c.patientName} (${c.age} y/o, Blood: ${c.bloodType})</div>
              <div class="case-alert-text">⚠️ Critical Allergy: ${c.criticalAllergy}</div>
              <div class="case-meta">
                <span>📍 ${c.location}</span>
                <span>⏱️ ETA: ${c.eta}</span>
                <span>🏥 Assigned: ${c.assignedHospital}</span>
              </div>
              <div class="case-actions">
                <a href="#/triage?id=${c.touristId}" class="btn btn-sm btn-primary">Open Clinical Brief</a>
                <a href="tel:911" class="btn btn-sm btn-outline">Call Ambulance Dispatch</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 15. HOSPITAL ADMIN DASHBOARD (ROLE 3: ADMIN)
  // ===========================================================================
  renderHospitalAdmin(user) {
    return `
      <div class="admin-dashboard-wrapper">
        <div class="admin-banner glass-card">
          <div>
            <div class="admin-badge">🏥 HOSPITAL EMERGENCY COMMAND</div>
            <h1>${user?.hospitalName || 'City General ICU & Cardiology Center'}</h1>
            <p>Admin: <strong>${user?.name}</strong> • Real-time Bed Management & Incoming Trauma Routing</p>
          </div>
          <button class="btn btn-outline btn-sm" id="syncCapacityBtn">🔄 Refresh Bed Inventory</button>
        </div>

        <div class="admin-metrics-grid">
          <div class="metric-card glass-card">
            <span class="metric-label">TOTAL ICU CAPACITY</span>
            <span class="metric-num">420</span>
            <span class="metric-sub">82 Beds Available Now</span>
          </div>
          <div class="metric-card glass-card">
            <span class="metric-label">TRAUMA LEVEL 1 STATUS</span>
            <span class="metric-num text-success">ONLINE</span>
            <span class="metric-sub">2 Surgical Theaters Open</span>
          </div>
          <div class="metric-card glass-card">
            <span class="metric-label">INCOMING AMBULANCES</span>
            <span class="metric-num text-danger">2</span>
            <span class="metric-sub">ETA 6 mins & 12 mins</span>
          </div>
        </div>

        <h3 class="section-subheading">INCOMING TRIAGE ADMISSIONS</h3>
        <div class="incoming-table-wrap glass-card">
          <table class="styled-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Patient</th>
                <th>Blood</th>
                <th>Critical Contraindication</th>
                <th>Required Unit</th>
                <th>ETA</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>CASE-8841</td>
                <td><strong>Elena Rostova</strong> (29 y/o)</td>
                <td><span class="blood-pill">O+</span></td>
                <td><span class="allergy-pill">⛔ Penicillin, Peanuts</span></td>
                <td>ICU / Respiratory</td>
                <td>~6 mins</td>
                <td><a href="#/triage?id=T-1001" class="btn btn-xs btn-primary">Prep Triage</a></td>
              </tr>
              <tr>
                <td>CASE-8842</td>
                <td><strong>Kenji Sato</strong> (34 y/o)</td>
                <td><span class="blood-pill">A-</span></td>
                <td><span class="allergy-pill">⛔ Latex Allergy</span></td>
                <td>ICU / Endocrine</td>
                <td>~12 mins</td>
                <td><a href="#/triage?id=T-1002" class="btn btn-xs btn-primary">Prep Triage</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },
};
