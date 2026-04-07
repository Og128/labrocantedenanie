'use client'

import { signOut, useSession } from 'next-auth/react'
import { LogOut, User } from 'lucide-react'

export default function AdminHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-stone-200 px-6 py-3 flex items-center justify-between">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-inter text-stone-600">
          <div className="w-7 h-7 bg-terracotta-100 rounded-full flex items-center justify-center">
            <User size={14} className="text-terracotta-600" />
          </div>
          <span>{session?.user?.email}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-red-500 transition-colors font-inter"
        >
          <LogOut size={14} />
          Déconnexion
        </button>
      </div>
    </header>
  )
}
