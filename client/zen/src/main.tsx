import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { UserauthProvider } from './context/userauth.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <UserauthProvider>
    <App />
    </UserauthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
