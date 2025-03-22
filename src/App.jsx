import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap CSS
import { ToastContainer } from 'react-toastify'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppRoutes/>
      <ToastContainer/>
    </>
  )
}

export default App
