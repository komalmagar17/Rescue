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
    name: 'Aarav Sharma',
    email: 'aarav.sharma@rescue.org.in',
    role: ROLES.TRAVELER,
    avatar: 'AS',
    language: 'Hindi, English',
    passportId: 'T-1001',
    verified: true,
    country: 'India',
    dob: '1997-04-12',
    nationality: 'Indian Citizen',
    phone: '+91 98201 44521',
    createdAt: '2026-01-15T10:00:00Z',
    lastVerified: '2026-09-22T08:30:00Z',
  },
  {
    id: 'usr-2001',
    name: 'Paramedic Vikram Rathore',
    email: 'responder@rescue.org.in',
    role: ROLES.RESPONDER,
    avatar: 'VR',
    language: 'Hindi, English',
    badgeNumber: 'EMS-DL-112-42',
    station: 'Delhi EMS Battalion 4 • 108 Dispatch',
    verified: true,
    country: 'India',
    phone: '+91-11-2338-1120',
    createdAt: '2025-11-20T12:00:00Z',
    lastVerified: '2026-09-20T00:00:00Z',
  },
  {
    id: 'usr-3001',
    name: 'Dr. Rajesh K. Malhotra (Apex Trauma Chief)',
    email: 'admin@aiims.edu.in',
    role: ROLES.ADMIN,
    avatar: 'RM',
    language: 'Hindi, English',
    hospitalId: 'H-201',
    hospitalName: 'AIIMS New Delhi — Apex Trauma Centre',
    verified: true,
    country: 'India',
    phone: '+91-11-2659-3677',
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
    medications: ['Albuterol Inhaler (PRN 90mcg)', 'Amlodipine (5mg Daily)'],
    emergencyNotes: 'Carries emergency albuterol inhaler in jacket pocket. Severe anaphylactic reaction to beta-lactam antibiotics (Penicillin).',
    emergencyContacts: [
      { id: 'c-1', name: 'Priya Sharma', relationship: 'Spouse', phone: '+91 98201 44521', isPrimary: true },
      { id: 'c-2', name: 'Vikram Sharma', relationship: 'Father (Retired Col.)', phone: '+91 98110 99214', isPrimary: false },
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
    medications: ['Insulin Glargine (20u QHS)', 'Insulin Lispro (with meals)'],
    emergencyNotes: 'Continuous glucose monitor on upper left arm. Insulin pump on abdomen. If unconscious, administer glucagon or oral glucose.',
    emergencyContacts: [
      { id: 'c-3', name: 'Neha Kulkarni', relationship: 'Sister', phone: '+91 98220 81190', isPrimary: true },
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
    allergies: ['Aspirin', 'Ibuprofen'],
    conditions: ['Cardiac Arrhythmia (SVT)'],
    medications: ['Metoprolol Succinate (50mg Daily)'],
    emergencyNotes: 'History of supraventricular tachycardia episodes under acute stress. Avoid intravenous NSAIDs.',
    emergencyContacts: [
      { id: 'c-4', name: 'Siddharth Iyer', relationship: 'Brother', phone: '+91 94440 23118', isPrimary: true },
      { id: 'c-5', name: 'Dr. K. Swaminathan', relationship: 'Cardiologist', phone: '+91 94441 55667', isPrimary: false },
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
    allergies: ['Iodine Contrast'],
    conditions: ['Type 2 Diabetes', 'Coronary Artery Disease'],
    medications: ['Metformin (500mg BID)', 'Atorvastatin (20mg)'],
    emergencyNotes: 'High susceptibility to heat syncope. Ensure electrolyte hydration and rapid cooling.',
    emergencyContacts: [
      { id: 'c-6', name: 'Devansh Patel', relationship: 'Son', phone: '+91 98765 43210', isPrimary: true },
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
  { id: 'act-1', type: 'verified', title: 'National Health ID Verified', desc: 'Medical records cryptographically verified for emergency dispatch.', time: '2 hours ago', icon: 'shield' },
  { id: 'act-2', type: 'qr', title: 'Emergency QR Accessed', desc: 'Secure read query logged from Delhi EMS 108 Dispatch.', time: 'Yesterday', icon: 'qr' },
  { id: 'act-3', type: 'update', title: 'Emergency Information Updated', desc: 'Added Albuterol prescription dose and emergency note.', time: '3 days ago', icon: 'edit' },
  { id: 'act-4', type: 'hospital', title: 'Hospital Proximity Sync', desc: 'Synced with AIIMS Apex Trauma and regional hospitals.', time: '1 week ago', icon: 'hospital' },
];

// Incoming Emergency Cases for Responder & Hospital Admin
const DEFAULT_EMERGENCY_CASES = [
  {
    id: 'CASE-8841',
    touristId: 'T-1001',
    patientName: 'Aarav Sharma',
    age: 29,
    bloodType: 'O+',
    criticalAllergy: 'Penicillin, Peanuts',
    severity: 'HIGH PRIORITY',
    status: 'EN ROUTE',
    location: 'Connaught Place Central Metro, Gate 2',
    eta: '5 mins',
    assignedHospital: 'AIIMS New Delhi — Apex Trauma Centre',
    timestamp: '10 mins ago',
  },
  {
    id: 'CASE-8842',
    touristId: 'T-1002',
    patientName: 'Rohan Kulkarni',
    age: 34,
    bloodType: 'A-',
    criticalAllergy: 'Latex',
    severity: 'CRITICAL',
    status: 'TRIAGED',
    location: 'Saket City Centre Mall, North Atrium',
    eta: '11 mins',
    assignedHospital: 'Max Super Speciality Saket',
    timestamp: '25 mins ago',
  },
];
