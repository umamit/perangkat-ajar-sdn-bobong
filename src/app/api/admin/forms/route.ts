import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nip = searchParams.get('nip');
    const isKepsek = searchParams.get('isKepsek') === 'true';

    const supabase = getSupabase();
    let query = supabase.from('forms').select('*').order('created_at', { ascending: false });

    if (!isKepsek && nip) {
      query = query.eq('created_by', nip);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, type, created_by } = body;

    if (!title?.trim() || !slug?.trim()) {
      return NextResponse.json({ success: false, error: 'Judul dan slug wajib diisi' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('forms')
      .insert({
        title: title.trim(),
        slug: slug.trim(),
        type: type || 'standard',
        is_active: true,
        created_by: created_by || 'Guru',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID formulir diperlukan' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase.from('forms').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
