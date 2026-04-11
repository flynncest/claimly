import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-03-25.dahlia' })

const PRICES: Record<string, string> = {
  student: process.env.STRIPE_PRICE_STUDENT!,
  full:    process.env.STRIPE_PRICE_FULL!,
}

export async function POST(req: NextRequest) {
  try {
    const { plan, email, scanDataKey } = await req.json() as {
      plan: 'student' | 'full'
      email?: string
      scanDataKey: string   // base64-encoded scan data stored as metadata
    }

    const priceId = PRICES[plan]
    if (!priceId || priceId.startsWith('price_REPLACE')) {
      return NextResponse.json({ error: 'Stripe price not configured' }, { status: 503 })
    }

    const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      success_url: `${origin}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/pay`,
      metadata: {
        plan,
        scan_data: scanDataKey,   // stored so webhook can run analysis
      },
      payment_intent_data: {
        metadata: { plan },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    const message = err instanceof Error ? err.message : 'Failed to create checkout session'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
