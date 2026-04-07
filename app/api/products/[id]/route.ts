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
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

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
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params

  // Check if product has an order
  const orderItem = await prisma.orderItem.findFirst({ where: { productId: id } })
  if (orderItem) {
    return NextResponse.json(
      { error: 'Impossible de supprimer un article commandé' },
      { status: 400 }
    )
  }

  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
