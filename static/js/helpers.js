import { INITIAL_DATA } from './data.js';
const metaEnv = typeof import.meta !== 'undefined' ? import.meta.env : null;
const SUPABASE_URL = (metaEnv && metaEnv.VITE_SUPABASE_URL)
    ? metaEnv.VITE_SUPABASE_URL
    : "https://evslcvjucmnyxkqwfdye.supabase.co";
const HARDCODED_SERVICE_ROLE_KEY = "[REDACTED_KEY]";
const SUPABASE_SERVICE_ROLE_KEY = (metaEnv && metaEnv.VITE_SUPABASE_SERVICE_ROLE_KEY)
    ? metaEnv.VITE_SUPABASE_SERVICE_ROLE_KEY
    : HARDCODED_SERVICE_ROLE_KEY;
let supabaseClient = null;
export function getSupabase() {
    if (!supabaseClient && typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        });
    }
    return supabaseClient;
}
export let appData = { ...INITIAL_DATA };
// Fetch & Sync Data Fresh from Supabase
export async function syncFromSupabase() {
    try {
        const res = await fetch('/api/sync');
        const data = await res.json();
        if (!data.success) {
            console.warn('[Sync API Error]', data.error);
            return;
        }

        if (data.classes && data.classes.length > 0) {
            const classMap = new Map();
            INITIAL_DATA.classes.forEach(c => classMap.set(c.id, c));
            data.classes.forEach((c) => classMap.set(c.id, { id: c.id, name: c.name, room: c.room || '', phase: c.phase || '' }));
            appData.classes = Array.from(classMap.values());
        }

        if (data.students && data.students.length > 0) {
            const currentMap = new Map();
            (appData.students || []).forEach(s => currentMap.set(s.id || s.nis, s));
            const fetchedStudents = data.students.map((s) => {
                const existing = currentMap.get(s.id) || currentMap.get(s.nis);
                return {
                    id: s.id,
                    uuid: s.id,
                    nis: s.nis || s.id,
                    name: s.name,
                    classId: s.class_id,
                    gender: s.gender || 'L',
                    scoreFormatif: existing ? (existing.scoreFormatif || 80) : 80,
                    scoreSumatif: existing ? (existing.scoreSumatif || 80) : 80
                };
            });
            const studentMap = new Map();
            INITIAL_DATA.students.forEach(s => studentMap.set(s.nis || s.id, s));
            (appData.students || []).forEach(s => studentMap.set(s.nis || s.id, s));
            fetchedStudents.forEach(s => studentMap.set(s.nis || s.id, s));
            appData.students = Array.from(studentMap.values());
        } else {
            const studentMap = new Map();
            INITIAL_DATA.students.forEach(s => studentMap.set(s.nis || s.id, s));
            (appData.students || []).forEach(s => studentMap.set(s.nis || s.id, s));
            appData.students = Array.from(studentMap.values());
        }

        if (data.journals && data.journals.length > 0) {
            appData.journals = data.journals.map((j) => ({
                id: j.id,
                date: j.date,
                time: j.time_slot || '',
                classId: j.class_id,
                topic: j.topic,
                notes: j.notes || '',
                attendance: j.attendance_summary || ''
            }));
        }

        if (data.attendance && data.attendance.length > 0) {
            const grouped = {};
            data.attendance.forEach((a) => {
                const key = `${a.date}_${a.class_id}`;
                if (!grouped[key]) {
                    grouped[key] = { date: a.date, classId: a.class_id, hadir: 0, izin: 0, sakit: 0, alpa: 0 };
                }
                if (a.status === 'Hadir')
                    grouped[key].hadir++;
                else if (a.status === 'Izin')
                    grouped[key].izin++;
                else if (a.status === 'Sakit')
                    grouped[key].sakit++;
                else if (a.status === 'Alpa')
                    grouped[key].alpa++;
            });
            appData.attendance = Object.values(grouped);
        }

        if (data.grades && data.grades.length > 0) {
            data.grades.forEach((g) => {
                const st = appData.students.find(s => s.uuid === g.student_id || s.nis === g.student_id);
                if (st) {
                    if (g.type === 'Formatif')
                        st.scoreFormatif = Number(g.score);
                    else if (g.type === 'Sumatif')
                        st.scoreSumatif = Number(g.score);
                }
            });
        }

        if (data.modules && data.modules.length > 0) {
            appData.modules = data.modules.map((m) => ({
                id: m.id,
                title: m.title,
                grade: m.phase || 'Kelas 4 SD',
                tp: m.tp || '',
                atp: m.atp || '',
                duration: m.duration || '2 x 35 Menit',
                fileUrl: m.file_url || ''
            }));
        }

        if (data.teachers && data.teachers.length > 0) {
            appData.teachers = data.teachers.map((t) => ({
                id: t.id,
                nip: t.nip,
                name: t.name,
                role: t.role || 'Guru Mata Pelajaran',
                subject: t.subject || 'Bahasa Inggris',
                password: t.password || 'sdnbobong',
                avatar: t.avatar_url || 'assets/logo-sdn-bobong.png',
                isActive: t.is_active !== false
            }));
            const activeNip = (appData.teacher && appData.teacher.nip) ? appData.teacher.nip : '199610272019032006';
            const matched = appData.teachers.find((t) => t.nip === activeNip);
            if (matched) {
                appData.teacher = { ...appData.teacher, ...matched };
            }
        } else {
            appData.teachers = [...INITIAL_DATA.teachers];
        }

        saveStorage();

        // Re-render views
        if (typeof window.renderTeacherProfile === 'function') window.renderTeacherProfile();
        if (typeof window.renderDataGuru === 'function') window.renderDataGuru();
        if (typeof window.renderDashboard === 'function') window.renderDashboard();
        if (typeof window.renderDataSiswa === 'function') window.renderDataSiswa();
        if (typeof window.renderDaftarNilai === 'function') window.renderDaftarNilai();
        if (typeof window.renderJurnal === 'function') window.renderJurnal();
        if (typeof window.renderAbsensi === 'function') window.renderAbsensi();
        if (typeof window.renderAllViews === 'function') window.renderAllViews();
        setupSupabaseRealtime();
    } catch (err) {
        console.warn('[Supabase Sync Warning]', err);
    }
}
// Supabase Real-time WebSockets Subscription (Gratis)
let realtimeChannel = null;
export function setupSupabaseRealtime() {
    const client = getSupabase();
    if (!client || realtimeChannel)
        return;
    try {
        realtimeChannel = client
            .channel('sdn-bobong-realtime-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (payload) => {
            console.log('[Supabase Realtime Student Event]', payload);
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                const newS = payload.new;
                const existingIdx = (appData.students || []).findIndex((s) => s.id === newS.id || s.nis === newS.nis);
                const mapped = {
                    id: newS.id,
                    uuid: newS.id,
                    nis: newS.nis || newS.id,
                    name: newS.name,
                    classId: newS.class_id,
                    gender: newS.gender || 'L',
                    scoreFormatif: 80,
                    scoreSumatif: 80
                };
                if (existingIdx >= 0) {
                    appData.students[existingIdx] = {
                        ...appData.students[existingIdx],
                        ...mapped
                    };
                }
                else {
                    appData.students.push(mapped);
                }
            }
            else if (payload.eventType === 'DELETE') {
                const oldS = payload.old;
                appData.students = (appData.students || []).filter((s) => s.id !== oldS.id && s.nis !== oldS.nis);
            }
            if (typeof window.renderDataSiswa === 'function') {
                const selectElem = document.getElementById('siswaClassSelect');
                const filterVal = selectElem ? selectElem.value : 'ALL';
                window.renderDataSiswa(filterVal);
            }
        })
            .subscribe();
    }
    catch (e) {
        console.warn('[Supabase Realtime Subscription Warning]', e);
    }
}
// In-Memory Storage Handlers (Storage API completely removed)
export function setCookie(name, value, days = 7) {
    try {
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
    }
    catch (e) {
        console.warn('[Cookie Error]', e);
    }
}
export function getCookie(name) {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2)
            return decodeURIComponent(parts.pop().split(';').shift());
    }
    catch (e) {
        console.warn('[Cookie Error]', e);
    }
    return null;
}
export function eraseCookie(name) {
    try {
        document.cookie = `${name}=; Max-Age=-99999999; path=/; SameSite=Lax`;
    }
    catch (e) {
        console.warn('[Cookie Error]', e);
    }
}
// Pure Supabase Sync Handlers (IndexedDB & LocalStorage completely removed)
export function loadStorage() {
    // Pure live Supabase sync on login, no browser storage
}
export function saveStorage() {
    // Pure live Supabase sync, no browser storage
}
// Password Visibility Toggle
export function togglePasswordVisibility() {
    const pwdInput = document.getElementById('loginPassword');
    const icon = document.getElementById('togglePasswordIcon');
    if (!pwdInput || !icon)
        return;
    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        icon.className = 'ri-eye-off-line';
    }
    else {
        pwdInput.type = 'password';
        icon.className = 'ri-eye-line';
    }
}
// Text to Speech (TTS) for English Pronunciation
export function speakText(event, text) {
    if (event)
        event.stopPropagation();
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }
}
// Flashcard Flip Interaction
export function flipCard(cardEl) {
    cardEl.classList.toggle('flipped');
}
// Register PWA Service Worker
export function registerPwaServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
                .catch(err => console.error('[PWA] Service Worker registration failed:', err));
        });
    }
}
registerPwaServiceWorker();
export async function saveStudentToSupabase(s) {
    try {
        const res = await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(s)
        });
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
            s.uuid = data.data[0].id;
            s.id = data.data[0].id;
            s.nis = data.data[0].id;
            return true;
        }
        return false;
    }
    catch (err) {
        console.warn('[Save Student Exception]', err);
        return false;
    }
}
export async function saveStudentsBatchToSupabase(students) {
    try {
        const res = await fetch('/api/students/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(students)
        });
        const data = await res.json();
        return data.success;
    }
    catch (err) {
        console.warn('[Batch Save Student Exception]', err);
        return false;
    }
}
export async function deleteStudentFromSupabase(id) {
    try {
        const res = await fetch(`/api/students?id=${encodeURIComponent(id)}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        return data.success;
    }
    catch (err) {
        console.warn('[Delete Student Exception]', err);
        return false;
    }
}
export async function saveJournalToSupabase(j) {
    try {
        const res = await fetch('/api/journals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(j)
        });
        const data = await res.json();
        return data.success;
    }
    catch (err) {
        console.warn('[Save Journal Exception]', err);
        return false;
    }
}
export async function saveTeacherToSupabase(t) {
    try {
        const res = await fetch('/api/teachers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(t)
        });
        const data = await res.json();
        return data.success;
    }
    catch (err) {
        console.warn('[Save Teacher Exception]', err);
        return false;
    }
}
export async function deleteTeacherFromSupabase(nip) {
    return true;
}
export async function uploadAvatarToSupabaseStorage(file, nip) {
    const client = getSupabase();
    if (!client)
        return null;
    try {
        const ext = file.name.split('.').pop() || 'jpg';
        const filePath = `teacher_${nip}_${Date.now()}.${ext}`;
        const { data, error } = await client.storage
            .from('avatars')
            .upload(filePath, file, { cacheControl: '3600', upsert: true });
        if (error) {
            console.warn('[Supabase Storage Upload Error]', error);
            return null;
        }
        const { data: publicUrlData } = client.storage
            .from('avatars')
            .getPublicUrl(filePath);
        return publicUrlData ? publicUrlData.publicUrl : null;
    }
    catch (err) {
        console.warn('[Supabase Storage Exception]', err);
        return null;
    }
}
// Global Browser Window State Attachment
if (typeof window !== 'undefined') {
    window.getSupabase = getSupabase;
    window.syncFromSupabase = syncFromSupabase;
    window.loadStorage = loadStorage;
    window.saveStorage = saveStorage;
    window.togglePasswordVisibility = togglePasswordVisibility;
    window.speakText = speakText;
    window.flipCard = flipCard;
    window.saveStudentToSupabase = saveStudentToSupabase;
    window.deleteStudentFromSupabase = deleteStudentFromSupabase;
    window.saveJournalToSupabase = saveJournalToSupabase;
    window.saveTeacherToSupabase = saveTeacherToSupabase;
    window.deleteTeacherFromSupabase = deleteTeacherFromSupabase;
    window.uploadAvatarToSupabaseStorage = uploadAvatarToSupabaseStorage;
    window.appData = appData;
}
