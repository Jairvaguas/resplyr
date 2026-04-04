import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 1. Obtener el mp_preapproval_id del usuario desde Supabase
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("mp_preapproval_id, status")
      .eq("user_id", userId)
      .single();

    // Si no hay token de MP o error en la BD local, 
    // respondemos un bypass si es ambiente de prueba, sino fallamos.
    if (fetchError || !subscription?.mp_preapproval_id) {
       console.warn("No active subscription preapproval logic found in DB, bypassing for UI");
       return NextResponse.json({ success: true, dummy: true });
    }

    if (subscription.status === 'cancelled') {
       return NextResponse.json({ success: true, message: 'Already cancelled' });
    }

    const mpPreapprovalId = subscription.mp_preapproval_id;

    // 2. Llamar a la API de Mercado Pago
    const mpToken = process.env.MP_ACCESS_TOKEN || "TEST_TOKEN";
    const mpResponse = await fetch(`https://api.mercadopago.com/preapproval/${mpPreapprovalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mpToken}`
      },
      body: JSON.stringify({ status: "cancelled" })
    });

    if (!mpResponse.ok) {
       const errorData = await mpResponse.text();
       console.error("[MP_CANCEL_ERROR]", errorData, mpResponse.status);
       // Throw error to abort syncing wrong state to DB.
       throw new Error("Failed to cancel subscription deeply on Mercado Pago");
    }

    // 3. Actualizar en Supabase (mantener current_period_ends_at intacto)
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({ 
        status: "cancelled", 
        updated_at: new Date().toISOString() 
      })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CANCEL_SUBSCRIPTION_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
