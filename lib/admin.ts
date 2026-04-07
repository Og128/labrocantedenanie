import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { Session } from 'next-auth'

export async function requireAdmin(): Promise<
  { session: Session } | { error: NextResponse }
> {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return {
      error: NextResponse.json({ error: 'Non autorisé' }, { status: 401 }),
    }
  }
  return { session }
}
