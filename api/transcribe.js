// SeWalk AI — Whisper Transcription Endpoint (zero extra deps)
// Receives raw audio blob as binary POST body from frontend,
// re-sends to OpenAI Whisper as multipart/form-data, returns transcript.
//
// ENV VAR needed: OPENAI_API_KEY  (add in Vercel → Settings → Environment Variables)
// The frontend sends:  POST /api/transcribe  with body = raw audio bytes
//                      header: Content-Type: audio/webm  (or audio/mp4, audio/ogg)

const ALLOWED_ORIGINS = [
  'https://sewalk-ultraai.vercel.app',
  'https://sewalk-ai.vercel.app',
  'https://sewalk-3-0.vercel.app',
  'https://sewalk-ai-app.netlify.app',
  'https://sewalk-ai-v3.vercel.app',
  'https://sewalk-ai-302.vercel.app',
  'https://sewalk-ai-0e0188.netlify.app',
  'https://sewalk-ai-c05935.netlify.app',
  'https://sewalk-ai.netlify.app',
  'https://genuine-otter-85f43c.netlify.app',
  'http://localhost:3000',
  'http://localhost:8888',
  'https://se-walk-ai-2-0.vercel.app',
];

// Tell Vercel: give us the raw body as a Buffer (not parsed JSON)
export const config = { api: { bodyParser: { sizeLimit: '25mb' } } };

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
}

// Build a multipart/form-data body manually from a Buffer — no deps needed
function buildMultipart(audioBuffer, mimeType, filename) {
  const boundary = '----SeWalkBoundary' + Math.random().toString(36).slice(2);

  const header =
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="model"\r\n\r\n` +
    `whisper-1\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="language"\r\n\r\n` +
    `en\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
    `Content-Type: ${mimeType}\r\n\r\n`;

  const footer = `\r\n--${boundary}--\r\n`;

  const body = Buffer.concat([
    Buffer.from(header, 'utf-8'),
    audioBuffer,
    Buffer.from(footer, 'utf-8'),
  ]);

  return { body, contentType: `multipart/form-data; boundary=${boundary}` };
}

export default async function handler(req, res) {
  const origin = req.headers['origin'] || '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  res.setHeader('Access-Control-Allow-Origin', isAllowed ? origin : ALLOWED_ORIGINS[0]);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-SeWalk-Session');
  setSecurityHeaders(res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });
  if (!isAllowed)              return res.status(403).json({ error: 'Forbidden' });

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY is not set. Add it in Vercel → Settings → Environment Variables.'
    });
  }

  try {
    let audioBuffer = req.body;
    if (!Buffer.isBuffer(audioBuffer)) {
      audioBuffer = Buffer.from(audioBuffer);
    }

    if (!audioBuffer || audioBuffer.length < 100) {
      return res.status(400).json({ error: 'Audio data is empty or too small.' });
    }

    // Detect mime from incoming Content-Type; fall back to webm
    const incomingMime = (req.headers['content-type'] || 'audio/webm').split(';')[0].trim();
    const mimeToFilename = {
      'audio/webm': 'audio.webm',
      'audio/ogg':  'audio.ogg',
      'audio/mp4':  'audio.mp4',
      'audio/mpeg': 'audio.mp3',
      'audio/wav':  'audio.wav',
      'video/webm': 'audio.webm', // Chrome sometimes reports video/webm
    };
    const filename = mimeToFilename[incomingMime] || 'audio.webm';
    // Whisper needs a supported mime — map video/webm → audio/webm
    const safeMime = incomingMime === 'video/webm' ? 'audio/webm'
      : (mimeToFilename[incomingMime] ? incomingMime : 'audio/webm');

    const { body, contentType } = buildMultipart(audioBuffer, safeMime, filename);

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': contentType,
        'Content-Length': String(body.length),
      },
      body,
    });

    const data = await whisperRes.json();

    if (!whisperRes.ok || data.error) {
      console.error('Whisper API error:', JSON.stringify(data.error));
      return res.status(502).json({ error: data?.error?.message || 'Whisper transcription failed.' });
    }

    return res.status(200).json({ transcript: (data.text || '').trim() });

  } catch (err) {
    console.error('Transcribe endpoint error:', err.message);
    return res.status(500).json({ error: 'Transcription failed. Please try again.' });
  }
}
