import { prisma } from '@/lib/prisma'

const FREE_SHIPPING_THRESHOLD = 150

export async function calculateShipping(totalWeight: number, orderTotal: number): Promise<number> {
  // Free shipping over 150€
  if (orderTotal >= FREE_SHIPPING_THRESHOLD) return 0

  const rule = await prisma.shippingRule.findFirst({
    where: {
      active: true,
      minWeight: { lte: totalWeight },
      maxWeight: { gte: totalWeight },
    },
    orderBy: { minWeight: 'asc' },
  })

  return rule?.cost ?? 25 // fallback to highest rate
}

export async function getShippingRules() {
  return prisma.shippingRule.findMany({
    where: { active: true },
    orderBy: { minWeight: 'asc' },
  })
}
