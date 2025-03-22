import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap CSS
import { AuthProvider } from './context/AuthContext.jsx'
import "./css/Tablas.css"
import "./css/Paginacion.css"
import { Container } from 'react-bootstrap'




function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Container fluid className="app-container">
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Container>
    </>
  )
}

export default App
