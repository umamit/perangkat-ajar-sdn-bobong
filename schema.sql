-- Skema Database Supabase untuk Perangkat Ajar SD Negeri Bobong
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run

-- 1. Tabel Kelas (Classes)
CREATE TABLE IF NOT EXISTS public.classes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    room TEXT,
    phase TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Data Kelas SD Negeri Bobong
INSERT INTO public.classes (id, name, count, room, phase) VALUES
('1A', 'Kelas 1 - A', 24, 'Ruang 01', 'Fase A'),
('2A', 'Kelas 2 - A', 22, 'Ruang 02', 'Fase A'),
('3A', 'Kelas 3 - A', 25, 'Ruang 03', 'Fase B'),
('4A', 'Kelas 4 - A', 26, 'Ruang 04', 'Fase B'),
('5A', 'Kelas 5 - A', 28, 'Ruang 05', 'Fase C'),
('6A', 'Kelas 6 - A', 25, 'Ruang 06', 'Fase C')
ON CONFLICT (id) DO NOTHING;

-- 2. Tabel Siswa (Students)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nis TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    class_id TEXT REFERENCES public.classes(id) ON DELETE SET NULL,
    gender TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Data Siswa
INSERT INTO public.students (nis, name, class_id, gender) VALUES
('20250101', 'Ahmad Dani', '4A', 'L'),
('20250102', 'Anisa Rahma', '4A', 'P'),
('20250103', 'Budi Santoso', '4A', 'L'),
('20250104', 'Citra Kirana', '4A', 'P'),
('20250105', 'Doni Pratama', '4A', 'L'),
('20250106', 'Eka Putri', '1A', 'P'),
('20250107', 'Fajar Nugraha', '1A', 'L'),
('20250108', 'Gita Gutawa', '5A', 'P')
ON CONFLICT (nis) DO NOTHING;

-- 3. Tabel Absensi (Attendance)
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    class_id TEXT REFERENCES public.classes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Hadir', 'Izin', 'Sakit', 'Alpa')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_attendance_per_day UNIQUE (student_id, date)
);

-- 4. Tabel Daftar Nilai (Grades)
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    class_id TEXT REFERENCES public.classes(id),
    subject TEXT DEFAULT 'Bahasa Inggris',
    type TEXT CHECK (type IN ('Formatif', 'Sumatif')),
    score NUMERIC CHECK (score >= 0 AND score <= 100),
    topic TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Jurnal Mengajar (Journals)
CREATE TABLE IF NOT EXISTS public.journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    time_slot TEXT,
    class_id TEXT REFERENCES public.classes(id),
    topic TEXT NOT NULL,
    notes TEXT,
    attendance_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Modul Ajar (Modules)
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    phase TEXT NOT NULL,
    class_id TEXT,
    tp TEXT,
    atp TEXT,
    duration TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security (RLS) & Kebijakan Akses Publik Read/Write
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow public read/write students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow public read/write attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow public read/write grades" ON public.grades FOR ALL USING (true);
CREATE POLICY "Allow public read/write journals" ON public.journals FOR ALL USING (true);
CREATE POLICY "Allow public read/write modules" ON public.modules FOR ALL USING (true);
