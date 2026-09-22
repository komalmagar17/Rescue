/**
 * Emergency Passport — Core Data Models & Centralized Store
 * Defines interfaces and default records for Users, MedicalPassports,
 * EmergencyContacts, Hospitals, and EmergencyCases.
 */

// User Roles
const ROLES = {
  TRAVELER: 'traveler',
  RESPONDER: 'responder',
  ADMIN: 'hospital_admin',
};

// Default Demo Users
const DEFAULT_USERS = [
  {
    id: 'usr-1001',
    name: 'Elena Rostova',
    email: 'elena@rescue.io',
    role: ROLES.TRAVELER,
    avatar: 'ER',
    language: 'English, Russian',
    passportId: 'T-1001',
    verified: true,
    country: 'United States / Russia',
    dob: '1997-04-12',
    nationality: 'Russian / US Resident',
    phone: '+1-555-0199',
    createdAt: '2026-01-15T10:00:00Z',
    lastVerified: '2026-09-22T08:30:00Z',
  },
  {
    id: 'usr-2001',
    name: 'Paramedic Marcus Vance',
    email: 'responder@rescue.io',
    role: ROLES.RESPONDER,
    avatar: 'MV',
    language: 'English, Spanish',
    badgeNumber: 'EMS-NY-8842',
    station: 'Central EMS Battalion 4',
    verified: true,
    country: 'United States',
    phone: '+1-555-9110',
    createdAt: '2025-11-20T12:00:00Z',
    lastVerified: '2026-09-20T00:00:00Z',
  },
  {
    id: 'usr-3001',
    name: 'Dr. Alistair Chen (Chief ER)',
    email: 'admin@hospital.org',
    role: ROLES.ADMIN,
    avatar: 'AC',
    language: 'English',
    hospitalId: 'H-201',
    hospitalName: 'City General ICU & Cardiology Center',
    verified: true,
    country: 'United States',
    phone: '+1-555-4321',
    createdAt: '2025-08-10T14:00:00Z',
    lastVerified: '2026-09-22T06:00:00Z',
  },
];

