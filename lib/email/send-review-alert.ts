export async function sendReviewAlert({
  userEmail,
  reviewerName,
  rating,
  comment,
  aiDraft,
  reviewId,
}: {
  userEmail: string;
  reviewerName: string;
  rating: number;
  comment: string | null;
  aiDraft: string;
  reviewId: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'alertas@resplyr.com';
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY no configurada. Saltando envío de alerta.");
    return { success: false };
  }

  let subject = "";
  if (rating <= 2) {
    subject = "🚨 Reseña negativa nueva — responde antes de 24h";
  } else if (rating === 3) {
    subject = "⚠️ Nueva reseña de 3 estrellas en tu negocio";
  } else {
    subject = "⭐ Nueva reseña positiva — ya tienes una respuesta lista";
  }

  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const displayComment = comment ? comment : `El reviewer dejó ${rating} estrellas sin comentario escrito.`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #000;">Resplyr</h2>
      <div style="border: 1px solid #eaeaea; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">${reviewerName}</h3>
        <p style="color: #f59e0b; font-size: 18px; margin: 5px 0;">${stars}</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ccc; margin: 15px 0;">
          <p style="margin: 0; font-style: italic;">"${displayComment}"</p>
        </div>
      </div>
      
      <div style="background-color: #e0f2fe; border: 1px solid #bae6fd; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
        <span style="background-color: #0284c7; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase;">Respuesta sugerida por IA</span>
        <p style="margin-top: 15px; font-size: 16px;">${aiDraft}</p>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${APP_URL}/dashboard" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Ver y publicar respuesta</a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
      <p style="color: #888; font-size: 12px; text-align: center;">Resplyr — Responde tus reseñas con IA</p>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `Resplyr <${FROM_EMAIL}>`,
        to: [userEmail],
        subject: subject,
        html: html
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error en Resend API:", errorData);
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.error("Exception enviando email:", error);
    return { success: false };
  }
}
