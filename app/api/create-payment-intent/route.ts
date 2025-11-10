// app/api/create-payment-intent/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
})

export async function POST(request: NextRequest) {
  
  try {
    console.log('💰 Payment Intent Route hit. Key mode:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'LIVE' : 'TEST');
    const { 
      amount = 1099, 
      currency = 'usd', 
      email, 
      rideId, 
      seats,
      description 
    } = await request.json()

    // Validate required fields
    if (!amount || amount < 50) {
      return NextResponse.json({
        error: 'Invalid amount',
        message: 'Amount must be at least $0.50'
      }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({
        error: 'Missing email',
        message: 'Customer email is required'
      }, { status: 400 })
    }

    console.log('Creating payment intent:', {
      amount,
      currency,
      email,
      rideId,
      seats
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      payment_method_types: ['card'],
      description: description || `Ribit ride booking - ${seats} seat(s)`,
      metadata: {
        email: email || '',
        rideId: rideId?.toString() || '',
        seats: seats?.toString() || '',
        platform: 'ribit-mobile-app',
        created_at: new Date().toISOString(),
      },
      receipt_email: email,
    })

    console.log('Payment intent created successfully:', paymentIntent.id)

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    })

  } catch (error) {
    console.error('Stripe payment intent creation failed:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({
        error: 'stripe_error',
        message: error.message
      }, { status: 400 })
    }

    return NextResponse.json({
      error: 'server_error',
      message: 'An unexpected error occurred while processing your payment'
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}