import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { UserauthProvider } from './context/Userauth.tsx'
import { SocketProvider } from './context/Socketcontext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <UserauthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </UserauthProvider>
    </BrowserRouter>
)
