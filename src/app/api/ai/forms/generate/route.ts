import { NextResponse } from 'next/server';
import { buildFormAiPrompt } from './formAiPrompts';
import { getFallbackForm } from './fallbackTemplates';

export async function POST(req: Request) {
  try {
    const { prompt, formType } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ success: false, message: 'Prompt tidak boleh kosong' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      const fallback = getFallbackForm(prompt, formType);
      return NextResponse.json({ success: true, data: fallback, source: 'fallback' });
    }

    const systemPrompt = 'Anda adalah asisten AI Kurikulum Merdeka spesialis perancang kuis, survei, dan instrumen asesmen pendidikan. Kembalikan HANYA format JSON murni tanpa pembuka/penutup markdown.';
    const userPrompt = buildFormAiPrompt(prompt, formType);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const fallback = getFallbackForm(prompt, formType);
      return NextResponse.json({ success: true, data: fallback, source: 'fallback' });
    }

    const resData = await response.json();
    let content = resData.choices?.[0]?.message?.content || '';

    content = content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(content);

    return NextResponse.json({ success: true, data: parsed, source: 'groq' });
  } catch (error: any) {
    const fallback = getFallbackForm('asesmen', 'assessment');
    return NextResponse.json({ success: true, data: fallback, source: 'fallback_error' });
  }
}
