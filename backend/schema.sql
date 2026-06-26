-- Create Couples Table
CREATE TABLE IF NOT EXISTS couples (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    slots INT DEFAULT 10
);

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    invite_code VARCHAR(20) UNIQUE NOT NULL,
    couple_id INT REFERENCES couples(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
