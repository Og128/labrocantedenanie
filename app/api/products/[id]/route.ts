import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN'
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    console.error('GET /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()

    // Regenerate slug if title changed
    if (body.title) {
      const newSlug = slugify(body.title)
      const existing = await prisma.product.findFirst({
        where: { slug: newSlug, id: { not: id } },
      })
      body.slug = existing ? `${newSlug}-${Date.now()}` : newSlug
    }

    const product = await prisma.product.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('PATCH /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const { id } = await params

    const orderItem = await prisma.orderItem.findFirst({ where: { productId: id } })
    if (orderItem) {
      return NextResponse.json(
        { error: 'Cet article fait partie d\'une commande et ne peut pas être supprimé. Utilisez le bouton de statut pour le remettre "Disponible" si besoin.' },
        { status: 400 }
      )
    }

    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
