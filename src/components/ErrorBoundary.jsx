import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[Aserai] Beklenmeyen arayüz hatası', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-error" role="alert">
          <div className="container app-error__inner">
            <span className="eyebrow">Beklenmeyen hata</span>
            <h1>Bu sayfa şu anda görüntülenemiyor</h1>
            <p>
              Sayfayı yenileyebilir veya güvenli biçimde ana sayfaya
              dönebilirsiniz.
            </p>
            <div className="app-error__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => window.location.reload()}
              >
                Sayfayı Yenile
              </button>
              <a className="btn btn--ghost" href="/">
                Ana Sayfaya Dön
              </a>
            </div>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
