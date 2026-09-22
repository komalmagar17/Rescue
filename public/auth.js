/**
 * Emergency Passport — Authentication & Session Management Service
 * Provides clean auth abstraction, role switching, user profiles,
 * and session state handling.
 */

class AuthService {
  constructor() {
    this._listeners = [];
    this._initSession();
  }

  _initSession() {
    try {
      const storedUser = localStorage.getItem('ep_auth_user');
      if (storedUser) {
        this._currentUser = JSON.parse(storedUser);
      } else {
        // Default to Aarav Sharma (Traveler) for instant evaluator demo
        this._currentUser = Object.assign({}, DEFAULT_USERS[0]);
        this._persistUser();
      }

      // Load user passport
      this._loadPassportForUser();
    } catch (e) {
      console.warn('Auth session init fallback:', e);
      this._currentUser = Object.assign({}, DEFAULT_USERS[0]);
      this._currentPassport = Object.assign({}, DEFAULT_PASSPORTS['T-1001']);
    }
  }

  _loadPassportForUser() {
    if (!this._currentUser || !this._currentUser.passportId) {
      this._currentPassport = null;
      return;
    }

    const pid = this._currentUser.passportId;
    try {
      const storedPassport = localStorage.getItem(`ep_passport_${pid}`);
      if (storedPassport) {
        this._currentPassport = JSON.parse(storedPassport);
      } else if (DEFAULT_PASSPORTS[pid]) {
        this._currentPassport = Object.assign({}, DEFAULT_PASSPORTS[pid]);
        localStorage.setItem(`ep_passport_${pid}`, JSON.stringify(this._currentPassport));
      } else {
        this._currentPassport = {
          passportId: pid,
          userId: this._currentUser.id,
          bloodGroup: 'Unknown',
          allergies: ['None Reported'],
          conditions: ['None Reported'],
          medications: [],
          emergencyNotes: '',
          emergencyContacts: [],
          lastVerified: new Date().toISOString(),
          privacySettings: {
            emergencyAccess: true,
            shareBloodGroup: true,
            shareAllergies: true,
            shareConditions: true,
            shareMedications: true,
            shareContacts: true,
          },
        };
      }
    } catch (e) {
      this._currentPassport = DEFAULT_PASSPORTS['T-1001'] || null;
    }
  }

  _persistUser() {
    if (this._currentUser) {
      localStorage.setItem('ep_auth_user', JSON.stringify(this._currentUser));
    } else {
      localStorage.removeItem('ep_auth_user');
    }
  }

  _persistPassport() {
    if (this._currentPassport && this._currentPassport.passportId) {
      localStorage.setItem(
        `ep_passport_${this._currentPassport.passportId}`,
        JSON.stringify(this._currentPassport)
      );
    }
  }

  _notify() {
    this._listeners.forEach(fn => fn(this._currentUser, this._currentPassport));
  }

  onAuthStateChanged(callback) {
    this._listeners.push(callback);
    callback(this._currentUser, this._currentPassport);
    return () => {
      this._listeners = this._listeners.filter(l => l !== callback);
    };
  }

  isAuthenticated() {
    return Boolean(this._currentUser);
  }

  getUser() {
    return this._currentUser ? Object.assign({}, this._currentUser) : null;
  }

  getPassport() {
    return this._currentPassport ? Object.assign({}, this._currentPassport) : null;
  }

  getRole() {
    return this._currentUser ? this._currentUser.role : null;
  }

