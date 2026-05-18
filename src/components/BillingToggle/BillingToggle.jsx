import './BillingToggle.css'

export default function BillingToggle({ billing, onChange }) {
  return (
    <div className="billing">
      <div className="billing__switch" role="tablist" aria-label="Ödeme dönemi">
        <button
          role="tab"
          aria-selected={billing === 'monthly'}
          className={`billing__opt ${billing === 'monthly' ? 'is-active' : ''}`}
          onClick={() => onChange('monthly')}
        >
          Aylık
        </button>
        <button
          role="tab"
          aria-selected={billing === 'yearly'}
          className={`billing__opt ${billing === 'yearly' ? 'is-active' : ''}`}
          onClick={() => onChange('yearly')}
        >
          Yıllık
        </button>
        <span
          className={`billing__thumb ${billing === 'yearly' ? 'is-yearly' : ''}`}
          aria-hidden="true"
        />
      </div>
      <span className="billing__save">%25’e varan indirim</span>
    </div>
  )
}
