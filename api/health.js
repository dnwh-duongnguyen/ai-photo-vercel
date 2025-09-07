export default async function handler(req) {
  return new Response(JSON.stringify({
    ok: true,
    hasKey: !!process.env.GEMINI_API_KEY
  }), { status: 200, headers: { 'Content-Type': 'application/json' }});
}
