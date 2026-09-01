import { NextRequest, NextResponse } from 'next/server';

function generateFallbackSvg(word: string): string {
  const cleanWord = (word || 'Kosakata').substring(0, 16);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#E0F7FA"/>
        <stop offset="100%" stop-color="#E2F1F8"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" rx="32" fill="url(#bg)"/>
    <circle cx="200" cy="180" r="64" fill="#12A5B8" opacity="0.15"/>
    <path d="M170 180 L200 150 L230 180 M200 150 L200 215" stroke="#0A7E8D" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <text x="200" y="280" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="800" fill="#0A7E8D" text-anchor="middle">${cleanWord}</text>
  </svg>`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawPrompt = searchParams.get('prompt') || 'Flashcard';
  const query = searchParams.get('query') || rawPrompt;
  
  const cleanQuery = query
    .replace(/[\\/&()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Child-safe educational query normalization
  const educationalQuery = `${cleanQuery} object clean`;

  const pexelsApiKey = process.env.PEXELS_API_KEY;

  // 1. Try Pexels API First if Key Exists (Fast & HD Real Photos)
  if (pexelsApiKey) {
    try {
      const pexelsRes = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(educationalQuery)}&per_page=1&orientation=square`,
        {
          headers: { Authorization: pexelsApiKey },
          signal: AbortSignal.timeout(4000),
        }
      );

      if (pexelsRes.ok) {
        const data = await pexelsRes.json();
        const photoUrl = data.photos?.[0]?.src?.medium || data.photos?.[0]?.src?.small;
        if (photoUrl) {
          const imgRes = await fetch(photoUrl, { signal: AbortSignal.timeout(4000) });
          if (imgRes.ok) {
            const buffer = await imgRes.arrayBuffer();
            return new NextResponse(Buffer.from(buffer), {
              headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000, immutable',
              },
            });
          }
        }
      }
    } catch (e) {
      console.warn('[Pexels Proxy Notice]', cleanQuery, e);
    }
  }

  // 2. Fallback to Pollinations AI Turbo
  try {
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanQuery)}?width=400&height=400&nologo=true&model=turbo&seed=42`;
    const res = await fetch(pollinationsUrl, { signal: AbortSignal.timeout(6000) });

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(Buffer.from(buffer), {
        headers: {
          'Content-Type': 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (err) {
    console.warn('[Pollinations Fallback Notice]', cleanQuery, err);
  }

  // 3. Fallback to Clean SVG Vector
  const svg = generateFallbackSvg(cleanQuery.split(' ')[0] || 'Flashcard');
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
