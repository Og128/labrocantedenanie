import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderId: string
  orderReference?: string
  orderItems: Array<{
    title: string
    price: number
  }>
  totalAmount: number
  shippingCost: number
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    postalCode: string
    country: string
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const { customerName, customerEmail, orderId, orderReference, orderItems, totalAmount, shippingCost, shippingAddress } = data
  const ref = orderReference || orderId.slice(-8).toUpperCase()

  const itemsHtml = orderItems
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e8ddd0;">${item.title}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e8ddd0; text-align: right;">${formatPrice(item.price)}</td>
        </tr>`
    )
    .join('')

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    subject: `Confirmation de commande #${ref} - La Brocante de Nanie`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Georgia', serif; background-color: #faf7f2; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fdfbf8; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background-color: #C4623A; padding: 30px; text-align: center;">
      <h1 style="color: #fdfbf8; margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px;">La Brocante de Nanie</h1>
      <p style="color: #fae4d9; margin: 5px 0 0; font-size: 14px;">Des trésors du passé pour embellir votre aujourd'hui</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <h2 style="color: #6B4F3A; font-family: 'Playfair Display', Georgia, serif;">Merci pour votre commande, ${customerName} !</h2>
      <p style="color: #555; line-height: 1.6;">Votre commande <strong>#${ref}</strong> a bien ete recue et est en cours de traitement.</p>
      <div style="background: #faf7f2; border: 2px solid #C4623A; border-radius: 6px; padding: 16px; margin: 16px 0; text-align: center;">
        <p style="color: #888; margin: 0 0 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Reference de commande</p>
        <p style="color: #C4623A; font-size: 26px; font-weight: bold; margin: 0; font-family: monospace; letter-spacing: 3px;">${ref}</p>
        <p style="color: #888; margin: 6px 0 0; font-size: 12px;">Utilisez cette reference sur <a href="${process.env.NEXT_PUBLIC_SITE_URL}/suivi" style="color: #C4623A;">notre page de suivi</a></p>
      </div>

      <!-- Order Summary -->
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr>
            <th style="padding: 10px 8px; background: #e8ddd0; text-align: left; color: #6B4F3A;">Article</th>
            <th style="padding: 10px 8px; background: #e8ddd0; text-align: right; color: #6B4F3A;">Prix</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
          <tr>
            <td style="padding: 8px; color: #888;">Livraison</td>
            <td style="padding: 8px; text-align: right; color: #888;">${formatPrice(shippingCost)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 8px; font-weight: bold; color: #6B4F3A; font-size: 16px;">Total</td>
            <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #C4623A; font-size: 16px;">${formatPrice(totalAmount)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Shipping Address -->
      <div style="background: #faf7f2; border-left: 3px solid #C4623A; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h3 style="color: #6B4F3A; margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Adresse de livraison</h3>
        <p style="margin: 0; color: #555; line-height: 1.6;">
          ${shippingAddress.line1}<br>
          ${shippingAddress.line2 ? shippingAddress.line2 + '<br>' : ''}
          ${shippingAddress.postalCode} ${shippingAddress.city}<br>
          ${shippingAddress.country}
        </p>
      </div>

      <p style="color: #888; font-size: 13px;">Pour toute question, contactez-nous à <a href="mailto:${process.env.EMAIL_CONTACT}" style="color: #C4623A;">${process.env.EMAIL_CONTACT}</a></p>
    </div>

    <!-- Footer -->
    <div style="background: #e8ddd0; padding: 20px; text-align: center;">
      <p style="color: #6B4F3A; margin: 0; font-size: 13px;">La Brocante de Nanie — Merci de votre confiance !</p>
    </div>
  </div>
</body>
</html>`,
  })
}

export async function sendAdminOrderNotification(data: {
  orderId: string
  customerName: string
  customerEmail: string
  orderItems: Array<{ title: string; price: number }>
  totalAmount: number
  shippingAddress: { line1: string; line2?: string; city: string; postalCode: string; country: string }
}) {
  const { orderId, customerName, customerEmail, orderItems, totalAmount, shippingAddress } = data
  const ref = orderId.slice(-8).toUpperCase()

  const itemsList = orderItems.map((i) => `- ${i.title} : ${formatPrice(i.price)}`).join('<br>')

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.EMAIL_CONTACT!,
    replyTo: process.env.EMAIL_CONTACT!,
    subject: `🛍️ Nouvelle vente #${ref} — ${formatPrice(totalAmount)}`,
    html: `
<div style="font-family: sans-serif; padding: 20px; max-width: 600px;">
  <h2 style="color: #C4623A;">Nouvelle commande reçue !</h2>
  <p><strong>Référence :</strong> #${ref}</p>
  <p><strong>Client :</strong> ${customerName} (${customerEmail})</p>
  <p><strong>Montant total :</strong> ${formatPrice(totalAmount)}</p>
  <p><strong>Articles :</strong><br>${itemsList}</p>
  <p><strong>Adresse de livraison :</strong><br>
    ${shippingAddress.line1}<br>
    ${shippingAddress.line2 ? shippingAddress.line2 + '<br>' : ''}
    ${shippingAddress.postalCode} ${shippingAddress.city}, ${shippingAddress.country}
  </p>
  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/commandes" style="display:inline-block;background:#C4623A;color:white;padding:10px 20px;border-radius:4px;text-decoration:none;margin-top:10px;">
    Voir dans l'admin
  </a>
</div>`,
  })
}

export async function sendShippingEmail(data: {
  customerName: string
  customerEmail: string
  orderId: string
  trackingNumber: string | null
}) {
  const { customerName, customerEmail, orderId, trackingNumber } = data
  const ref = orderId.slice(-8).toUpperCase()

  const trackingBlock = trackingNumber
    ? `<div style="background: #faf7f2; border: 2px solid #C4623A; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="color: #888; margin: 0 0 5px; font-size: 12px; text-transform: uppercase;">Numéro de suivi</p>
      <p style="color: #C4623A; font-size: 22px; font-weight: bold; margin: 0;">${trackingNumber}</p>
    </div>`
    : ''

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: customerEmail,
    subject: `Votre commande #${ref} a été expédiée !`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<body style="font-family: Georgia, serif; background-color: #faf7f2; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fdfbf8; border-radius: 8px; padding: 30px;">
    <h1 style="color: #C4623A; font-family: Georgia, serif;">📦 Votre colis est en route !</h1>
    <p>Bonjour ${customerName},</p>
    <p>Bonne nouvelle ! Votre commande <strong>#${ref}</strong> a été expédiée.</p>
    ${trackingBlock}
    <p style="color: #888; font-size: 13px;">Pour toute question : <a href="mailto:${process.env.EMAIL_CONTACT}" style="color: #C4623A;">${process.env.EMAIL_CONTACT}</a></p>
    <p style="color: #6B4F3A;">— L'équipe de La Brocante de Nanie</p>
  </div>
</body>
</html>`,
  })
}

export async function sendContactEmail(data: {
  name: string
  email: string
  subject: string
  message: string
}) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.EMAIL_CONTACT!,
    replyTo: data.email,
    subject: `[Contact] ${data.subject} - ${data.name}`,
    html: `
<div style="font-family: sans-serif; padding: 20px;">
  <h2>Nouveau message de contact</h2>
  <p><strong>Nom :</strong> ${data.name}</p>
  <p><strong>Email :</strong> ${data.email}</p>
  <p><strong>Sujet :</strong> ${data.subject}</p>
  <hr>
  <p>${data.message.replace(/\n/g, '<br>')}</p>
</div>`,
  })
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}
