import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'
import { z } from 'zod'
import type { Category, Condition } from '@prisma/client'

const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.string(),
  condition: z.string(),
  images: z.array(z.string()).min(1),
  featured: z.boolean().optional(),
  weight: z.number().optional().nullable(),
  dimensions: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  sortOrder: z.number().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const status = searchParams.get('status')

  const products = await prisma.product.findMany({
    where: {
      ...(category && { category: category as any }),
      ...(status && { status: status as any }),
    },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = productSchema.parse(body)

    const slug = slugify(data.title)

    // Ensure unique slug
    const existing = await prisma.product.findUnique({ where: { slug } })
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    const product = await prisma.product.create({
      data: {
        ...data,
        slug: finalSlug,
        category: data.category as Category,
        condition: data.condition as Condition,
        featured: data.featured ?? false,
        tags: data.tags ?? [],
        sortOrder: data.sortOrder ?? 0,
        weight: data.weight ?? null,
        dimensions: data.dimensions ?? null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
