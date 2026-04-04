import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook MP recibido:", body);

    // Opcional: Validar firma x-signature aquí usando MP_WEBHOOK_SECRET
    
    // MP envía action o type. El evento de suscripción es type="subscription_preapproval"
    if (body.type === 'subscription_preapproval' || body.action === 'created' || body.action === 'updated') {
      const dataId = body.data?.id;
      
      if (dataId) {
        // Consultar el estado real a la API de MP usando el id
        const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
        if(MP_ACCESS_TOKEN) {
          const res = await fetch(`https://api.mercadopago.com/preapproval/${dataId}`, {
             headers: { "Authorization": `Bearer ${MP_ACCESS_TOKEN}` }
          });
          
          if (res.ok) {
             const preapproval = await res.json();
             const status = preapproval.status; // 'authorized', 'paused', 'cancelled'
             
             // Buscar la sub
             const { data: sub } = await supabaseServer
                .from('subscriptions')
                .select('*')
                .eq('mp_preapproval_id', dataId)
                .single();
                
             if (sub) {
                if (status === 'authorized') {
                   // Calculate next month
                   const nextMonth = new Date();
                   nextMonth.setMonth(nextMonth.getMonth() + 1);
                   
                   await supabaseServer
                      .from('subscriptions')
                      .update({ 
                         plan: 'pro', 
                         status: 'active',
                         current_period_ends_at: nextMonth.toISOString()
                      })
                      .eq('id', sub.id);
                } else if (status === 'cancelled' || status === 'paused') {
                   await supabaseServer
                      .from('subscriptions')
                      .update({ 
                         status: 'cancelled'
                      })
                      .eq('id', sub.id);
                }
             }
          }
        }
      }
    }
    
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error procesando webhook MP:", error);
    // Siempre retornar 200 en MP de todos modos
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
