-- Runs on every server start; safe to re-run (creates only what is missing).

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT NOT NULL,
    isadmin BOOLEAN NOT NULL DEFAULT FALSE,
    isvoted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS votings (
    id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL UNIQUE REFERENCES users (email),
    candidate TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS voting_controls (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    is_voting_result_live BOOLEAN NOT NULL DEFAULT FALSE,
    is_voting_on BOOLEAN NOT NULL DEFAULT TRUE,
    winner_candidate TEXT NOT NULL DEFAULT ''
);
