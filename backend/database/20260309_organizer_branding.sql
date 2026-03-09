-- Add brandColor to organizers table
alter table public.organizers 
add column if not exists "brandColor" varchar(20) default '#38BDF2';
