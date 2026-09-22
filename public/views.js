/**
 * Emergency Passport — Page Views & Editorial Renderers
 * Luxury Editorial × Medical Technology Design System
 * Clean Typography • Asymmetrical Layouts • Tactile Stationary Cards
 */

const Views = {
  // ===========================================================================
  // 1. LANDING EXPERIENCE (Editorial Storytelling)
  // ===========================================================================
  renderLanding(user) {
    const isAuth = Boolean(user);

    return `
      <div class="landing-editorial-wrap">
        
        <!-- Immersive Hero Block -->
        <section class="landing-hero-block">
          <div class="hero-eyebrow-pill">
            <span class="crest-star">✦</span>
            <span>EMERGENCY PASSPORT • GOLDEN HOUR LIFELINE</span>
          </div>

          <h1 class="editorial-display hero-title-main">
            Your medical identity,<br>
            <span class="editorial-italic">when every second matters.</span>
          </h1>

          <p class="hero-sub-text">
            Carry verified medical and emergency information wherever you go. When crisis strikes abroad, first responders access blood types, fatal allergies, and AI clinical briefings in under 800 milliseconds.
          </p>

          <div class="hero-actions-row">
            ${isAuth ? `
              <a href="#/passport" class="btn btn-lg btn-primary" data-route="/passport">
                <span class="btn-icon">${UI.icons.fileText}</span>
                <span>Open My Passport</span>
              </a>
              <a href="#/qr" class="btn btn-lg btn-outline" data-route="/qr">
                <span class="btn-icon">${UI.icons.qrCode}</span>
                <span>Emergency QR</span>
              </a>
            ` : `
              <a href="#/signup" class="btn btn-lg btn-primary" data-route="/signup">
                <span>Create Emergency Passport</span>
                <span class="btn-icon">${UI.icons.arrowRight}</span>
              </a>
              <a href="#/triage" class="btn btn-lg btn-outline" data-route="/triage">
                <span class="btn-icon">${UI.icons.heartPulse}</span>
                <span>Explore How It Works</span>
              </a>
            `}
          </div>
        </section>

        <!-- Hero Visual Showcase: Integrated Dual Console (Passport + Live Trauma Radar) -->
        <section class="hero-showcase-container">
          <div class="hero-showcase-grid">
            
            <!-- Left: High-Precision Verified Medical Passport -->
            <div class="showcase-passport-card" data-parallax-card>
              ${UI.renderPassportDocument({
                bloodGroup: 'O+',
                allergies: ['Penicillin (Anaphylaxis)', 'Peanuts (Severe)'],
                conditions: ['Asthma (Carry Inhaler)', 'Mild Hypertension'],
                emergencyContacts: [
                  { name: 'Mark Rostova', relationship: 'Spouse', phone: '+1 (555) 019-2834' },
                  { name: 'Dr. Viktor Rostov', relationship: 'Father · Physician', phone: '+1 (555) 018-9921' }
                ],
                lastVerified: '2026-09-22'
              }, {
                name: 'Elena Rostova',
                passportId: 'T-1001',
                avatar: 'ER',
                country: 'International Traveler',
                language: 'English, Russian',
                dob: '1995-04-12'
              })}
            </div>

            <!-- Right: Interactive Live Emergency Trauma Radar Console -->
            <div class="showcase-map-card glass-card" data-parallax-card>
              <div class="radar-sweep-beam" aria-hidden="true"></div>
              <div class="radar-sonar-ping" aria-hidden="true"></div>
              
              <div class="showcase-map-header" data-parallax-depth="12">
                <div class="radar-live-badge">
                  <span class="pulse-dot"></span>
                  <span>LIVE TRAUMA RADAR</span>
                </div>
                <span class="radar-coords">35.6895° N, 139.6917° E</span>
              </div>

              <div id="heroInteractiveMap" class="interactive-hero-map"></div>

              <div class="showcase-map-footer" data-parallax-depth="14">
                <div class="telemetry-item">
                  <span class="telemetry-label">NEAREST TRAUMA CENTER</span>
                  <span class="telemetry-val">St. Jude Emergency Center</span>
                </div>
                <div class="telemetry-item">
                  <span class="telemetry-label">RESPONSE TIME</span>
                  <span class="telemetry-val text-medical">~6 mins (Level 1 ICU)</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- 4-Step Golden Hour Storytelling -->
        <section class="editorial-story-section">
          <div class="story-header-center">
            <span class="story-eyebrow">THE LIFESAVING PROTOCOL</span>
            <h2 class="story-title editorial-italic">One passport. Every emergency.</h2>
            <p>From sudden collapse to hospital arrival, how the borderless lifeline protects you.</p>
          </div>

          <div class="story-steps-grid">
            <div class="story-step-card glass-card" data-parallax-card>
              <span class="step-num-mono" data-parallax-depth="8">STEP 01</span>
              <h3 class="step-heading" data-parallax-depth="14">Create</h3>
              <p class="step-body-copy">Record your verified blood group, fatal drug contraindications, chronic conditions, and emergency family contacts in under two minutes.</p>
            </div>

            <div class="story-step-card glass-card" data-parallax-card>
              <span class="step-num-mono" data-parallax-depth="8">STEP 02</span>
              <h3 class="step-heading" data-parallax-depth="14">Verify</h3>
              <p class="step-body-copy">Your clinical records are cryptographically sealed with AWS KMS 256-bit envelope encryption and point-in-time recovery on Amazon DynamoDB.</p>
            </div>

            <div class="story-step-card glass-card" data-parallax-card>
              <span class="step-num-mono" data-parallax-depth="8">STEP 03</span>
              <h3 class="step-heading" data-parallax-depth="14">Carry</h3>
              <p class="step-body-copy">Carry your universal QR code on your phone lockscreen, Apple Health wallet, or print a durable physical medical identity card.</p>
            </div>

            <div class="story-step-card glass-card" data-parallax-card>
              <span class="step-num-mono" data-parallax-depth="8">STEP 04</span>
              <h3 class="step-heading" data-parallax-depth="14">Respond</h3>
              <p class="step-body-copy">First responders scan your QR with zero app installation. Amazon Bedrock Claude 3 synthesizes an urgent 5-point clinical triage briefing.</p>
            </div>
          </div>
        </section>

        <!-- Medical Privacy Trust Seal -->
        <section class="editorial-trust-seal">
          <div>
            <div class="trust-badge-label">
              <span class="icon-inline">${UI.icons.shieldCheck}</span>
              <span>MEDICAL PRIVACY FIRST ARCHITECTURE</span>
            </div>
            <h3 class="trust-title">Zero Unnecessary Data Exposure</h3>
            <p class="trust-copy">
              We never expose financial data, national IDs, or continuous GPS tracks. In life-or-death situations, first responders access only actionable clinical contraindications (allergies, blood group, vital family contacts) according to your explicit sharing settings.
            </p>
          </div>

          <div class="trust-pillars-row">
            <div class="trust-pillar-item">
              <span class="icon-inline">${UI.icons.check}</span>
              <span>HIPAA-Ready Encryption</span>
            </div>
            <div class="trust-pillar-item">
              <span class="icon-inline">${UI.icons.check}</span>
              <span>Sub-800ms Retrieval</span>
            </div>
            <div class="trust-pillar-item">
              <span class="icon-inline">${UI.icons.check}</span>
              <span>Zero-Login Paramedic Access</span>
            </div>
            <div class="trust-pillar-item">
              <span class="icon-inline">${UI.icons.check}</span>
              <span>Offline Clinical Fallback</span>
            </div>
          </div>
        </section>

      </div>
    `;
  },

  // ===========================================================================
  // 2. AUTHENTICATION: LOGIN (Editorial Split-Screen)
  // ===========================================================================
  renderLogin() {
    return `
      <div class="auth-editorial-viewport">
        <!-- Left: Visual & Security Motif -->
        <div class="auth-visual-pane">
          <div>
            <div class="brand-crest-icon" style="margin-bottom: 24px;">
              <span class="crest-star">✦</span>
            </div>
            <h2 class="editorial-display" style="font-size: 2.4rem; margin-bottom: 12px;">
              Enter your<br><span class="editorial-italic">medical identity.</span>
            </h2>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
              Secure access to your global emergency medical passport, verified clinical contraindications, and active QR tokens.
            </p>
          </div>

          <div class="auth-visual-footer">
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--gold);">
              ✦ SECURE ENCLAVE • AWS KMS 256-BIT ENCRYPTED
            </div>
          </div>
        </div>

        <!-- Right: Luxury Auth Form -->
        <div class="auth-form-pane">
          <h3 style="font-size: 1.5rem; margin-bottom: 6px;">Sign In</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px;">
            Don't have an emergency passport? <a href="#/signup" data-route="/signup" style="color: var(--gold); font-weight: 600; text-decoration: none;">Create one now</a>
          </p>

          <form id="loginForm" class="auth-form">
            <div class="editorial-field">
              <label for="loginEmail" class="editorial-label">Email Address or Username</label>
              <input type="text" id="loginEmail" class="editorial-input" required placeholder="elena@rescue.io" value="elena@rescue.io" autocomplete="username" />
            </div>

            <div class="editorial-field">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label for="loginPassword" class="editorial-label">Password</label>
                <a href="#/forgot-password" data-route="/forgot-password" style="font-size: 0.75rem; color: var(--text-secondary); text-decoration: none;">Forgot password?</a>
              </div>
              <div style="position: relative;">
                <input type="password" id="loginPassword" class="editorial-input" required placeholder="••••••••" value="password123" autocomplete="current-password" />
                <button type="button" id="togglePasswordBtn" class="btn btn-icon-only" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: transparent; border: none; cursor: pointer; color: var(--text-secondary);" title="Toggle Password">
                  <span class="icon-wrap">${UI.icons.eye}</span>
                </button>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: var(--text-secondary);">
              <input type="checkbox" id="rememberMe" checked style="accent-color: var(--gold);" />
              <label for="rememberMe">Remember me on this trusted terminal</label>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" id="submitLoginBtn">
              <span>Sign In to Passport</span>
              <span class="btn-spinner hidden"></span>
            </button>

            <div style="display: flex; align-items: center; gap: 12px; margin: 10px 0;">
              <div style="flex: 1; height: 1px; background: var(--border);"></div>
              <span style="font-size: 0.72rem; color: var(--text-muted); font-family: var(--font-mono);">OR</span>
              <div style="flex: 1; height: 1px; background: var(--border);"></div>
            </div>

            <button type="button" class="btn btn-outline btn-block" id="googleLoginBtn">
              <span>Continue with Google</span>
            </button>
          </form>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 3. AUTHENTICATION: SIGNUP (Clean Multi-Step Identity Registration)
  // ===========================================================================
  renderSignup() {
    return `
      <div class="auth-editorial-viewport">
        <div class="auth-visual-pane">
          <div>
            <div class="brand-crest-icon" style="margin-bottom: 24px;">
              <span class="crest-star">✦</span>
            </div>
            <h2 class="editorial-display" style="font-size: 2.4rem; margin-bottom: 12px;">
              Your lifeline<br><span class="editorial-italic">starts here.</span>
            </h2>
            <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
              Create your universal medical identity in minutes. Accessible by first responders anywhere on Earth in under 800 milliseconds.
            </p>
          </div>

          <div class="auth-visual-footer">
            <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--gold);">
              ✦ ZERO UNNECESSARY EXPOSURE • HIPAA COMPLIANT
            </div>
          </div>
        </div>

        <div class="auth-form-pane">
          <h3 style="font-size: 1.5rem; margin-bottom: 6px;">Create Passport</h3>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px;">
            Already have an account? <a href="#/login" data-route="/login" style="color: var(--gold); font-weight: 600; text-decoration: none;">Sign in</a>
          </p>

          <form id="signupForm" class="auth-form">
            <div class="editorial-field">
              <label for="signupName" class="editorial-label">Full Name</label>
              <input type="text" id="signupName" class="editorial-input" required placeholder="Elena Rostova" />
            </div>

            <div class="editorial-field">
              <label for="signupEmail" class="editorial-label">Email Address</label>
              <input type="email" id="signupEmail" class="editorial-input" required placeholder="elena@rescue.io" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="editorial-field">
                <label for="signupPassword" class="editorial-label">Password</label>
                <input type="password" id="signupPassword" class="editorial-input" required placeholder="••••••••" />
              </div>
              <div class="editorial-field">
                <label for="signupConfirmPassword" class="editorial-label">Confirm Password</label>
                <input type="password" id="signupConfirmPassword" class="editorial-input" required placeholder="••••••••" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="editorial-field">
                <label for="signupDob" class="editorial-label">Date of Birth</label>
                <input type="date" id="signupDob" class="editorial-input" required value="1995-04-12" />
              </div>
              <div class="editorial-field">
                <label for="signupCountry" class="editorial-label">Nationality</label>
                <input type="text" id="signupCountry" class="editorial-input" required placeholder="International" />
              </div>
            </div>

            <div class="editorial-field">
              <label for="signupContact" class="editorial-label">Primary Emergency Contact</label>
              <input type="text" id="signupContact" class="editorial-input" required placeholder="Mark Rostova (+1-555-019-2834)" />
            </div>

            <div style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.78rem; color: var(--text-secondary);">
              <input type="checkbox" id="signupTerms" required checked style="margin-top: 3px; accent-color: var(--gold);" />
              <label for="signupTerms">I accept the Emergency Passport terms and authorize zero-login emergency responder access to my clinical contraindications.</label>
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg" id="submitSignupBtn">
              <span>Create Account & Continue</span>
              <span class="btn-spinner hidden"></span>
            </button>
          </form>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 4. AUTHENTICATION: FORGOT & RESET PASSWORD
  // ===========================================================================
  renderForgotPassword() {
    return `
      <div class="auth-editorial-viewport" style="max-width: 600px; grid-template-columns: 1fr;">
        <div class="auth-form-pane">
          <div class="brand-crest-icon" style="margin-bottom: 20px;">
            <span class="crest-star">✦</span>
          </div>
          <h2 style="font-size: 1.6rem; margin-bottom: 6px;">Reset Password</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px;">
            Enter your registered email address to receive an emergency password reset link.
          </p>

          <form id="forgotForm" class="auth-form">
            <div class="editorial-field">
              <label for="forgotEmail" class="editorial-label">Email Address</label>
              <input type="email" id="forgotEmail" class="editorial-input" required placeholder="elena@rescue.io" value="elena@rescue.io" />
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg">
              <span>Send Recovery Link</span>
            </button>

            <a href="#/login" data-route="/login" class="btn btn-ghost btn-block" style="margin-top: 8px;">
              <span>← Back to Sign In</span>
            </a>
          </form>
        </div>
      </div>
    `;
  },

  renderResetPassword() {
    return `
      <div class="auth-editorial-viewport" style="max-width: 600px; grid-template-columns: 1fr;">
        <div class="auth-form-pane">
          <div class="brand-crest-icon" style="margin-bottom: 20px;">
            <span class="crest-star">✦</span>
          </div>
          <h2 style="font-size: 1.6rem; margin-bottom: 6px;">Create New Password</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px;">
            Choose a strong passphrase to protect your clinical records.
          </p>

          <form id="resetForm" class="auth-form">
            <div class="editorial-field">
              <label for="newPassword" class="editorial-label">New Password</label>
              <input type="password" id="newPassword" class="editorial-input" required placeholder="••••••••" />
            </div>

            <div class="editorial-field">
              <label for="confirmNewPassword" class="editorial-label">Confirm New Password</label>
              <input type="password" id="confirmNewPassword" class="editorial-input" required placeholder="••••••••" />
            </div>

            <button type="submit" class="btn btn-primary btn-block btn-lg">
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 5. USER ONBOARDING WIZARD (4 Guided Steps)
  // ===========================================================================
  renderOnboarding(user, passport) {
    return `
      <div class="triage-workflow-viewport">
        <div class="triage-progress-bar glass-card">
          <div class="progress-step-node active" id="stepIndicator1">
            <span class="node-number">1</span>
            <span>Identity</span>
          </div>
          <div class="progress-step-node" id="stepIndicator2">
            <span class="node-number">2</span>
            <span>Clinical Info</span>
          </div>
          <div class="progress-step-node" id="stepIndicator3">
            <span class="node-number">3</span>
            <span>Contacts</span>
          </div>
          <div class="progress-step-node" id="stepIndicator4">
            <span class="node-number">4</span>
            <span>Privacy</span>
          </div>
        </div>

        <form id="onboardingForm">
          <!-- Step 1: Identity -->
          <div class="triage-step-card glass-card" id="wizardStep1">
            <div>
              <span class="story-eyebrow">STEP 01 OF 04</span>
              <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Basic Identity</h2>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">Verify your name and international document details.</p>

              <div class="auth-form" style="margin-top: 24px;">
                <div class="editorial-field">
                  <label class="editorial-label">Full Name</label>
                  <input type="text" id="obName" class="editorial-input" value="${user?.name || 'Elena Rostova'}" required />
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                  <div class="editorial-field">
                    <label class="editorial-label">Nationality</label>
                    <input type="text" id="obNationality" class="editorial-input" value="${user?.country || 'International Traveler'}" required />
                  </div>
                  <div class="editorial-field">
                    <label class="editorial-label">Preferred Language</label>
                    <input type="text" id="obLanguage" class="editorial-input" value="${user?.language || 'English, Russian'}" required />
                  </div>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 32px;">
              <button type="button" class="btn btn-primary next-step-btn" data-next="2">
                <span>Continue to Clinical Info</span>
                <span class="btn-icon">${UI.icons.arrowRight}</span>
              </button>
            </div>
          </div>

          <!-- Step 2: Clinical -->
          <div class="triage-step-card glass-card hidden" id="wizardStep2">
            <div>
              <span class="story-eyebrow">STEP 02 OF 04</span>
              <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Clinical Emergency Data</h2>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">Crucial medical data accessed by paramedics during golden hour trauma.</p>

              <div class="auth-form" style="margin-top: 24px;">
                <div class="editorial-field">
                  <label class="editorial-label">Blood Group & Rh Factor</label>
                  <select id="obBloodGroup" class="editorial-input" style="cursor: pointer;">
                    <option value="O+" selected>O+ (Rh Positive)</option>
                    <option value="O-">O- (Universal Donor)</option>
                    <option value="A+">A+ (Rh Positive)</option>
                    <option value="A-">A- (Rh Negative)</option>
                    <option value="B+">B+ (Rh Positive)</option>
                    <option value="B-">B- (Rh Negative)</option>
                    <option value="AB+">AB+ (Universal Recipient)</option>
                    <option value="AB-">AB- (Rh Negative)</option>
                  </select>
                </div>

                <div class="editorial-field">
                  <label class="editorial-label" style="color: var(--emergency);">Critical Drug Allergies & Anaphylaxis Risks (Comma-separated)</label>
                  <input type="text" id="obAllergies" class="editorial-input" value="Penicillin, Peanuts" placeholder="e.g. Penicillin, Latex, Sulfa" />
                </div>

                <div class="editorial-field">
                  <label class="editorial-label">Chronic Conditions (Comma-separated)</label>
                  <input type="text" id="obConditions" class="editorial-input" value="Asthma, Mild Hypertension" placeholder="e.g. Asthma, Diabetes Type 1" />
                </div>

                <div class="editorial-field">
                  <label class="editorial-label">Current Medications</label>
                  <input type="text" id="obMedications" class="editorial-input" value="Albuterol HFA Inhaler, Lisinopril 10mg" />
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 32px;">
              <button type="button" class="btn btn-outline prev-step-btn" data-prev="1">Back</button>
              <button type="button" class="btn btn-primary next-step-btn" data-next="3">Continue to Contacts</button>
            </div>
          </div>

          <!-- Step 3: Emergency Contacts -->
          <div class="triage-step-card glass-card hidden" id="wizardStep3">
            <div>
              <span class="story-eyebrow">STEP 03 OF 04</span>
              <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Emergency Family Contacts</h2>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">Direct phone contacts for immediate hospital notification.</p>

              <div id="obContactsContainer" style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
                <div class="contact-entry-card glass-card" style="padding: 16px;">
                  <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                    <input type="text" class="contact-input-name editorial-input" placeholder="Contact Name" value="Mark Rostova" required />
                    <input type="text" class="contact-input-rel editorial-input" placeholder="Relationship" value="Spouse" required />
                    <input type="tel" class="contact-input-phone editorial-input" placeholder="Phone Number" value="+1 (555) 019-2834" required />
                  </div>
                </div>
              </div>

              <button type="button" class="btn btn-sm btn-outline" id="obAddContactBtn" style="margin-top: 14px;">
                <span class="btn-icon">${UI.icons.plus}</span>
                <span>Add Another Contact</span>
              </button>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 32px;">
              <button type="button" class="btn btn-outline prev-step-btn" data-prev="2">Back</button>
              <button type="button" class="btn btn-primary next-step-btn" data-next="4">Continue to Privacy</button>
            </div>
          </div>

          <!-- Step 4: Privacy Settings -->
          <div class="triage-step-card glass-card hidden" id="wizardStep4">
            <div>
              <span class="story-eyebrow">STEP 04 OF 04</span>
              <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Privacy & Emergency Sharing</h2>
              <p style="font-size: 0.9rem; color: var(--text-secondary);">Control exactly which fields are visible when your QR code is scanned.</p>

              <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 24px;">
                <label style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" id="privBlood" checked style="accent-color: var(--gold);" />
                  <span>Share Blood Group & Rh Factor</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" id="privAllergies" checked style="accent-color: var(--emergency);" />
                  <span>Share Fatal Drug Allergies (Recommended for golden hour safety)</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" id="privConditions" checked style="accent-color: var(--gold);" />
                  <span>Share Chronic Medical Diagnoses</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px; font-size: 0.88rem; cursor: pointer;">
                  <input type="checkbox" id="privContacts" checked style="accent-color: var(--medical);" />
                  <span>Share Emergency Family Phone Numbers</span>
                </label>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-top: 32px;">
              <button type="button" class="btn btn-outline prev-step-btn" data-prev="3">Back</button>
              <button type="submit" class="btn btn-primary btn-lg" id="finishOnboardingBtn">
                <span class="crest-star">✦</span>
                <span>Generate Emergency Passport</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
  },

  // ===========================================================================
  // 6. AUTHENTICATED DASHBOARD (Personal Command Center)
  // ===========================================================================
  renderDashboard(user, passport) {
    const p = passport || {};
    const u = user || {};

    return `
      <div class="dashboard-page-wrap">
        
        <!-- Salutation Header -->
        <header class="dashboard-hero-header">
          <div>
            <span class="story-eyebrow">PERSONAL EMERGENCY COMMAND CENTER</span>
            <h1 class="dash-salutation">Good evening, ${(u.name || 'Elena').split(' ')[0]}.</h1>
            <p class="dash-subtitle">Your Emergency Passport is verified and active across all global trauma networks.</p>
          </div>

          <div class="dash-hero-actions">
            <a href="#/passport" class="btn btn-sm btn-outline" data-route="/passport">
              <span class="btn-icon">${UI.icons.fileText}</span>
              <span>View Passport</span>
            </a>
            <a href="#/qr" class="btn btn-sm btn-primary" data-route="/qr">
              <span class="btn-icon">${UI.icons.qrCode}</span>
              <span>Emergency QR</span>
            </a>
          </div>
        </header>

        <!-- Asymmetrical Core Grid -->
        <div class="dashboard-core-grid">
          
          <!-- Left Main: Central Digital Passport Document -->
          <div class="dashboard-main-col">
            ${UI.renderPassportDocument(p, u)}

            <!-- Quick Action Strip -->
            <div class="quick-action-strip">
              <a href="#/passport" class="quick-action-pill-card" data-route="/passport">
                <div class="action-icon-box">${UI.icons.fileText}</div>
                <div class="action-label-box">
                  <span class="action-primary-label">Digital Passport</span>
                  <span class="action-sub-label">Full Clinical Card</span>
                </div>
              </a>

              <a href="#/qr" class="quick-action-pill-card" data-route="/qr">
                <div class="action-icon-box">${UI.icons.qrCode}</div>
                <div class="action-label-box">
                  <span class="action-primary-label">Emergency QR</span>
                  <span class="action-sub-label">Zero-Login Token</span>
                </div>
              </a>

              <a href="#/hospitals" class="quick-action-pill-card" data-route="/hospitals">
                <div class="action-icon-box">${UI.icons.hospital}</div>
                <div class="action-label-box">
                  <span class="action-primary-label">Trauma Facilities</span>
                  <span class="action-sub-label">Map & Bed Inventory</span>
                </div>
              </a>

              <a href="#/triage" class="quick-action-pill-card" data-route="/triage">
                <div class="action-icon-box">${UI.icons.heartPulse}</div>
                <div class="action-label-box">
                  <span class="action-primary-label">Triage Workflow</span>
                  <span class="action-sub-label">Field AI Briefing</span>
                </div>
              </a>
            </div>
          </div>

          <!-- Right Side: Readiness Score & Audit Activity -->
          <div class="dashboard-side-col">
            
            <!-- Circular Emergency Readiness Gauge -->
            <div class="readiness-summary-card glass-card">
              ${UI.renderReadinessGauge(96)}
              <div class="readiness-details-col">
                <span class="readiness-title">Emergency Readiness</span>
                
                <div>
                  <div class="readiness-metric-row">
                    <span>Identity Verification</span>
                    <span>100%</span>
                  </div>
                  <div class="metric-bar-track"><div class="metric-bar-fill" style="width: 100%;"></div></div>
                </div>

                <div>
                  <div class="readiness-metric-row">
                    <span>Clinical Records</span>
                    <span>100%</span>
                  </div>
                  <div class="metric-bar-track"><div class="metric-bar-fill" style="width: 100%;"></div></div>
                </div>

                <div>
                  <div class="readiness-metric-row">
                    <span>Family Contacts</span>
                    <span>80%</span>
                  </div>
                  <div class="metric-bar-track"><div class="metric-bar-fill" style="width: 80%;"></div></div>
                </div>
              </div>
            </div>

            <!-- Recent Verified Activity -->
            <div class="activity-card glass-card">
              <div class="activity-card-header">
                <h4 style="font-size: 0.95rem;">Recent Telemetry</h4>
                <span class="editorial-status-pill verified">ACTIVE</span>
              </div>

              <div class="activity-timeline-list">
                <div class="activity-item-row">
                  <span class="timeline-bullet"></span>
                  <div class="activity-text-wrap">
                    <span class="activity-main-text">Clinical passport verified & encrypted</span>
                    <span class="activity-time-stamp">AWS KMS Envelope • Today</span>
                  </div>
                </div>

                <div class="activity-item-row">
                  <span class="timeline-bullet"></span>
                  <div class="activity-text-wrap">
                    <span class="activity-main-text">Emergency contacts synchronized</span>
                    <span class="activity-time-stamp">2 Primary Numbers • Yesterday</span>
                  </div>
                </div>

                <div class="activity-item-row">
                  <span class="timeline-bullet"></span>
                  <div class="activity-text-wrap">
                    <span class="activity-main-text">Regional trauma centers mapped</span>
                    <span class="activity-time-stamp">4 Facilities • Tokyo Metro Area</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    `;
  },

  // ===========================================================================
  // 7. DIGITAL MEDICAL PASSPORT PAGE
  // ===========================================================================
  renderPassport(user, passport) {
    return `
      <div class="qr-page-wrap" style="max-width: 860px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <div>
            <span class="story-eyebrow">DIGITAL MEDICAL IDENTITY SPECIFICATION</span>
            <h1 style="font-size: 2rem;">Emergency Medical Passport</h1>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-sm btn-outline" id="printPassportCardBtn">
              <span class="btn-icon">${UI.icons.download}</span>
              <span>Print Medical Card</span>
            </button>
            <a href="#/passport/edit" class="btn btn-sm btn-primary" data-route="/passport/edit">
              <span class="btn-icon">${UI.icons.edit}</span>
              <span>Edit Records</span>
            </a>
          </div>
        </div>

        ${UI.renderPassportDocument(passport, user)}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
          <a href="#/qr" class="btn btn-outline" data-route="/qr">
            <span class="btn-icon">${UI.icons.qrCode}</span>
            <span>View Scannable QR</span>
          </a>
          <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--text-muted);">
            OPTIMIZED FOR FIRST RESPONDERS & PARALEDICAL TEAMS
          </span>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 8. PASSPORT EDIT
  // ===========================================================================
  renderPassportEdit(user, passport) {
    const p = passport || {};
    return `
      <div class="auth-editorial-viewport" style="max-width: 720px; grid-template-columns: 1fr;">
        <div class="auth-form-pane">
          <span class="story-eyebrow">DOCUMENT MODIFICATION</span>
          <h2 style="font-size: 1.8rem; margin-bottom: 6px;">Edit Medical Information</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 24px;">
            Update your clinical contraindications, blood group, and daily medications.
          </p>

          <form id="editPassportForm" class="auth-form">
            <div class="editorial-field">
              <label class="editorial-label">Blood Group</label>
              <select id="editBloodGroup" class="editorial-input">
                <option value="O+" ${p.bloodGroup === 'O+' ? 'selected' : ''}>O+ (Rh Positive)</option>
                <option value="O-" ${p.bloodGroup === 'O-' ? 'selected' : ''}>O- (Universal Donor)</option>
                <option value="A+" ${p.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                <option value="A-" ${p.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                <option value="B+" ${p.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                <option value="B-" ${p.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                <option value="AB+" ${p.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                <option value="AB-" ${p.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
              </select>
            </div>

            <div class="editorial-field">
              <label class="editorial-label" style="color: var(--emergency);">Critical Drug Allergies (Comma-separated)</label>
              <input type="text" id="editAllergies" class="editorial-input" value="${(p.allergies || []).join(', ')}" />
            </div>

            <div class="editorial-field">
              <label class="editorial-label">Chronic Conditions (Comma-separated)</label>
              <input type="text" id="editConditions" class="editorial-input" value="${(p.conditions || []).join(', ')}" />
            </div>

            <div class="editorial-field">
              <label class="editorial-label">Current Medications</label>
              <input type="text" id="editMedications" class="editorial-input" value="${(p.medications || []).join(', ')}" />
            </div>

            <div class="editorial-field">
              <label class="editorial-label">Clinical Emergency Notes</label>
              <textarea id="editNotes" class="editorial-input" rows="3">${p.emergencyNotes || ''}</textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px;">
              <a href="#/passport" class="btn btn-outline" data-route="/passport">Cancel</a>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 9. EMERGENCY QR PAGE
  // ===========================================================================
  renderQR(user, passport) {
    const p = passport || {};
    const u = user || {};

    return `
      <div class="qr-page-wrap">
        <div class="qr-editorial-card glass-card">
          <span class="story-eyebrow">UNIVERSAL IDENTITY TOKEN</span>
          <h1 style="font-size: 2.2rem; margin-top: 6px;">Emergency Identity QR</h1>
          <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 480px;">
            Scan this code to access verified emergency medical contraindications without requiring an application install or account login.
          </p>

          <!-- QR Code Vector Container with Subtle Scan Line -->
          <div class="qr-display-container" id="largeQrHolder">
            <div class="qr-scan-line"></div>
          </div>

          <div class="qr-meta-block">
            <span style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: var(--gold);">
              PASSPORT ID: ${u.passportId || 'T-1001'}
            </span>
            <span class="editorial-status-pill verified">STATUS: VERIFIED & ACTIVE</span>
          </div>

          <!-- Privacy Sharing Checklist -->
          <div class="privacy-disclosure-box">
            <div class="privacy-head-row">
              <span style="font-family: var(--font-mono); font-size: 0.72rem; font-weight: 700; color: var(--gold);">EMERGENCY ACCESS CONTROLS</span>
              <span class="primary-gold-badge">ACTIVE ON QR</span>
            </div>

            <div class="disclosure-checklist">
              <div class="check-item">
                <span class="icon-inline">${UI.icons.check}</span>
                <span>Blood Group & Rh Factor</span>
              </div>
              <div class="check-item">
                <span class="icon-inline">${UI.icons.check}</span>
                <span>Critical Drug Allergies</span>
              </div>
              <div class="check-item">
                <span class="icon-inline">${UI.icons.check}</span>
                <span>Chronic Conditions</span>
              </div>
              <div class="check-item">
                <span class="icon-inline">${UI.icons.check}</span>
                <span>Emergency Family Contacts</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="qr-actions-row">
            <button class="btn btn-outline" id="regenerateQrBtn">
              <span class="btn-icon">${UI.icons.refresh}</span>
              <span>Regenerate Token</span>
            </button>
            <button class="btn btn-primary" id="downloadQrImageBtn">
              <span class="btn-icon">${UI.icons.download}</span>
              <span>Download / Print QR</span>
            </button>
            <a href="#/passport" class="btn btn-ghost" data-route="/passport">
              <span>Show Passport Document</span>
            </a>
          </div>
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 10. HOSPITALS DIRECTORY & MAP FIRST SPLIT EXPERIENCE
  // ===========================================================================
  renderHospitals(hospitals = []) {
    return `
      <div class="hospitals-split-viewport">
        
        <!-- Left: Hospital Directory & Filtering -->
        <div class="hospitals-directory-col">
          <div class="directory-filter-bar">
            <div>
              <span class="story-eyebrow">REGIONAL TRAUMA NETWORK</span>
              <h2 style="font-size: 1.6rem;">Emergency Hospitals</h2>
              <p style="font-size: 0.84rem; color: var(--text-secondary);">Real-time ICU capacity, specialty departments, and ambulance drive times.</p>
            </div>

            <select id="facilityFilterSelect" class="editorial-input" style="cursor: pointer;">
              <option value="all">All Trauma Facilities</option>
              <option value="ICU">Intensive Care Unit (ICU)</option>
              <option value="Emergency Surgery">Emergency Surgery</option>
              <option value="Stroke Care">Stroke Care Unit</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Burn Unit">Burn Center</option>
            </select>
          </div>

          <div class="directory-scroll-list" id="facilitiesGrid">
            ${hospitals.map(h => UI.renderHospitalCard(h)).join('')}
          </div>
        </div>

        <!-- Right: Real Interactive Leaflet Emergency Map -->
        <div class="hospitals-map-col">
          <div id="facilitiesMapMount"></div>
        </div>

      </div>
    `;
  },

  // ===========================================================================
  // 11. FOCUSED 4-STEP EMERGENCY TRIAGE EXPERIENCE
  // ===========================================================================
  renderTriageExperience(defaultId = 'T-1001') {
    return `
      <div class="triage-workflow-viewport">
        <header style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            <span class="story-eyebrow">EMERGENCY FIRST RESPONDER PROTOCOL</span>
            <h1 style="font-size: 2rem;">Golden Hour Clinical Triage</h1>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Sub-800ms identity decoding & Amazon Bedrock Claude 3 field assessment.</p>
          </div>

          <div style="display: flex; gap: 8px;">
            <input type="text" id="triageSearchInput" class="editorial-input" style="width: 140px; padding: 6px 12px; font-family: var(--font-mono);" value="${defaultId}" />
            <button class="btn btn-sm btn-primary" id="triageExecuteBtn">Decode</button>
          </div>
        </header>

        <!-- Active Triage Workspace Mount -->
        <div id="triageActiveDisplay">
          <!-- Populated by fetchEmergencyTriage -->
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 12. EMERGENCY CONTACTS PAGE
  // ===========================================================================
  renderEmergencyContacts(user, passport) {
    const contacts = passport?.emergencyContacts || [
      { id: 'c-1', name: 'Mark Rostova', relationship: 'Spouse', phone: '+1 (555) 019-2834', isPrimary: true },
      { id: 'c-2', name: 'Dr. Viktor Rostov', relationship: 'Father · Physician', phone: '+1 (555) 018-9921', isPrimary: false }
    ];

    return `
      <div class="qr-page-wrap" style="max-width: 820px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <div>
            <span class="story-eyebrow">FAMILY & NOTIFICATION NETWORK</span>
            <h1 style="font-size: 2rem;">Emergency Contacts</h1>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Direct phone contacts notified during immediate emergency admissions.</p>
          </div>

          <button class="btn btn-primary" id="openAddContactModalBtn">
            <span class="btn-icon">${UI.icons.plus}</span>
            <span>Add Contact</span>
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${contacts.map(c => UI.renderContactCard(c, true)).join('')}
        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 13. USER PROFILE (High-Contrast Editable Rows)
  // ===========================================================================
  renderProfile(user, passport) {
    const u = user || {};
    const p = passport || {};

    return `
      <div class="qr-page-wrap" style="max-width: 820px;">
        <span class="story-eyebrow">IDENTITY & RECORDS</span>
        <h1 style="font-size: 2rem; margin-bottom: 24px;">Personal Clinical Profile</h1>

        <div class="glass-card" style="padding: 28px; display: flex; flex-direction: column; gap: 24px;">
          
          <!-- Identity Row -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--border);">
            <div>
              <span class="story-eyebrow">NAME & IDENTIFIER</span>
              <h3 style="font-size: 1.3rem;">${u.name || 'Elena Rostova'}</h3>
              <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--gold);">${u.passportId || 'T-1001'} • ${u.email}</span>
            </div>
            <a href="#/passport/edit" class="btn btn-sm btn-outline" data-route="/passport/edit">Edit Details</a>
          </div>

          <!-- Clinical Rows -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-secondary);">Blood Group</span>
              <div style="font-family: var(--font-mono); font-size: 1.1rem; font-weight: 700; color: var(--medical);">${p.bloodGroup || 'O+'}</div>
            </div>
            <a href="#/passport/edit" class="btn btn-sm btn-ghost" data-route="/passport/edit">Edit →</a>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
            <div>
              <span style="font-size: 0.8rem; color: var(--emergency);">Critical Drug Allergies</span>
              <div style="font-weight: 600; color: var(--emergency);">${(p.allergies || []).join(', ') || 'None Recorded'}</div>
            </div>
            <a href="#/passport/edit" class="btn btn-sm btn-ghost" data-route="/passport/edit">Edit →</a>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle);">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-secondary);">Chronic Diagnoses</span>
              <div style="font-weight: 600;">${(p.conditions || []).join(', ') || 'None Recorded'}</div>
            </div>
            <a href="#/passport/edit" class="btn btn-sm btn-ghost" data-route="/passport/edit">Edit →</a>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.8rem; color: var(--text-secondary);">Encryption & Compliance</span>
              <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">AWS KMS Envelope 256-Bit • Last Verified: ${p.lastVerified || 'Today'}</div>
            </div>
            <span class="editorial-status-pill verified">VERIFIED</span>
          </div>

        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 14. SETTINGS & PREFERENCES
  // ===========================================================================
  renderSettings(user, passport) {
    return `
      <div class="qr-page-wrap" style="max-width: 820px;">
        <span class="story-eyebrow">PREFERENCES & ACCESS</span>
        <h1 style="font-size: 2rem; margin-bottom: 24px;">Settings</h1>

        <div class="glass-card" style="padding: 28px; display: flex; flex-direction: column; gap: 24px;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 18px; border-bottom: 1px solid var(--border);">
            <div>
              <strong>Visual Atmosphere</strong>
              <p style="font-size: 0.82rem; color: var(--text-secondary);">Switch between Quiet Obsidian and Warm Ivory</p>
            </div>
            <button class="btn btn-sm btn-outline" id="settingsThemeBtn">Tailor Palette</button>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 18px; border-bottom: 1px solid var(--border);">
            <div>
              <strong>Localization (22 Indian Languages + English)</strong>
              <p style="font-size: 0.82rem; color: var(--text-secondary);">Current: ${localStorage.getItem('emergency_lang') || 'en'}</p>
            </div>
            <button class="btn btn-sm btn-outline" id="settingsLangBtn">Change Language</button>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 18px; border-bottom: 1px solid var(--border);">
            <div>
              <strong>Emergency Paramedic Access</strong>
              <p style="font-size: 0.82rem; color: var(--text-secondary);">Zero-login token resolution for first responders</p>
            </div>
            <span class="editorial-status-pill verified">ENABLED</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <strong>Active Session</strong>
              <p style="font-size: 0.82rem; color: var(--text-secondary);">Logged in as ${user?.email || 'elena@rescue.io'}</p>
            </div>
            <button class="btn btn-sm btn-outline" style="color: var(--emergency); border-color: var(--emergency);" id="settingsLogoutBtn">
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </div>
    `;
  },

  // ===========================================================================
  // 15. RESPONDER HUD & HOSPITAL ADMIN COMMAND
  // ===========================================================================
  renderResponderHUD(user) {
    return `
      <div class="triage-workflow-viewport">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <span class="story-eyebrow">FIRST RESPONDER TERMINAL</span>
            <h1 style="font-size: 2rem;">Paramedic Dispatch HUD</h1>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Unit: EMS Battalion 4 • First Responder: <strong>${user?.name || 'Marcus Vance'}</strong></p>
          </div>
          <a href="#/triage" class="btn btn-primary btn-lg" data-route="/triage">
            <span class="btn-icon">${UI.icons.qrCode}</span>
            <span>Scan Emergency QR</span>
          </a>
        </header>

        <h3 style="font-size: 1.1rem; margin-bottom: 16px;">Active Trauma Cases</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="glass-card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-family: var(--font-mono); font-weight: 700; color: var(--gold);">CASE-8841</span>
              <span class="editorial-status-pill" style="color: var(--emergency); border-color: var(--emergency); background: var(--emergency-subtle);">CRITICAL</span>
            </div>
            <h4 style="font-size: 1.1rem;">Elena Rostova (29 y/o, Blood: O+)</h4>
            <div style="font-size: 0.82rem; color: var(--emergency); margin: 8px 0; font-weight: 600;">⛔ ALLERGY: Penicillin, Peanuts</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 16px;">📍 Tokyo Shinjuku Terminal • ETA 6 mins</div>
            <a href="#/triage?id=T-1001" class="btn btn-sm btn-primary">Open Clinical Brief</a>
          </div>

          <div class="glass-card" style="padding: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-family: var(--font-mono); font-weight: 700; color: var(--gold);">CASE-8842</span>
              <span class="editorial-status-pill verified">STABLE</span>
            </div>
            <h4 style="font-size: 1.1rem;">Kenji Sato (34 y/o, Blood: A-)</h4>
            <div style="font-size: 0.82rem; color: var(--emergency); margin: 8px 0; font-weight: 600;">⛔ ALLERGY: Latex, Sulfa Drugs</div>
            <div style="font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 16px;">📍 Roppongi Hills • ETA 11 mins</div>
            <a href="#/triage?id=T-1002" class="btn btn-sm btn-primary">Open Clinical Brief</a>
          </div>
        </div>
      </div>
    `;
  },

  renderHospitalAdmin(user) {
    return `
      <div class="triage-workflow-viewport">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <span class="story-eyebrow">HOSPITAL ADMISSIONS COMMAND</span>
            <h1 style="font-size: 2rem;">City General Trauma Center</h1>
            <p style="font-size: 0.9rem; color: var(--text-secondary);">Chief of Emergency Medicine: <strong>${user?.name || 'Dr. Alistair Chen'}</strong></p>
          </div>
          <button class="btn btn-outline btn-sm">Refresh Inventory</button>
        </header>

        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px;">
          <div class="glass-card" style="padding: 20px;">
            <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted);">ICU CAPACITY</span>
            <div style="font-size: 2rem; font-weight: 800; color: var(--text-primary);">420</div>
            <span style="font-size: 0.8rem; color: var(--medical);">82 Beds Available Now</span>
          </div>

          <div class="glass-card" style="padding: 20px;">
            <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted);">TRAUMA CENTER LEVEL 1</span>
            <div style="font-size: 2rem; font-weight: 800; color: var(--medical);">ONLINE</div>
            <span style="font-size: 0.8rem; color: var(--text-secondary);">2 Surgical Theaters Open</span>
          </div>

          <div class="glass-card" style="padding: 20px;">
            <span style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-muted);">INCOMING AMBULANCES</span>
            <div style="font-size: 2rem; font-weight: 800; color: var(--emergency);">2</div>
            <span style="font-size: 0.8rem; color: var(--emergency);">ETA 6 mins & 11 mins</span>
          </div>
        </div>
      </div>
    `;
  }
};
