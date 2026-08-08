-- Jalankan SQL ini di Supabase SQL Editor (https://supabase.com → SQL Editor)
-- Untuk membuat tabel jadwal pelajaran

CREATE TABLE IF NOT EXISTS public.schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  day TEXT NOT NULL,
  time_start TEXT NOT NULL,
  time_end TEXT NOT NULL,
  class_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  teacher_nip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow all access to schedules"
  ON public.schedules FOR ALL
  USING (true)
  WITH CHECK (true);
