import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { reviewId } = await req.json();
  if (!reviewId) return NextResponse.json({ error: "reviewId es requerido" }, { status: 400 });

  const { data: review, error } = await supabaseServer
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .single();

  if (error || !review) return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });

  const promptText = `Eres el asistente de respuestas de un negocio local. 
Tu tarea es redactar una respuesta profesional, cálida y auténtica a la siguiente reseña de Google.

Datos de la reseña:
- Nombre del reviewer: ${review.reviewer_name}
- Rating: ${review.rating} de 5 estrellas
- Comentario: ${review.comment ? review.comment : "El reviewer dejó " + review.rating + " estrellas sin comentario escrito."}

Reglas:
- Si el rating es 4-5 estrellas: respuesta agradecida, breve (2-3 oraciones), menciona el nombre del reviewer
- Si el rating es 3 estrellas: respuesta empática, reconoce la experiencia, invita a regresar
- Si el rating es 1-2 estrellas: respuesta profesional, pide disculpas sin excusas, ofrece resolver el problema, incluye invitación a contacto directo
- Idioma: español latinoamericano natural, no formal en exceso
- Longitud máxima: 100 palabras
- No uses frases genéricas como "Estimado cliente" o "Gracias por su visita"
- Siempre termina con una despedida cálida

Responde ÚNICAMENTE con el texto de la respuesta, sin explicaciones adicionales.`;

  try {
    const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{ role: 'user', content: promptText }]
      })
    });

    const aiData = await aiResponse.json();

    if (!aiResponse.ok) {
        console.error("Claude API error:", aiData);
        return NextResponse.json({ error: "Error en API de Claude" }, { status: 500 });
    }

    const draft = aiData.content[0].text.trim();

    await supabaseServer
      .from('reviews')
      .update({
        ai_reply_draft: draft,
        ai_reply_generated_at: new Date().toISOString()
      })
      .eq('id', reviewId);

    return NextResponse.json({ draft });
  } catch (err) {
    console.error("Error generando respuesta:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
