import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'

const paypalOptions = {
  clientId: 'sb',
  currency: 'USD',
  intent: 'capture'
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <PayPalScriptProvider options={paypalOptions}>
        <App />
      </PayPalScriptProvider>
    </ErrorBoundary>
  </StrictMode>,
)
