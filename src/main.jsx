import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { handleOAuthCallback } from './services/googleCalendar.js'

// Token aus URL-Hash lesen wenn wir von Google OAuth zurückkommen
handleOAuthCallback();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
