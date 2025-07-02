-- users
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password text not null,
  phone text,
  status text not null default 'free',
  valid_until timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- trackers
create table trackers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  marketplace text not null,
  asin text not null,
  product_url text not null,
  title text,
  image_url text,
  threshold_price numeric,
  cost_price numeric,
  last_checked_price numeric,
  price_history jsonb default '[]',
  sales_rank_history jsonb default '[]',
  buy_box_history jsonb default '[]',
  deals_history jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- trending
create table trending (
  id uuid primary key default gen_random_uuid(),
  asin text not null,
  title text not null,
  image_url text,
  category text,
  bestseller_rank integer,
  price_drop_pct numeric,
  date_tracked timestamptz default now()
);
