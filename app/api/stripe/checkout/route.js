import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request) {
  try {
    const body = await request.json();
    const priceId = body.priceId || process.env.STRIPE_MOVIMENTADOR_CLOUD_PRICE_ID;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!priceId) {
      return NextResponse.json({ error: "Missing Stripe price ID." }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      locale: "pt-BR",
      billing_address_collection: "auto",
      customer_email: body.customerEmail,
      success_url: `${baseUrl}/?checkout=success`,
      cancel_url: `${baseUrl}/?checkout=cancelled`,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: {
        source: "movimentador-web",
        plan: "cloud_monthly",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Stripe checkout failed." },
      { status: 500 }
    );
  }
}
