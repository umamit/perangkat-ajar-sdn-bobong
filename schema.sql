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
('1B', 'Kelas 1 - B', 24, 'Ruang 01B', 'Fase A'),
('2A', 'Kelas 2 - A', 22, 'Ruang 02', 'Fase A'),
('2B', 'Kelas 2 - B', 22, 'Ruang 02B', 'Fase A'),
('3A', 'Kelas 3 - A', 25, 'Ruang 03', 'Fase B'),
('3B', 'Kelas 3 - B', 25, 'Ruang 03B', 'Fase B'),
('4A', 'Kelas 4 - A', 26, 'Ruang 04', 'Fase B'),
('4B', 'Kelas 4 - B', 26, 'Ruang 04B', 'Fase B'),
('5A', 'Kelas 5 - A', 28, 'Ruang 05', 'Fase C'),
('5B', 'Kelas 5 - B', 28, 'Ruang 05B', 'Fase C'),
('6A', 'Kelas 6 - A', 25, 'Ruang 06', 'Fase C'),
('6B', 'Kelas 6 - B', 25, 'Ruang 06B', 'Fase C')
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
    type TEXT CHECK (type IN ('Formatif', 'Sumatif', 'STS', 'SAS')),
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
    teacher_nip TEXT REFERENCES public.teachers(nip) ON DELETE SET NULL,
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
    teacher_nip TEXT REFERENCES public.teachers(nip) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabel Guru (Teachers)
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nip TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Guru Mata Pelajaran',
    subject TEXT NOT NULL,
    password TEXT NOT NULL DEFAULT 'sdnbobong',
    avatar_url TEXT DEFAULT 'assets/logo-sdn-bobong.png',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabel Flashcard (Flashcards)
CREATE TABLE IF NOT EXISTS public.flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    word TEXT NOT NULL,
    meaning TEXT NOT NULL,
    phase TEXT DEFAULT 'Fase A',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabel Tugas & Evaluasi (Assignments)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    class_id TEXT REFERENCES public.classes(id),
    due_date DATE,
    status TEXT DEFAULT 'Aktif',
    teacher_nip TEXT REFERENCES public.teachers(nip) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security (RLS) & Kebijakan Akses Publik Read/Write
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read classes" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Allow public read/write students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow public read/write attendance" ON public.attendance FOR ALL USING (true);
CREATE POLICY "Allow public read/write grades" ON public.grades FOR ALL USING (true);
CREATE POLICY "Allow public read/write journals" ON public.journals FOR ALL USING (true);
CREATE POLICY "Allow public read/write modules" ON public.modules FOR ALL USING (true);
CREATE POLICY "Allow public read/write teachers" ON public.teachers FOR ALL USING (true);
CREATE POLICY "Allow public read/write flashcards" ON public.flashcards FOR ALL USING (true);
CREATE POLICY "Allow public read/write assignments" ON public.assignments FOR ALL USING (true);
