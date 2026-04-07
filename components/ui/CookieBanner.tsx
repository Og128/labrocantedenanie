'use client'

import CookieConsent from 'react-cookie-consent'

export default function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accepter"
      declineButtonText="Refuser"
      enableDeclineButton
      cookieName="brocante-consent"
      style={{
        background: '#2d2416',
        color: '#FAF7F2',
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        alignItems: 'center',
        padding: '16px 24px',
      }}
      buttonStyle={{
        background: '#C4623A',
        color: '#FDFBF8',
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
        fontWeight: '500',
        padding: '8px 20px',
        border: 'none',
        borderRadius: '2px',
        cursor: 'pointer',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#FAF7F2',
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
        padding: '8px 16px',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '2px',
        cursor: 'pointer',
      }}
      expires={365}
    >
      Nous utilisons des cookies pour améliorer votre expérience et mesurer notre audience.{' '}
      <a
        href="/confidentialite"
        style={{ color: '#f5c5ad', textDecoration: 'underline' }}
      >
        En savoir plus
      </a>
    </CookieConsent>
  )
}
