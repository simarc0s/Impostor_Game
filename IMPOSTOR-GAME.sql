create table if not exists public.rooms (
  code text primary key,
  state jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_rooms_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_rooms_updated_at on public.rooms;
create trigger trg_touch_rooms_updated_at
before update on public.rooms
for each row
execute function public.touch_rooms_updated_at();
