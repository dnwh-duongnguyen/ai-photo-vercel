export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  try {
    const { prompt, imageData } = req.body || {};
    if (!prompt || !imageData) {
      res.status(400).send('Missing prompt or imageData');
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).send('Missing GEMINI_API_KEY');
      return;
    }

    const body = {
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: imageData } }
        ]
      }],
      generationConfig: { responseModalities: ['TEXT','IMAGE'] }
    };

    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    );

    const json = await r.json();
    if (!r.ok) {
      res.status(r.status).send(JSON.stringify(json));
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(json));
  } catch (e) {
    res.status(500).send(e?.message || 'Unknown error');
  }
}
