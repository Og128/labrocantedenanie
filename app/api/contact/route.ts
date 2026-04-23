import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/resend'
import { isRateLimited } from '@/lib/rate-limit'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
  if (isRateLimited(`contact:${ip}`, 3, 60_000)) {
    return NextResponse.json({ error: 'Trop de messages envoyés. Réessayez dans une minute.' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const data = schema.parse(body)

    await sendContactEmail(data)

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
