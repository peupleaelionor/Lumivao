-- ============================================================
-- LUMIVAO — schéma PostgreSQL pour Supabase
-- À exécuter dans Supabase → SQL Editor.
-- RLS activé : structure prête pour l'auth Supabase.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── businesses ──────────────────────────────────────────────
create table if not exists businesses (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid references auth.users (id) on delete cascade,
  name          text not null,
  slug          text unique not null,
  type          text not null,
  logo_url      text,
  phone         text,
  whatsapp      text,
  address       text,
  city          text,
  country       text,
  colors        jsonb,
  opening_hours text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ── products ────────────────────────────────────────────────
create table if not exists products (
  id             uuid primary key default uuid_generate_v4(),
  business_id    uuid not null references businesses (id) on delete cascade,
  name           text not null,
  description    text,
  category       text,
  price          numeric(10,2),
  old_price      numeric(10,2),
  image_url      text,
  active         boolean default true,
  stock_quantity integer,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);
create index if not exists products_business_idx on products (business_id);

-- ── offers ──────────────────────────────────────────────────
create table if not exists offers (
  id          uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses (id) on delete cascade,
  product_id  uuid references products (id) on delete set null,
  title       text not null,
  description text,
  old_price   numeric(10,2),
  new_price   numeric(10,2),
  goal        text,
  channel     text,
  status      text default 'draft',
  starts_at   timestamptz,
  ends_at     timestamptz,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists offers_business_idx on offers (business_id);

-- ── campaign_assets ─────────────────────────────────────────
create table if not exists campaign_assets (
  id         uuid primary key default uuid_generate_v4(),
  offer_id   uuid not null references offers (id) on delete cascade,
  type       text not null,
  format     text,
  content    text,
  image_url  text,
  qr_url     text,
  created_at timestamptz default now()
);
create index if not exists assets_offer_idx on campaign_assets (offer_id);

-- ── customers ───────────────────────────────────────────────
create table if not exists customers (
  id            uuid primary key default uuid_generate_v4(),
  business_id   uuid not null references businesses (id) on delete cascade,
  name          text not null,
  phone         text,
  points        integer default 0,
  last_visit_at timestamptz,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);
create index if not exists customers_business_idx on customers (business_id);

-- ── loyalty_rules ───────────────────────────────────────────
create table if not exists loyalty_rules (
  id          uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses (id) on delete cascade,
  rule_type   text not null,
  threshold   integer not null,
  reward      text not null,
  active      boolean default true,
  created_at  timestamptz default now()
);

-- ── qr_events / analytics_events ────────────────────────────
create table if not exists qr_events (
  id          uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses (id) on delete cascade,
  offer_id    uuid references offers (id) on delete set null,
  type        text not null,
  user_agent  text,
  ip_hash     text,
  created_at  timestamptz default now()
);

create table if not exists analytics_events (
  id          uuid primary key default uuid_generate_v4(),
  business_id uuid not null references businesses (id) on delete cascade,
  offer_id    uuid references offers (id) on delete set null,
  event_type  text not null,
  metadata    jsonb,
  created_at  timestamptz default now()
);

-- ============================================================
-- RLS — Row Level Security
-- ============================================================
alter table businesses     enable row level security;
alter table products       enable row level security;
alter table offers         enable row level security;
alter table campaign_assets enable row level security;
alter table customers      enable row level security;
alter table loyalty_rules  enable row level security;

-- Le propriétaire gère son commerce.
create policy "owner manages business" on businesses
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Helper : un enregistrement appartient à un commerce de l'utilisateur.
create policy "owner manages products" on products
  for all using (exists (select 1 from businesses b where b.id = products.business_id and b.owner_id = auth.uid()));
create policy "owner manages offers" on offers
  for all using (exists (select 1 from businesses b where b.id = offers.business_id and b.owner_id = auth.uid()));
create policy "owner manages customers" on customers
  for all using (exists (select 1 from businesses b where b.id = customers.business_id and b.owner_id = auth.uid()));
create policy "owner manages loyalty" on loyalty_rules
  for all using (exists (select 1 from businesses b where b.id = loyalty_rules.business_id and b.owner_id = auth.uid()));

-- Lecture PUBLIQUE limitée (mini-vitrine) : offres publiées + produits actifs.
create policy "public reads published offers" on offers
  for select using (status = 'published');
create policy "public reads active products" on products
  for select using (active = true);
create policy "public reads businesses" on businesses
  for select using (true);
