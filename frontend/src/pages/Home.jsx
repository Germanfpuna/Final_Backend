import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="jumbotron bg-light p-5 rounded mb-4">
        <h1 className="display-4">Sistema de Gestión de Taller Mecánico</h1>
        <p className="lead">
          Administra servicios, clientes, vehículos y repuestos de manera eficiente.
        </p>
        <hr className="my-4" />
        <p>Comienza registrando un nuevo servicio o consulta el historial existente.</p>
      </div>

      <Row>
        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <span style={{ fontSize: '3rem' }}>📝</span>
              </div>
              <Card.Title>Nuevo Servicio</Card.Title>
              <Card.Text>
                Registra un nuevo servicio mecánico con todos sus detalles.
              </Card.Text>
              <Button as={Link} to="/registro-servicio" variant="primary">
                Crear Servicio
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <span style={{ fontSize: '3rem' }}>🔍</span>
              </div>
              <Card.Title>Consultar Servicios</Card.Title>
              <Card.Text>
                Busca y revisa el historial de servicios realizados.
              </Card.Text>
              <Button as={Link} to="/consulta-servicios" variant="success">
                Consultar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <span style={{ fontSize: '3rem' }}>👥</span>
              </div>
              <Card.Title>Gestión de Clientes</Card.Title>
              <Card.Text>
                Administra la información de tus clientes.
              </Card.Text>
              <Button as={Link} to="/clientes" variant="info">
                Gestionar
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <span style={{ fontSize: '3rem' }}>🔧</span>
              </div>
              <Card.Title>Recursos</Card.Title>
              <Card.Text>
                Gestiona vehículos, mecánicos y repuestos.
              </Card.Text>
              <Button as={Link} to="/vehiculos" variant="warning">
                Ver Recursos
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Home;