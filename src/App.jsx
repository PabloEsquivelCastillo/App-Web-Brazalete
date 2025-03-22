import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap CSS
<<<<<<< HEAD
import { ToastContainer } from 'react-toastify'
=======
import { AuthProvider } from './context/AuthContext.jsx'
import "./css/Tablas.css"
import "./css/Paginacion.css"
import { Container } from 'react-bootstrap'




>>>>>>> origin/juan-dev
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
<<<<<<< HEAD
      <AppRoutes/>
      <ToastContainer/>
=======
      <Container fluid className="app-container">
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Container>
>>>>>>> origin/juan-dev
    </>
  )
}

export default App
