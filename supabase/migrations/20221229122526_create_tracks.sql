create table "public"."tracks" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone default now(),
    "mixtape_id" bigint not null,
    "title" text,
    "artist" text,
    "start_at" bigint,
    "duration" bigint,
    "position" integer
);


alter table "public"."tracks" enable row level security;

CREATE UNIQUE INDEX tracks_pkey ON public.tracks USING btree (id);

alter table "public"."tracks" add constraint "tracks_pkey" PRIMARY KEY using index "tracks_pkey";

alter table "public"."tracks" add constraint "tracks_mixtape_id_fkey" FOREIGN KEY (mixtape_id) REFERENCES mixtapes(id) on delete cascade not valid;

alter table "public"."tracks" validate constraint "tracks_mixtape_id_fkey";

create policy "Public tracks are viewable by everyone."
on "public"."tracks"
as permissive
for select
to public
using (true);

create policy "Enable insert for anon."
on "public"."tracks"
as permissive
for insert
to authenticated, anon
with check (true);

create policy "Enable update for anon."
on "public"."tracks"
as permissive
for update
to authenticated, anon
using (true);

create policy "Enable delete for anon."
on "public"."tracks"
as permissive
for delete
to authenticated, anon
using (true);
