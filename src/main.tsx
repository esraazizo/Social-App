import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import TokenContextProvider from './Components/Context/TokenContextProvider'
import UserContextProvider from './Components/Context/UserContext'
import NotificationProvider from './Components/Context/NotificationContext'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TokenContextProvider>
      <UserContextProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </UserContextProvider>
    </TokenContextProvider>

  </StrictMode>,
)
