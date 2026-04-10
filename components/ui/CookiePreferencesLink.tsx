'use client'

export default function CookiePreferencesLink() {
  const handleReset = () => {
    document.cookie = 'brocante-consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.reload()
  }

  return (
    <button
      onClick={handleReset}
      className="text-cream/40 hover:text-cream/70 text-xs font-inter transition-colors"
    >
      Gérer mes cookies
    </button>
  )
}
