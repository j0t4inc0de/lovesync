-- Create Couples Table
CREATE TABLE IF NOT EXISTS couples (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    slots INT DEFAULT 10,
    permanent_slots INT DEFAULT 0,
    unclaimed_streak_rewards INT DEFAULT 0,
    last_rewarded_streak INT DEFAULT 0
);

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    couple_id INT REFERENCES couples(id) ON DELETE SET NULL,
    last_trivia_date DATE,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migration for existing users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_trivia_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Ensure the first registered user is an admin for testing/management
UPDATE users SET is_admin = TRUE WHERE id = 1;

-- Create Dates Table
CREATE TABLE IF NOT EXISTS dates (
    id SERIAL PRIMARY KEY,
    couple_id INT NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    location VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    rating_user_1 NUMERIC(3,1) DEFAULT 5.0,
    rating_user_2 NUMERIC(3,1) DEFAULT 5.0,
    photo_url TEXT,
    tags TEXT[],
    reports_count INT DEFAULT 0,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Date Likes Table
CREATE TABLE IF NOT EXISTS date_likes (
    id SERIAL PRIMARY KEY,
    date_id INT NOT NULL REFERENCES dates(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_date_user_like UNIQUE(date_id, user_id)
);

-- Create Couple Extra Slots Table
CREATE TABLE IF NOT EXISTS couple_extra_slots (
    id SERIAL PRIMARY KEY,
    couple_id INT NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    amount INT NOT NULL,
    year INT NOT NULL,
    month INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Daily Trivia Answers Table
CREATE TABLE IF NOT EXISTS daily_trivia_answers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    couple_id INT NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    correct BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_daily_trivia UNIQUE(user_id, date)
);

-- Migration for existing couples table (unpair request system)
ALTER TABLE couples ADD COLUMN IF NOT EXISTS unpair_requested_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
ALTER TABLE couples ADD COLUMN IF NOT EXISTS unpair_requested_by INT REFERENCES users(id) ON DELETE SET NULL DEFAULT NULL;

-- Create Processed Payments Table for Webhook deduplication
CREATE TABLE IF NOT EXISTS processed_payments (
    payment_id VARCHAR(255) PRIMARY KEY,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migrations for existing couples table (Love Streaks system)
ALTER TABLE couples ADD COLUMN IF NOT EXISTS streak_count INT DEFAULT 0;
ALTER TABLE couples ADD COLUMN IF NOT EXISTS last_streak_date DATE DEFAULT NULL;
ALTER TABLE couples ADD COLUMN IF NOT EXISTS previous_streak INT DEFAULT 0;
