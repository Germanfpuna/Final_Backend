import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Taller Mecánico
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/"
              active={location.pathname === '/'}
            >
              Inicio
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/registro-servicio"
              active={location.pathname === '/registro-servicio'}
            >
              Nuevo Servicio
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/consulta-servicios"
              active={location.pathname === '/consulta-servicios'}
            >
              Consultar Servicios

            </Nav.Link>
            <NavDropdown title="Gestión" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/clientes">
                Clientes
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/vehiculos">
                Vehículos
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/mecanicos">
                Mecánicos
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/repuestos">
                Repuestos
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;