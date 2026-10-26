-- CrowdCall: events and check-ins (MVP, no login)
-- Paste this whole file into the Supabase SQL Editor and run it once.

create table public.events (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (length(trim(name)) > 0),
  place      text not null check (length(trim(place)) > 0),
  starts_at  timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.check_ins (
  id         uuid primary key default gen_random_uuid(),
  -- Deleting an event deletes all of its check-ins.
  event_id   uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index check_ins_event_id_idx on public.check_ins(event_id);

-- The crowd count is never stored. It is counted from check_ins on every read.
-- security_invoker makes the view obey the RLS policies of whoever is reading.
create view public.events_with_counts
with (security_invoker = true) as
select
  e.id,
  e.name,
  e.place,
  e.starts_at,
  e.created_at,
  count(c.id)::int as crowd_count
from public.events e
left join public.check_ins c on c.event_id = e.id
group by e.id;

-- Row Level Security.
-- There is no login yet, so these policies are OPEN to anyone with the app's
-- public (anon) key. Replace them with host-only rules once login exists.
alter table public.events    enable row level security;
alter table public.check_ins enable row level security;

create policy "anyone can read events"   on public.events for select to anon using (true);
create policy "anyone can create events" on public.events for insert to anon with check (true);  -- LOGIN WISH: spam
create policy "anyone can edit events"   on public.events for update to anon using (true) with check (true);  -- LOGIN WISH: only the host should edit
create policy "anyone can delete events" on public.events for delete to anon using (true);  -- LOGIN WISH: only the host should delete

-- check_ins: read-only from the app (needed to count). No insert/update/delete
-- policies, so the app cannot write check-ins. Rows added by hand in the
-- dashboard or SQL Editor bypass RLS.
create policy "anyone can read check-ins" on public.check_ins for select to anon using (true);

grant select on public.events_with_counts to anon;
