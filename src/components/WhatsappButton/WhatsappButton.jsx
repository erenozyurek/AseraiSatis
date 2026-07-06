import './WhatsappButton.css'

/* Sağ altta sabit WhatsApp butonu (şablon) */
export default function WhatsappButton({ phone = '905000000000' }) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(
    'Merhaba, Aserai hakkında bilgi almak istiyorum.',
  )}`

  return (
    <a
      href={href}
      className="wa-fab"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile yazın"
    >
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4h.01C24.6 28.8 30 23.4 30 16.8 30 9.9 24.6 3 16 3zm0 23.4c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.8 1 1-4.7-.3-.5c-1-1.6-1.5-3.4-1.5-5.3C5 9.5 9.9 5 16 5c5.5 0 10 4.5 10 10.8 0 5.4-4.5 10.6-10 10.6zm5.5-7.9c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4z"
        />
      </svg>
    </a>
  )
}
