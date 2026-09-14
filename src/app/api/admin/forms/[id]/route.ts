import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { data: form, error: formErr } = await supabase.from('forms').select('*').eq('id', id).single();
    if (formErr) return NextResponse.json({ success: false, error: formErr.message }, { status: 404 });

    const { data: fields } = await supabase.from('form_fields').select('*').eq('form_id', id).order('order_index', { ascending: true });

    return NextResponse.json({ success: true, form, fields: fields || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { form, fields } = body;

    const supabase = getSupabase();

    if (form) {
      const { error: formErr } = await supabase.from('forms').update({
        title: form.title,
        description: form.description,
        type: form.type,
        is_active: form.is_active,
        duration_minutes: form.duration_minutes,
        updated_at: new Date().toISOString(),
      }).eq('id', id);

      if (formErr) return NextResponse.json({ success: false, error: formErr.message }, { status: 500 });
    }

    if (Array.isArray(fields)) {
      await supabase.from('form_fields').delete().eq('form_id', id);
      if (fields.length > 0) {
        const payload = fields.map((f, idx) => ({ ...f, form_id: id, order_index: idx }));
        const { error: fieldErr } = await supabase.from('form_fields').insert(payload);
        if (fieldErr) return NextResponse.json({ success: false, error: fieldErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = getSupabase();
    const { error } = await supabase.from('forms').delete().eq('id', id);
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
