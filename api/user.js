import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Invalid token' })

  if (req.method === 'GET') {
    const { data, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (dbError || !data) {
      // Create user record
      const { data: newUser } = await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || '',
        plan: 'free',
        generations_used: 0,
        generations_reset: new Date().toISOString()
      }).select().single()
      return res.status(200).json(newUser)
    }

    // Reset monthly count if new month
    const resetDate = new Date(data.generations_reset)
    const now = new Date()
    if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
      const { data: updated } = await supabase.from('users')
        .update({ generations_used: 0, generations_reset: now.toISOString() })
        .eq('id', user.id).select().single()
      return res.status(200).json(updated)
    }

    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { action } = req.body
    if (action === 'increment') {
      const { data: userData } = await supabase.from('users').select('*').eq('id', user.id).single()
      if (!userData) return res.status(404).json({ error: 'User not found' })

      if (userData.plan === 'free' && userData.generations_used >= 5) {
        return res.status(403).json({ error: 'Free limit reached', limit: true })
      }

      const { data: updated } = await supabase.from('users')
        .update({ generations_used: (userData.generations_used || 0) + 1 })
        .eq('id', user.id).select().single()
      return res.status(200).json(updated)
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
