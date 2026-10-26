-- CrowdCall test seed: fake events and check-ins for the proof tests.
-- Paste into the Supabase SQL Editor and run. Safe to re-run: it resets
-- these five events (and their check-ins) every time.

delete from public.events where id in (
  '00000000-0000-4000-8000-00000000000a',
  '00000000-0000-4000-8000-00000000000b',
  '00000000-0000-4000-8000-00000000000c',
  '00000000-0000-4000-8000-0000000000ed',
  '00000000-0000-4000-8000-0000000000de'
);  -- cascade removes their old check-ins

insert into public.events (id, name, place, starts_at) values
  ('00000000-0000-4000-8000-00000000000a', 'Seed A',         'Archbold Gym',     '2026-11-14 19:30:00-05'),
  ('00000000-0000-4000-8000-00000000000b', 'Seed B',         'Schine Center',    '2026-11-15 12:00:00-05'),
  ('00000000-0000-4000-8000-00000000000c', 'Seed C',         'Quad',             '2026-11-16 17:00:00-05'),
  ('00000000-0000-4000-8000-0000000000ed', 'Seed Edit Me',   'Bird Library',     '2026-11-20 18:00:00-05'),
  ('00000000-0000-4000-8000-0000000000de', 'Seed Delete Me', 'Hendricks Chapel', '2026-11-21 20:00:00-05');

-- Fake check-ins: A=5, B=2, C=9, Edit Me=3, Delete Me=4
insert into public.check_ins (event_id)
select '00000000-0000-4000-8000-00000000000a'::uuid from generate_series(1, 5)
union all
select '00000000-0000-4000-8000-00000000000b'::uuid from generate_series(1, 2)
union all
select '00000000-0000-4000-8000-00000000000c'::uuid from generate_series(1, 9)
union all
select '00000000-0000-4000-8000-0000000000ed'::uuid from generate_series(1, 3)
union all
select '00000000-0000-4000-8000-0000000000de'::uuid from generate_series(1, 4);
