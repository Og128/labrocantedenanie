import { prisma } from '@/lib/prisma'

export async function calculateShipping(orderTotal: number): Promise<number> {
  const rule = await prisma.shippingRule.findFirst({
    where: {
      active: true,
      minPrice: { lte: orderTotal },
      maxPrice: { gte: orderTotal },
    },
    orderBy: { minPrice: 'asc' },
  })

  return rule?.cost ?? 9.9 // fallback
}

export async function getShippingRules() {
  return prisma.shippingRule.findMany({
    where: { active: true },
    orderBy: { minPrice: 'asc' },
  })
}
