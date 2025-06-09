import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col, 
  Table,
  Modal,
  Badge,
  Alert
} from 'react-bootstrap';
import { clientesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const GestionClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [clienteActual, setClienteActual] = useState({
    id: null,
    nombre: '',
    rucCi: '',
    telefono: '',
    direccion: '',
    tipoCliente: 'regular'
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await clientesAPI.getAll();
      setClientes(response.data);
    } catch (error) {
      setError('Error al cargar clientes: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setClienteActual({
      id: null,
      nombre: '',
      rucCi: '',
      telefono: '',
      direccion: '',
      tipoCliente: 'regular'
    });
    setEditando(false);
    setShowModal(true);
  };

  const abrirModalEditar = (cliente) => {
    setClienteActual(cliente);
    setEditando(true);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setClienteActual({
      id: null,
      nombre: '',
      rucCi: '',
      telefono: '',
      direccion: '',
      tipoCliente: 'regular'
    });
    setEditando(false);
  };

  const guardarCliente = async () => {
    try {
      setLoading(true);
      setError('');

      if (editando) {
        await clientesAPI.update(clienteActual.id, clienteActual);
        setSuccess('Cliente actualizado exitosamente');
      } else {
        await clientesAPI.create(clienteActual);
        setSuccess('Cliente creado exitosamente');
      }

      await cargarClientes();
      cerrarModal();
    } catch (error) {
      setError('Error al guardar cliente: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const eliminarCliente = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      try {
        setLoading(true);
        await clientesAPI.delete(id);
        setSuccess('Cliente eliminado exitosamente');
        await cargarClientes();
      } catch (error) {
        setError('Error al eliminar cliente: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case 'premium': return 'warning';
      case 'vip': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👥 Gestión de Clientes</h2>
        <Button variant="primary" onClick={abrirModalNuevo}>
          ➕ Nuevo Cliente
        </Button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          ✅ {success}
        </Alert>
      )}

      <Card>
        <Card.Header>
          <h5 className="mb-0">📋 Lista de Clientes ({clientes.length})</h5>
        </Card.Header>
        <Card.Body>
          {loading && clientes.length === 0 ? (
            <LoadingSpinner message="Cargando clientes..." />
          ) : clientes.length === 0 ? (
            <div className="text-center py-4">
              <div className="mb-3" style={{ fontSize: '4rem' }}>👥</div>
              <h5>No hay clientes registrados</h5>
              <p className="text-muted">Comienza agregando tu primer cliente.</p>
              <Button variant="primary" onClick={abrirModalNuevo}>
                ➕ Agregar Cliente
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>RUC/CI</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td>
                        <Badge bg="secondary">#{cliente.id}</Badge>
                      </td>
                      <td>
                        <strong>{cliente.nombre}</strong>
                      </td>
                      <td>{cliente.rucCi}</td>
                      <td>
                        {cliente.telefono ? (
                          <span>📞 {cliente.telefono}</span>
                        ) : (
                          <span className="text-muted">Sin teléfono</span>
                        )}
                      </td>
                      <td>
                        <div 
                          className="text-truncate" 
                          style={{maxWidth: '200px'}}
                          title={cliente.direccion}
                        >
                          {cliente.direccion ? (
                            <span>📍 {cliente.direccion}</span>
                          ) : (
                            <span className="text-muted">Sin dirección</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg={getTipoBadge(cliente.tipoCliente)}>
                          {cliente.tipoCliente?.toUpperCase() || 'REGULAR'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => abrirModalEditar(cliente)}
                            title="Editar"
                          >
                            ✏️
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => eliminarCliente(cliente.id)}
                            title="Eliminar"
                          >
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal para crear/editar cliente */}
      <Modal show={showModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editando ? '✏️ Editar Cliente' : '➕ Nuevo Cliente'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    value={clienteActual.nombre}
                    onChange={(e) => setClienteActual(prev => ({
                      ...prev, 
                      nombre: e.target.value
                    }))}
                    placeholder="Nombre completo del cliente"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>RUC/CI *</Form.Label>
                  <Form.Control
                    type="text"
                    value={clienteActual.rucCi}
                    onChange={(e) => setClienteActual(prev => ({
                      ...prev, 
                      rucCi: e.target.value
                    }))}
                    placeholder="RUC o Cédula de Identidad"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    value={clienteActual.telefono}
                    onChange={(e) => setClienteActual(prev => ({
                      ...prev, 
                      telefono: e.target.value
                    }))}
                    placeholder="Número de teléfono"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Cliente</Form.Label>
                  <Form.Select
                    value={clienteActual.tipoCliente}
                    onChange={(e) => setClienteActual(prev => ({
                      ...prev, 
                      tipoCliente: e.target.value
                    }))}
                  >
                    <option value="regular">Regular</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={clienteActual.direccion}
                onChange={(e) => setClienteActual(prev => ({
                  ...prev, 
                  direccion: e.target.value
                }))}
                placeholder="Dirección completa del cliente"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={guardarCliente}
            disabled={loading || !clienteActual.nombre || !clienteActual.rucCi}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Guardando...
              </>
            ) : (
              <>
                💾 {editando ? 'Actualizar' : 'Crear'} Cliente
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionClientes;