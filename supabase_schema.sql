-- ==============================================================================
-- Emergency Passport — Supabase PostgreSQL Schema & Seed Migration
-- ==============================================================================
-- HOW TO USE WITH ZERO EFFORT:
-- 1. Create a free project at https://supabase.com
-- 2. Open the SQL Editor in your Supabase dashboard
-- 3. Paste and run this entire file
-- 4. Copy your Project URL and anon/service_role API Key into your environment:
--    export SUPABASE_URL="https://your-project.supabase.co"
--    export SUPABASE_KEY="your-anon-or-service-role-key"
-- ==============================================================================

-- Enable UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Table: tourist_profiles
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tourist_profiles (
    tourist_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    blood_type VARCHAR(10) NOT NULL,
    conditions TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    emergency_contacts TEXT[] DEFAULT '{}',
    language VARCHAR(100) DEFAULT 'English',
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by blood type and ID
CREATE INDEX IF NOT EXISTS idx_tourists_blood_type ON tourist_profiles(blood_type);

-- ------------------------------------------------------------------------------
-- 2. Table: hospitals
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hospitals (
    hospital_id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    services TEXT[] DEFAULT '{}',
    contact_info VARCHAR(255) NOT NULL,
    capacity INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Index for hospital searches
CREATE INDEX IF NOT EXISTS idx_hospitals_capacity ON hospitals(capacity DESC);

-- ------------------------------------------------------------------------------
-- 3. Row Level Security (RLS)
-- First responders need instant read access during life-or-death emergencies.
-- ------------------------------------------------------------------------------
ALTER TABLE tourist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for rapid QR scan by paramedics)
CREATE POLICY "Public read for tourist profiles"
    ON tourist_profiles FOR SELECT
    USING (true);

CREATE POLICY "Public read for hospitals"
    ON hospitals FOR SELECT
    USING (true);

-- Allow authenticated and service role full access
CREATE POLICY "Service and auth insert for tourist profiles"
    ON tourist_profiles FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Service and auth update for tourist profiles"
    ON tourist_profiles FOR UPDATE
    USING (true);

CREATE POLICY "Service and auth delete for tourist profiles"
    ON tourist_profiles FOR DELETE
    USING (true);

CREATE POLICY "Service and auth all for hospitals"
    ON hospitals FOR ALL
    USING (true);

-- ------------------------------------------------------------------------------
-- 4. Initial Seed Data
-- ------------------------------------------------------------------------------
INSERT INTO tourist_profiles (tourist_id, name, age, blood_type, conditions, allergies, emergency_contacts, language, notes)
VALUES
    (
        'T-1001',
        'Elena Rostova',
        29,
        'O+',
        ARRAY['Asthma', 'Mild Hypertension'],
        ARRAY['Penicillin', 'Peanuts'],
        ARRAY['+1-555-0199 (Spouse - Mark)', '+1-555-0123 (Father - Viktor)'],
        'English, Russian',
        'Carries emergency albuterol inhaler.'
    ),
    (
        'T-1002',
        'Kenji Sato',
        34,
        'A-',
        ARRAY['Type 1 Diabetes'],
        ARRAY['Latex', 'Sulfa Drugs'],
        ARRAY['+81-90-1234-5678 (Sister - Yuko)'],
        'Japanese, English',
        'Carries insulin pump on left abdominal quadrant.'
    ),
    (
        'T-1003',
        'Maria Gonzalez',
        42,
        'B+',
        ARRAY['Cardiac Arrhythmia'],
        ARRAY['Aspirin'],
        ARRAY['+34-600-112233 (Partner - Carlos)', '+34-600-445566 (Dr. Morales)'],
        'Spanish, English',
        'History of supraventricular tachycardia.'
    ),
    (
        'T-1004',
        'Arjun Patel',
        67,
        'O-',
        ARRAY['Type 2 Diabetes', 'History of Heatstroke'],
        ARRAY['None Reported'],
        ARRAY['+91-98765-43210 (Son - Rohan)'],
        'Hindi, English',
        'Sensitive to high heat. Check electrolyte balance.'
    )
ON CONFLICT (tourist_id) DO UPDATE SET
    name = EXCLUDED.name,
    age = EXCLUDED.age,
    blood_type = EXCLUDED.blood_type,
    conditions = EXCLUDED.conditions,
    allergies = EXCLUDED.allergies,
    emergency_contacts = EXCLUDED.emergency_contacts,
    language = EXCLUDED.language,
    notes = EXCLUDED.notes,
    last_updated = NOW();

INSERT INTO hospitals (hospital_id, name, latitude, longitude, services, contact_info, capacity)
VALUES
    (
        'H-201',
        'City General ICU & Cardiology Center',
        26.8500,
        80.9500,
        ARRAY['ICU', 'Cardiology', 'Emergency Surgery', 'Stroke Care'],
        '+91-522-234-5000 (ER Hotline)',
        420
    ),
    (
        'H-202',
        'Riverside Trauma & Orthopedic Hospital',
        26.7800,
        80.9200,
        ARRAY['Trauma Center Level 1', 'Orthopedics', 'Emergency Surgery', 'Air Ambulance'],
        '+91-522-234-6000 (Trauma Desk)',
        280
    ),
    (
        'H-203',
        'Community Primary Care Clinic',
        26.8200,
        80.8800,
        ARRAY['General ER', 'Basic First Aid'],
        '+91-522-234-7000',
        60
    ),
    (
        'H-204',
        'Alpine High-Altitude & Hyperbaric Center',
        26.9000,
        80.9800,
        ARRAY['Hyperbaric Medicine', 'ICU', 'Orthopedics', 'Air Ambulance'],
        '+91-522-234-8000 (Helipad)',
        150
    )
ON CONFLICT (hospital_id) DO UPDATE SET
    name = EXCLUDED.name,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    services = EXCLUDED.services,
    contact_info = EXCLUDED.contact_info,
    capacity = EXCLUDED.capacity,
    last_updated = NOW();