// Default Medical Passports (keyed by passportId)
const DEFAULT_PASSPORTS = {
  'T-1001': {
    passportId: 'T-1001',
    userId: 'usr-1001',
    bloodGroup: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Asthma', 'Mild Hypertension'],
    medications: ['Albuterol Inhaler (PRN 90mcg)', 'Lisinopril (10mg Daily)'],
    emergencyNotes: 'Carries emergency albuterol inhaler in right outer coat pocket. Severe anaphylactic reaction to beta-lactam antibiotics.',
    emergencyContacts: [
      { id: 'c-1', name: 'Mark Rostova', relationship: 'Spouse', phone: '+1-555-0199', isPrimary: true },
      { id: 'c-2', name: 'Dr. Viktor Rostov', relationship: 'Father (Physician)', phone: '+1-555-0123', isPrimary: false },
    ],
    lastVerified: '2026-09-22T08:30:00Z',
    privacySettings: {
      emergencyAccess: true,
      shareBloodGroup: true,
      shareAllergies: true,
      shareConditions: true,
      shareMedications: true,
      shareContacts: true,
    },
  },
  'T-1002': {
    passportId: 'T-1002',
    userId: 'usr-1002',
    bloodGroup: 'A-',
    allergies: ['Latex', 'Sulfa Drugs'],
    conditions: ['Type 1 Diabetes'],
    medications: ['Insulin Glargine (20u QHS)', 'Insulin Lispro (Sliding scale with meals)'],
    emergencyNotes: 'Continuous glucose monitor (Dexcom G7) on upper left arm. Insulin pump on abdomen. If unconscious, administer glucagon immediately.',
    emergencyContacts: [
      { id: 'c-3', name: 'Yuko Sato', relationship: 'Sister', phone: '+81-90-1234-5678', isPrimary: true },
    ],
    lastVerified: '2026-09-21T14:15:00Z',
    privacySettings: {
      emergencyAccess: true,
      shareBloodGroup: true,
      shareAllergies: true,
      shareConditions: true,
      shareMedications: true,
      shareContacts: true,
    },
  },
  'T-1003': {
    passportId: 'T-1003',
    userId: 'usr-1003',
    bloodGroup: 'B+',
    allergies: ['Aspirin', 'NSAIDs'],
    conditions: ['Cardiac Arrhythmia (SVT)'],
    medications: ['Metoprolol Succinate (50mg Daily)'],
    emergencyNotes: 'History of supraventricular tachycardia episodes under severe altitude stress. Avoid intravenous aspirin.',
    emergencyContacts: [
      { id: 'c-4', name: 'Carlos Morales', relationship: 'Partner', phone: '+34-600-112233', isPrimary: true },
      { id: 'c-5', name: 'Dr. Morales', relationship: 'Cardiologist', phone: '+34-600-445566', isPrimary: false },
    ],
    lastVerified: '2026-09-20T11:00:00Z',
    privacySettings: {
      emergencyAccess: true,
      shareBloodGroup: true,
      shareAllergies: true,
      shareConditions: true,
      shareMedications: true,
      shareContacts: true,
    },
  },
  'T-1004': {
    passportId: 'T-1004',
    userId: 'usr-1004',
    bloodGroup: 'O-',
    allergies: ['None Reported'],
    conditions: ['Type 2 Diabetes', 'History of Heatstroke'],
    medications: ['Metformin (500mg BID)'],
    emergencyNotes: 'High susceptibility to heat syncope. Ensure electrolyte hydration and rapid cooling.',
    emergencyContacts: [
      { id: 'c-6', name: 'Rohan Patel', relationship: 'Son', phone: '+91-98765-43210', isPrimary: true },
    ],
    lastVerified: '2026-09-19T09:40:00Z',
    privacySettings: {
      emergencyAccess: true,
      shareBloodGroup: true,
      shareAllergies: true,
      shareConditions: true,
      shareMedications: true,
      shareContacts: true,
    },
  },
};

// Recent Activity Feed Items
const DEFAULT_ACTIVITIES = [
  { id: 'act-1', type: 'verified', title: 'Passport Verified', desc: 'Medical records cryptographically verified for international travel.', time: '2 hours ago', icon: 'shield' },
  { id: 'act-2', type: 'qr', title: 'Emergency QR Accessed', desc: 'Secure read query logged from Tokyo EMS Dispatch.', time: 'Yesterday', icon: 'qr' },
  { id: 'act-3', type: 'update', title: 'Emergency Information Updated', desc: 'Added Albuterol prescription dose and emergency note.', time: '3 days ago', icon: 'edit' },
  { id: 'act-4', type: 'hospital', title: 'Hospital Proximity Sync', desc: 'Synced with regional emergency trauma facilities.', time: '1 week ago', icon: 'hospital' },
];

// Incoming Emergency Cases for Responder & Hospital Admin
const DEFAULT_EMERGENCY_CASES = [
  {
    id: 'CASE-8841',
    touristId: 'T-1001',
    patientName: 'Elena Rostova',
    age: 29,
    bloodType: 'O+',
    criticalAllergy: 'Penicillin, Peanuts',
    severity: 'HIGH PRIORITY',
    status: 'EN ROUTE',
    location: 'Central Metro Station, Platform 3',
    eta: '6 mins',
    assignedHospital: 'City General ICU & Cardiology Center',
    timestamp: '10 mins ago',
  },
  {
    id: 'CASE-8842',
    touristId: 'T-1002',
    patientName: 'Kenji Sato',
    age: 34,
    bloodType: 'A-',
    criticalAllergy: 'Latex',
    severity: 'CRITICAL',
    status: 'TRIAGED',
    location: 'Alpine Convention Hall West Gate',
    eta: '12 mins',
    assignedHospital: 'Riverside Trauma & Orthopedic Hospital',
    timestamp: '25 mins ago',
  },
];
