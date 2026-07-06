import { useState } from 'react'
import './Faq.css'

export default function Faq({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <div className="faq">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className={`faq__item ${isOpen ? 'is-open' : ''}`}>
            <button
              className="faq__q"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span>{item.q}</span>
              <span className="faq__icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
            <div className="faq__a">
              <p>{item.a}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
