import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { AuthProvider } from './context/AuthContext.jsx'
import "./css/Tablas.css"
import "./css/Paginacion.css"
import { Container } from 'react-bootstrap'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Container fluid className="app-container">
        <AuthProvider>
          <AppRoutes />
          <ToastContainer position="top-right" autoClose={5000} />
        </AuthProvider>
      </Container>
    </>
  )
}

export default App