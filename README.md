# ListoAI 🛍️

AI-powered product listing generator for Indian e-commerce sellers (Meesho, Amazon).

## Features
- AI-generated product title, short & long description
- Image prompt for free AI image tools
- Mobile-friendly UI
- Powered by Google Gemini (free API)

## Deploy on Vercel

### Step 1 — Gemini API Key lao (Free)
1. https://aistudio.google.com/app/apikey pe jao
2. "Create API Key" click karo
3. Key copy kar lo

### Step 2 — GitHub pe upload karo
1. github.com pe naya repository banao — "listoai"
2. Ye saari files upload karo

### Step 3 — Vercel pe deploy karo
1. vercel.com/new pe jao
2. GitHub se "listoai" repo select karo
3. **Environment Variables** mein add karo:
   - Key: `GEMINI_API_KEY`
   - Value: tumhari Gemini API key
4. Deploy click karo

Done! Live URL mil jayega.

## Local Development
```bash
npm install
# .env file banao aur GEMINI_API_KEY add karo
npm run dev
```
