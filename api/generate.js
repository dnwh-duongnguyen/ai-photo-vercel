export const config = { runtime: 'edge' };

const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  try {
    const { prompt, imageData } = await req.json();
    if (!prompt || !imageData) {
      return new Response('Missing prompt or imageData', { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response('Server misconfigured: missing GEMINI_API_KEY', { status: 500 });
    }

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: imageData } }
        ]
      }],
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
    };

    const r = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const err = await r.text();
      return new Response(err || 'Upstream error', { status: r.status });
    }

    const json = await r.json();
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(e?.message || 'Unknown error', { status: 500 });
  }
}
