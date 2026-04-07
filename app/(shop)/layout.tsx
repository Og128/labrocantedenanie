import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="pt-[calc(40px+64px)]">{/* 40px topbar + 64px navbar */}
        {children}
      </main>
      <Footer />
    </>
  )
}
