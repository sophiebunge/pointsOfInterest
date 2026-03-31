-- Exhibition App — Supabase Schema
-- Run this in the Supabase SQL Editor to set up your database

CREATE TABLE sessions (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamp default now(),
  ended_at timestamp
);

CREATE TABLE artworks (
  id uuid primary key default gen_random_uuid(),
  nfc_code text unique,
  title text,
  artist text,
  description text,
  image_url text
);

CREATE TABLE scans (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id),
  artwork_id uuid references artworks(id),
  scanned_at timestamp default now()
);
