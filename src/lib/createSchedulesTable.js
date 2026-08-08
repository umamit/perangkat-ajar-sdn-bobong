const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSchedulesTable() {
  console.log('Checking if schedules table exists...');

  // Try reading from schedules table
  const { error } = await supabase.from('schedules').select('id').limit(1);

  if (!error) {
    console.log('✅ schedules table already exists and is accessible!');
    return;
  }

  console.log('Table does not exist. Attempting to create via Management API...');
  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

  const sql = `
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
CREATE POLICY IF NOT EXISTS "Allow all access to schedules" ON public.schedules FOR ALL USING (true) WITH CHECK (true);
`.trim();

  const mgmtRes = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  const mgmtText = await mgmtRes.text();
  if (!mgmtRes.ok) {
    console.error('❌ Management API failed:', mgmtText);
  } else {
    console.log('✅ schedules table created successfully!', mgmtText);
  }
}

createSchedulesTable().catch(console.error);
