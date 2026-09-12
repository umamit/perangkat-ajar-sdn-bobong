import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { FormSubmitPayload, FormFieldModel } from '@/types/form';

export async function POST(req: Request) {
  try {
    const payload: FormSubmitPayload = await req.json();
    const { form_id, respondent_name, respondent_meta, answers } = payload;

    if (!form_id || !answers) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    const supabase = getSupabase();

    // 1. Ambil form dan field secara internal (termasuk correct_answer)
    const { data: form, error: formErr } = await supabase
      .from('forms')
      .select('id, type, is_active')
      .eq('id', form_id)
      .single();

    if (formErr || !form || !form.is_active) {
      return NextResponse.json({ success: false, message: 'Formulir tidak aktif atau tidak ditemukan' }, { status: 404 });
    }

    let calculatedScore = 0;
    let maxScore = 0;

    // 2. Jika tipe form adalah kuis, lakukan auto-scoring
    if (form.type === 'quiz') {
      const { data: fields } = await supabase
        .from('form_fields')
        .select('*')
        .eq('form_id', form_id);

      if (fields) {
        fields.forEach((f: FormFieldModel) => {
          const itemPoints = f.points || 0;
          if (itemPoints > 0) {
            maxScore += itemPoints;
            const userAnswer = answers[f.id];
            if (f.correct_answer && userAnswer !== undefined) {
              const isCorrect = String(userAnswer).trim().toLowerCase() === String(f.correct_answer).trim().toLowerCase();
              if (isCorrect) {
                calculatedScore += itemPoints;
              }
            }
          }
        });
      }
    }

    // 3. Simpan jawaban ke database
    const { data: responseData, error: respErr } = await supabase
      .from('form_responses')
      .insert({
        form_id,
        respondent_name: respondent_name || 'Anonim',
        respondent_meta: respondent_meta || {},
        answers,
        score: form.type === 'quiz' ? calculatedScore : 0,
        max_score: form.type === 'quiz' ? maxScore : 0,
      })
      .select('id')
      .single();

    if (respErr) {
      return NextResponse.json({ success: false, message: respErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      response_id: responseData?.id,
      score: form.type === 'quiz' ? calculatedScore : undefined,
      max_score: form.type === 'quiz' ? maxScore : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
