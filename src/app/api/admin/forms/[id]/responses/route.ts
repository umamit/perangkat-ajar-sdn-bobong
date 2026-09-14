import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { data: form, error: formErr } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();

    if (formErr || !form) {
      return NextResponse.json({ success: false, error: 'Formulir tidak ditemukan' }, { status: 404 });
    }

    const { data: fields } = await supabase
      .from('form_fields')
      .select('*')
      .eq('form_id', id)
      .order('order_index', { ascending: true });

    const { data: responses, error: respErr } = await supabase
      .from('form_responses')
      .select('*')
      .eq('form_id', id)
      .order('created_at', { ascending: false });

    if (respErr) {
      return NextResponse.json({ success: false, error: respErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      form,
      fields: fields || [],
      responses: responses || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
