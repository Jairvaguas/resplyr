import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const { userId } = await auth();
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress;

  if (!userId || !userEmail) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  let plan = 'pro';
  try {
    const body = await req.json();
    if (body && body.plan) plan = body.plan;
  } catch (err) {
    // Si no se envía JSON, default a pro
  }

  let transaction_amount = 39;
  let reason = "Resplyr Plan Pro";

  if (plan === 'basic') {
    transaction_amount = 19;
    reason = "Resplyr Plan Básico";
  } else if (plan === 'business') {
    transaction_amount = 79;
    reason = "Resplyr Plan Business";
  } else {
    // defaults just in case
    transaction_amount = 39;
    reason = "Resplyr Plan Pro";
  }

  const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!MP_ACCESS_TOKEN) {
    // Fallback URL simulada para ambiente de desarrollo sin token
    return NextResponse.json({ checkoutUrl: APP_URL + "/dashboard?payment=simulated" });
  }

  try {
    const response = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        reason: reason,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: transaction_amount,
          currency_id: "USD"
        },
        back_url: `${APP_URL}/dashboard?payment=success`,
        payer_email: userEmail
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Mercado Pago Error:", data);
      return NextResponse.json({ error: "Error en Mercado Pago" }, { status: 500 });
    }

    // Save preapproval id in Supabase
    await supabaseServer
      .from('subscriptions')
      .update({ mp_preapproval_id: data.id })
      .eq('user_id', userId);

    return NextResponse.json({ checkoutUrl: data.init_point });
  } catch (err) {
    console.error("Exception Mercado Pago:", err);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
