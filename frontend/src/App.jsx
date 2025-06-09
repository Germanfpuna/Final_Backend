import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import RegistroServicio from './pages/RegistroServicio'
import ConsultaServicios from './pages/ConsultaServicios'
import DetalleServicio from './pages/DetalleServicios'
import GestionClientes from './pages/GestionClientes'
import GestionVehiculos from './pages/GestionVehiculos'
import GestionMecanicos from './pages/GestionMecanicos'
import GestionRepuestos from './pages/GestionRepuestos'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Container fluid className="mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro-servicio" element={<RegistroServicio />} />
            <Route path="/consulta-servicios" element={<ConsultaServicios />} />
            <Route path="/detalle-servicio/:id" element={<DetalleServicio />} />
            <Route path="/clientes" element={<GestionClientes />} />
            <Route path="/vehiculos" element={<GestionVehiculos />} />
            <Route path="/mecanicos" element={<GestionMecanicos />} />
            <Route path="/repuestos" element={<GestionRepuestos />} />
          </Routes>
        </Container>
      </div>
    </Router>
  )
}

export default App
