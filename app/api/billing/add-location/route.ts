import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Lógica para crear un preapproval en Mercado Pago o Stripe
    // Dummy checkout URL for this phase
    const dummyCheckoutUrl = "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=dummy_add_location";

    return NextResponse.json({ checkoutUrl: dummyCheckoutUrl });
    
  } catch (error) {
    console.error("[ADD_LOCATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