  // Auth Operations
  async login(emailOrUsername, password, rememberMe = true) {
    await new Promise(r => setTimeout(r, 450)); // Realistic network latency simulation

    const cleanInput = (emailOrUsername || '').toLowerCase().trim();

    // Check predefined accounts
    let user = DEFAULT_USERS.find(
      u => u.email.toLowerCase() === cleanInput || u.name.toLowerCase() === cleanInput
    );

    if (!user) {
      // Dynamic test user login
      const namePart = emailOrUsername.split('@')[0];
      const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      user = {
        id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
        name: displayName,
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@rescue.io`,
        role: ROLES.TRAVELER,
        avatar: displayName.slice(0, 2).toUpperCase(),
        language: 'English',
        passportId: 'T-1001',
        verified: true,
        country: 'Global Traveler',
        phone: '+1-555-0100',
        createdAt: new Date().toISOString(),
        lastVerified: new Date().toISOString(),
      };
    }

    this._currentUser = Object.assign({}, user);
    this._persistUser();
    this._loadPassportForUser();
    this._notify();
    return this._currentUser;
  }

  async loginWithGoogle() {
    await new Promise(r => setTimeout(r, 500));
    return this.login('aarav@rescue.in', 'google-auth');
  }

  async signup(formData) {
    await new Promise(r => setTimeout(r, 600));

    const nextIdNum = Math.floor(1005 + Math.random() * 500);
    const newPassportId = `T-${nextIdNum}`;
    const initials = (formData.fullName || 'New User')
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const newUser = {
      id: `usr-${nextIdNum}`,
      name: formData.fullName,
      email: formData.email,
      role: ROLES.TRAVELER,
      avatar: initials || 'NU',
      language: formData.language || 'English',
      passportId: newPassportId,
      verified: false,
      country: formData.country || 'Global',
      dob: formData.dob || '2000-01-01',
      phone: formData.phone || '+1-555-0000',
      createdAt: new Date().toISOString(),
      lastVerified: new Date().toISOString(),
    };

    // Initialize blank passport
    const newPassport = {
      passportId: newPassportId,
      userId: newUser.id,
      bloodGroup: 'Unknown',
      allergies: ['None Reported'],
      conditions: ['None Reported'],
      medications: [],
      emergencyNotes: '',
      emergencyContacts: formData.emergencyContact ? [
        { id: 'c-new', name: formData.emergencyContact, relationship: 'Primary Contact', phone: formData.phone || '+1-555-0000', isPrimary: true }
      ] : [],
      lastVerified: new Date().toISOString(),
      privacySettings: {
        emergencyAccess: true,
        shareBloodGroup: true,
        shareAllergies: true,
        shareConditions: true,
        shareMedications: true,
        shareContacts: true,
      },
    };

    this._currentUser = newUser;
    this._currentPassport = newPassport;
    this._persistUser();
    this._persistPassport();
    this._notify();

    return newUser;
  }

  async logout() {
    await new Promise(r => setTimeout(r, 200));
    this._currentUser = null;
    this._currentPassport = null;
    this._persistUser();
    this._notify();
  }

  async forgotPassword(email) {
    await new Promise(r => setTimeout(r, 400));
    return { success: true, message: `Password reset instructions sent to ${email}` };
  }

  async resetPassword(token, newPassword) {
    await new Promise(r => setTimeout(r, 400));
    return { success: true, message: 'Password has been successfully updated.' };
  }

  // Role Switching for Evaluator Convenience
  switchRole(role) {
    if (!this._currentUser) return;
    this._currentUser.role = role;

    if (role === ROLES.RESPONDER) {
      this._currentUser.name = 'Paramedic Vikram Rathore';
      this._currentUser.email = 'responder@rescue.in';
      this._currentUser.avatar = 'VR';
      this._currentUser.badgeNumber = 'DL-EMS-108-442';
    } else if (role === ROLES.ADMIN) {
      this._currentUser.name = 'Dr. Priya Nair (Chief ER)';
      this._currentUser.email = 'admin@aiims.delhi.in';
      this._currentUser.avatar = 'PN';
      this._currentUser.hospitalName = 'AIIMS New Delhi — Apex Trauma Centre';
    } else {
      this._currentUser.name = 'Aarav Sharma';
      this._currentUser.email = 'aarav@rescue.in';
      this._currentUser.avatar = 'AS';
      this._currentUser.passportId = 'T-1001';
      this._loadPassportForUser();
    }

    this._persistUser();
    this._notify();
  }

  // Profile and Passport Updates
  updateProfile(updates) {
    if (!this._currentUser) return;
    Object.assign(this._currentUser, updates);
    this._persistUser();
    this._notify();
    return this._currentUser;
  }

  updatePassport(updates) {
    if (!this._currentPassport) return;
    Object.assign(this._currentPassport, updates, { lastVerified: new Date().toISOString() });
    this._persistPassport();
    this._notify();
    return this._currentPassport;
  }

  updatePrivacy(privacySettings) {
    if (!this._currentPassport) return;
    this._currentPassport.privacySettings = Object.assign({}, this._currentPassport.privacySettings, privacySettings);
    this._persistPassport();
    this._notify();
    return this._currentPassport.privacySettings;
  }

  addEmergencyContact(contact) {
    if (!this._currentPassport) return;
    const newId = `c-${Date.now()}`;
    const fullContact = Object.assign({ id: newId, isPrimary: false }, contact);
    this._currentPassport.emergencyContacts.push(fullContact);
    this._persistPassport();
    this._notify();
    return fullContact;
  }

  deleteEmergencyContact(contactId) {
    if (!this._currentPassport) return;
    this._currentPassport.emergencyContacts = this._currentPassport.emergencyContacts.filter(c => c.id !== contactId);
    this._persistPassport();
    this._notify();
  }

  onboardingComplete(data) {
    if (!this._currentUser || !this._currentPassport) return;

    // Step 1: Identity
    if (data.fullName) this._currentUser.name = data.fullName;
    if (data.nationality) this._currentUser.country = data.nationality;
    if (data.language) this._currentUser.language = data.language;

    // Step 2: Medical
    if (data.bloodGroup) this._currentPassport.bloodGroup = data.bloodGroup;
    if (data.allergies) this._currentPassport.allergies = data.allergies;
    if (data.conditions) this._currentPassport.conditions = data.conditions;
    if (data.medications) this._currentPassport.medications = data.medications;
    if (data.emergencyNotes) this._currentPassport.emergencyNotes = data.emergencyNotes;

    // Step 3: Contacts
    if (data.contacts && Array.isArray(data.contacts)) {
      this._currentPassport.emergencyContacts = data.contacts;
    }

    // Step 4: Privacy
    if (data.privacySettings) {
      this._currentPassport.privacySettings = data.privacySettings;
    }

    this._currentUser.verified = true;
    this._currentPassport.lastVerified = new Date().toISOString();

    this._persistUser();
    this._persistPassport();
    this._notify();
  }
}

const authService = new AuthService();
