'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="btn-ghost gap-2 text-sm text-stone-500"
    >
      <LogOut size={14} />
      Déconnexion
    </button>
  )
}
