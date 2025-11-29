-- Multi-tenant contract review schema
create table if not exists tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text generated always as (lower(regexp_replace(name, '\\s+', '-', 'g'))) stored,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  full_name text,
  role text default 'member',
  created_at timestamptz not null default now()
);
create index if not exists profiles_tenant_idx on profiles (tenant_id);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  owner_id uuid not null references profiles(id) on delete cascade,
  filename text not null,
  storage_path text not null,
  status text not null default 'pending',
  mime_type text,
  page_count int,
  uploaded_at timestamptz not null default now(),
  last_processed_at timestamptz
);
create index if not exists documents_tenant_idx on documents (tenant_id, uploaded_at desc);
create index if not exists documents_status_idx on documents (status);

create table if not exists analysis (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  tenant_id uuid not null references tenants(id) on delete cascade,
  summary jsonb,
  clauses jsonb,
  overlays jsonb,
  risk_rating text,
  created_at timestamptz not null default now()
);
create index if not exists analysis_document_idx on analysis (document_id);
create index if not exists analysis_tenant_idx on analysis (tenant_id, created_at desc);

-- Row Level Security
alter table tenants enable row level security;
alter table profiles enable row level security;
alter table documents enable row level security;
alter table analysis enable row level security;

-- Helper function to extract tenant from JWT
create or replace function public.current_tenant_id()
returns uuid as $$
begin
  return (auth.jwt() ->> 'tenant_id')::uuid;
end;
$$ language plpgsql stable;

-- Policies
create policy "Tenants are isolated" on tenants
  for select using (id = public.current_tenant_id());

create policy "Profiles limited to tenant" on profiles
  using (tenant_id = public.current_tenant_id());

create policy "Insert profiles for own tenant" on profiles
  for insert with check (tenant_id = public.current_tenant_id());

create policy "Documents limited to tenant" on documents
  using (tenant_id = public.current_tenant_id());

create policy "Insert documents for tenant" on documents
  for insert with check (tenant_id = public.current_tenant_id());

create policy "Analysis limited to tenant" on analysis
  using (tenant_id = public.current_tenant_id());

create policy "Insert analysis for tenant" on analysis
  for insert with check (tenant_id = public.current_tenant_id());

-- Edge function helper role
create role if not exists edge_executor noinherit;

grant usage on schema public to edge_executor;
grant select, insert, update on tenants, profiles, documents, analysis to edge_executor;
