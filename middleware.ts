import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdminPath = req.nextUrl.pathname.startsWith('/admin')
    const isApiAdminPath = req.nextUrl.pathname.startsWith('/api/products') ||
      req.nextUrl.pathname.startsWith('/api/orders') ||
      req.nextUrl.pathname.startsWith('/api/upload')

    if ((isAdminPath || isApiAdminPath) && token?.role !== 'ADMIN') {
      if (isApiAdminPath) {
        return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === '/admin/login'
        if (isLoginPage) return true
        if (req.nextUrl.pathname.startsWith('/admin')) return !!token
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*', '/api/products/:path*', '/api/orders/:path*', '/api/upload'],
}
