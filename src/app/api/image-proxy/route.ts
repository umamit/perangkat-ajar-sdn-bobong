import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const prompt = searchParams.get('prompt') || 'dog';
    
    // Request image from Pollinations.ai from the server backend
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=400&height=400&nologo=true`;
    
    const res = await fetch(pollinationsUrl);
    if (!res.ok) {
      throw new Error(`Failed to fetch image from Pollinations: ${res.status}`);
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(Buffer.from(buffer), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    console.error('[Image Proxy Error]', err);
    return new NextResponse('Failed to generate image', { status: 500 });
  }
}
