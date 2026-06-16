import Razorpay from 'razorpay'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorized' })

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' })

  const { action, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

  // Create order
  if (action === 'create_order') {
    try {
      const order = await razorpay.orders.create({
        amount: 9900, // ₹99 in paise
        currency: 'INR',
        receipt: `listoai_${user.id}_${Date.now()}`,
        notes: { user_id: user.id, email: user.email }
      })
      return res.status(200).json({ order_id: order.id, amount: order.amount, currency: order.currency })
    } catch (err) {
      return res.status(500).json({ error: 'Order create karne mein error: ' + err.message })
    }
  }

  // Verify payment
  if (action === 'verify_payment') {
    try {
      const body = razorpay_order_id + '|' + razorpay_payment_id
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body).digest('hex')

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ error: 'Payment verification failed' })
      }

      // Upgrade user to pro
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      await supabase.from('users').update({
        plan: 'pro',
        pro_expiry: nextMonth.toISOString(),
        razorpay_payment_id
      }).eq('id', user.id)

      return res.status(200).json({ success: true, message: 'Pro plan activate ho gaya!' })
    } catch (err) {
      return res.status(500).json({ error: 'Verification error: ' + err.message })
    }
  }

  return res.status(400).json({ error: 'Invalid action' })
}
