import {
  BrowserRouter as Router
} from 'react-router-dom'
import { Header } from './components/Header'
import { AuthProvider } from './context/Auth'
import { RoutesApp } from './routes'
import { GlobalStyle } from './styles/global'

export const App = () => {             
  return (
    <>
      <GlobalStyle />
      <Header />
      
      <AuthProvider>
        <Router>
          <RoutesApp />
        </Router>
      </AuthProvider>
    </>
        
  )
}

