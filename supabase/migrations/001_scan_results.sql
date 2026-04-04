-- Scan results table
create table public.scan_results (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz default now(),
  email       text,
  user_id     uuid        references auth.users(id) on delete set null,
  country     text        not null,
  scan_data   jsonb       not null,
  result      jsonb       not null
);

-- Enable RLS
alter table public.scan_results enable row level security;

-- Anyone can insert (free scan, no auth required)
create policy "Public insert"
  on public.scan_results for insert
  with check (true);

-- Reports are readable by UUID (UUID = access token), no login needed
create policy "Public read by id"
  on public.scan_results for select
  using (true);

-- Logged-in users can claim their own reports (match by email → set user_id)
create policy "Users update own reports"
  on public.scan_results for update
  using (auth.jwt() ->> 'email' = email)
  with check (user_id = auth.uid());
