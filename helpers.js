// Supabase Configuration
const SUPABASE_URL = "https://evslcvjucmnyxkqwfdye.supabase.co";
const SUPABASE_ANON_KEY = "[REDACTED_KEY]";

let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient && window.supabase && SUPABASE_ANON_KEY) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

let appData = { ...INITIAL_DATA };

// Fetch & Sync Data from Supabase
async function syncFromSupabase() {
  const client = getSupabase();
  if (!client) return;

  try {
    const { data: students } = await client.from('students').select('id, nis, name, class_id, gender');
    appData.students = (students || []).map(s => ({
      id: s.nis,
      uuid: s.id,
      nis: s.nis,
      name: s.name,
      classId: s.class_id,
      gender: s.gender || 'L'
    }));

    const { data: journals } = await client.from('journals').select('id, date, time_slot, class_id, topic, notes, attendance_summary');
    if (journals && journals.length > 0) {
      appData.journals = journals.map(j => ({
        id: j.id,
        date: j.date,
        time: j.time_slot || '',
        classId: j.class_id,
        topic: j.topic,
        notes: j.notes || '',
        attendance: j.attendance_summary || ''
      }));
    }

    const { data: teachers } = await client.from('teachers').select('id, nip, name, role, subject, password, avatar_url, is_active');
    if (teachers && teachers.length > 0) {
      appData.teachers = teachers.map(t => ({
        id: t.id,
        nip: t.nip,
        name: t.name,
        role: t.role || 'Guru Mata Pelajaran',
        subject: t.subject || 'Bahasa Inggris',
        password: t.password || 'sdnbobong',
        avatar: t.avatar_url || 'assets/logo-sdn-bobong.png',
        isActive: t.is_active !== false
      }));
    }

    saveStorage();
    if (typeof renderAllViews === 'function') {
      renderAllViews();
    }
  } catch (err) {
    console.warn('[Supabase Sync Warning]', err);
  }
}

// In-Memory Storage Handlers (Storage API completely removed)
function safeMerge(defaults, saved) {
  const result = { ...defaults };
  if (!saved || typeof saved !== 'object') return result;
  for (const key of Object.keys(saved)) {
    if (saved[key] !== undefined && saved[key] !== null && saved[key] !== '') {
      result[key] = saved[key];
    }
  }
  return result;
}

// Safe Cookie Helpers for Session Persistence Across Refresh
function setCookie(name, value, days = 7) {
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('[Cookie Error]', e);
  }
}

function getCookie(name) {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  } catch (e) {
    console.warn('[Cookie Error]', e);
  }
  return null;
}

function eraseCookie(name) {
  try {
    document.cookie = `${name}=; Max-Age=-99999999; path=/; SameSite=Lax`;
  } catch (e) {
    console.warn('[Cookie Error]', e);
  }
  return null;
}

function loadStorage() {
  if (!appData) {
    appData = { ...INITIAL_DATA };
  }
}

function saveStorage() {
  // Data state is held in memory and synced live with Supabase
}

// Password Visibility Toggle
function togglePasswordVisibility() {
  const pwdInput = document.getElementById('loginPassword');
  const icon = document.getElementById('togglePasswordIcon');
  if (!pwdInput || !icon) return;
  if (pwdInput.type === 'password') {
    pwdInput.type = 'text';
    icon.className = 'ri-eye-off-line';
  } else {
    pwdInput.type = 'password';
    icon.className = 'ri-eye-line';
  }
}

// Text to Speech (TTS) for English Pronunciation
function speakText(event, text) {
  if (event) event.stopPropagation();
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
}

// Flashcard Flip Interaction
function flipCard(cardEl) {
  cardEl.classList.toggle('flipped');
}

// Register PWA Service Worker
function registerPwaServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
        .catch(err => console.error('[PWA] Service Worker registration failed:', err));
    });
  }
}
registerPwaServiceWorker();

// Supabase Real-time Mutations
async function saveStudentToSupabase(s) {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('students').upsert({
      nis: s.nis || s.id,
      name: s.name,
      class_id: s.classId,
      gender: s.gender || 'L'
    }, { onConflict: 'nis' });
  } catch (err) {
    console.warn('[Supabase Student Save Warning]', err);
  }
}

async function deleteStudentFromSupabase(nis) {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('students').delete().eq('nis', nis);
  } catch (err) {
    console.warn('[Supabase Student Delete Warning]', err);
  }
}

async function saveJournalToSupabase(j) {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('journals').insert({
      date: j.date,
      time_slot: j.time || '',
      class_id: j.classId,
      topic: j.topic,
      notes: j.notes || '',
      attendance_summary: j.attendance || ''
    });
  } catch (err) {
    console.warn('[Supabase Journal Save Warning]', err);
  }
}

async function saveTeacherToSupabase(t) {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('teachers').upsert({
      nip: t.nip,
      name: t.name,
      role: t.role || 'Guru Mata Pelajaran',
      subject: t.subject || 'Bahasa Inggris',
      password: t.password || 'sdnbobong',
      avatar_url: t.avatar || 'assets/logo-sdn-bobong.png'
    }, { onConflict: 'nip' });
  } catch (err) {
    console.warn('[Supabase Teacher Save Warning]', err);
  }
}

async function deleteTeacherFromSupabase(nip) {
  const client = getSupabase();
  if (!client) return;
  try {
    await client.from('teachers').delete().eq('nip', nip);
  } catch (err) {
    console.warn('[Supabase Teacher Delete Warning]', err);
  }
}



