export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, category, features, lang } = req.body || {};

  if (!name || !category || !features) {
    return res.status(400).json({ error: 'name, category, features required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set in environment variables' });

  const langInstruction = lang || 'Write ALL descriptions in English.';

  const prompt = `You are an expert product listing writer for Indian e-commerce sellers.

Product Name: ${name}
Category: ${category}
Key Features: ${features}

Language instruction: ${langInstruction}

Write compelling product listings for all major Indian e-commerce platforms.
You MUST respond ONLY with a raw valid JSON object. No markdown, no backticks, no extra text.

Required JSON:
{
  "title": "SEO optimized product title max 60 chars",
  "short": "Meesho description: short punchy max 50 words, for resellers, highlight value and quality",
  "long": "Amazon description: detailed SEO-rich max 150 words, mention all features and benefits",
  "flipkart": "Flipkart description: clear confident max 100 words, highlight key specs and benefits",
  "general": "Universal description max 100 words, works for any ecommerce platform",
  "imagePrompt": "Professional product photography of ${name} isolated on pure white background, studio lighting, high resolution, ecommerce style, sharp focus"
}`;

  const models = [
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
    'gemini-pro'
  ];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
          })
        }
      );

      const data = await response.json();
      if (!response.ok || data.error) continue;

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();

      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch {
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
        else continue;
      }

      if (!parsed.title || !parsed.short || !parsed.long) continue;

      return res.status(200).json({ ...parsed, _model: model });

    } catch { continue; }
  }

  return res.status(500).json({ error: 'AI generate nahi kar paya. Thodi der baad try karo.' });
}
