-- Run this in the Supabase SQL Editor to add test artworks

INSERT INTO artworks (nfc_code, title, artist, description) VALUES
  ('artwork-01', 'Untitled No. 3', 'Anna Müller', 'A meditation on absence and space, rendered in charcoal and raw pigment.'),
  ('artwork-02', 'Threshold', 'Jonas Weber', 'Steel and glass installation exploring boundaries between interior and exterior states.'),
  ('artwork-03', 'Field Study I', 'Maria Kovač', 'Photographic series documenting peripheral urban landscapes at dawn.'),
  ('artwork-04', 'Residue', 'Lena Brandt', 'Cast resin objects embedded with personal artifacts — a taxonomy of loss.'),
  ('artwork-05', 'Exit Interview', 'David Park', 'Two-channel video work. Duration 14:30. Headphones required.');

-- To verify:
SELECT * FROM artworks;
