import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Pastikan ini mengarah ke index.css tempat kita menaruh Tailwind
import { registerSW } from 'virtual:pwa-register'
import PopupProvider from './components/PopupProvider.jsx'

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PopupProvider>
      <App />
    </PopupProvider>
  </React.StrictMode>,
)
