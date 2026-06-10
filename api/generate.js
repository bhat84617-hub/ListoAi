export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, category, features } = req.body || {};

  if (!name || !category || !features) {
    return res.status(400).json({ error: 'name, category, features required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set in environment variables' });

  const prompt = `You are an expert product listing writer for Indian e-commerce sellers on Meesho and Amazon India.

Product Name: ${name}
Category: ${category}
Key Features: ${features}

Write compelling product listings. You MUST respond ONLY with a raw valid JSON object. No markdown, no backticks, no explanation, no extra text before or after.

Required JSON format:
{"title":"SEO optimized product title max 60 chars","short":"Short description for Meesho max 50 words simple English","long":"Long description for Amazon max 150 words persuasive mention key benefits","imagePrompt":"Professional product photography of ${name} on pure white background studio lighting high resolution ecommerce product shot isolated"}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
            responseMimeType: "application/json"
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || 'Gemini API error' });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Aggressive cleaning
    const clean = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .replace(/^\s+|\s+$/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      // Try extracting JSON from response
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Invalid JSON from Gemini');
      }
    }

    // Validate all fields exist
    if (!parsed.title || !parsed.short || !parsed.long || !parsed.imagePrompt) {
      throw new Error('Incomplete response from AI');
    }

    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: 'Generation failed: ' + err.message });
  }
}
