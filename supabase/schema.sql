-- ============================================================
-- Zestly Supabase Schema
-- Ausführen im Supabase SQL Editor: https://supabase.com/dashboard
-- ============================================================

-- Profiles (wird bei Registrierung automatisch erstellt)
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  address     text,
  phone       text,
  avatar_url  text,
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Nutzer sieht nur sein eigenes Profil"
  on public.profiles for all using (auth.uid() = id);

-- Automatisch Profil anlegen bei Registrierung
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Orders
create table if not exists public.orders (
  id                 uuid default gen_random_uuid() primary key,
  user_id            uuid references public.profiles(id) on delete cascade not null,
  status             text default 'confirmed'
                     check (status in ('confirmed','preparing','on_the_way','almost_there','delivered')),
  total              numeric(10,2) not null,
  delivery_address   text not null,
  rider_name         text,
  rider_lat          double precision,
  rider_lng          double precision,
  estimated_minutes  int default 12,
  created_at         timestamptz default now()
);
alter table public.orders enable row level security;
create policy "Nutzer sieht nur seine Bestellungen"
  on public.orders for all using (auth.uid() = user_id);

-- Order Items
create table if not exists public.order_items (
  id          uuid default gen_random_uuid() primary key,
  order_id    uuid references public.orders(id) on delete cascade not null,
  item_id     text not null,
  item_name   text not null,
  item_emoji  text not null,
  quantity    int not null,
  price       numeric(10,2) not null
);
alter table public.order_items enable row level security;
create policy "Nutzer sieht Items seiner Bestellungen"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );
create policy "Nutzer kann Items einfügen"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );
