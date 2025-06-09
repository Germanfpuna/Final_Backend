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
import { vehiculosAPI, clientesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const GestionVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [vehiculoActual, setVehiculoActual] = useState({
    id: null,
    marca: '',
    modelo: '',
    anio: new Date().getFullYear(),
    chapa: '',
    tipo: 'coche', // Match backend enum values
    clienteId: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [vehiculosRes, clientesRes] = await Promise.all([
        vehiculosAPI.getAll(),
        clientesAPI.getAll()
      ]);
      setVehiculos(vehiculosRes.data);
      setClientes(clientesRes.data);
    } catch (error) {
      setError('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setVehiculoActual({
      id: null,
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      chapa: '',
      tipo: 'coche',
      clienteId: ''
    });
    setEditando(false);
    setShowModal(true);
  };

  const abrirModalEditar = (vehiculo) => {
    setVehiculoActual({
      id: vehiculo.id,
      marca: vehiculo.marca || '',
      modelo: vehiculo.modelo || '',
      anio: vehiculo.anio || new Date().getFullYear(),
      chapa: vehiculo.chapa || '',
      tipo: vehiculo.tipo || 'coche',
      clienteId: vehiculo.clienteId || ''
    });
    setEditando(true);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(false);
  };

  const guardarVehiculo = async () => {
    try {
      setLoading(true);
      setError('');

      // Only send fields that exist in VehiculoEntity
      const vehiculoData = {
        marca: vehiculoActual.marca,
        modelo: vehiculoActual.modelo,
        anio: parseInt(vehiculoActual.anio),
        chapa: vehiculoActual.chapa,
        tipo: vehiculoActual.tipo,
        clienteId: parseInt(vehiculoActual.clienteId)
      };

      if (editando) {
        await vehiculosAPI.update(vehiculoActual.id, vehiculoData);
        setSuccess('Vehículo actualizado exitosamente');
      } else {
        await vehiculosAPI.create(vehiculoData);
        setSuccess('Vehículo creado exitosamente');
      }

      await cargarDatos();
      cerrarModal();
    } catch (error) {
      setError('Error al guardar vehículo: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const eliminarVehiculo = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este vehículo?')) {
      try {
        setLoading(true);
        await vehiculosAPI.delete(id);
        setSuccess('Vehículo eliminado exitosamente');
        await cargarDatos();
      } catch (error) {
        setError('Error al eliminar vehículo: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getTipoBadge = (tipo) => {
    switch (tipo) {
      case 'coche': return 'primary';
      case 'camioneta': return 'success';
      case 'moto': return 'warning';
      case 'camion': return 'danger';
      default: return 'secondary';
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'coche': return '🚗 Coche';
      case 'camioneta': return '🚙 Camioneta';
      case 'moto': return '🏍️ Moto';
      case 'camion': return '🚛 Camión';
      default: return tipo;
    }
  };

  const getClienteNombre = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🚗 Gestión de Vehículos</h2>
        <Button variant="primary" onClick={abrirModalNuevo}>
          ➕ Nuevo Vehículo
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
          <h5 className="mb-0">📋 Lista de Vehículos ({vehiculos.length})</h5>
        </Card.Header>
        <Card.Body>
          {loading && vehiculos.length === 0 ? (
            <LoadingSpinner message="Cargando vehículos..." />
          ) : vehiculos.length === 0 ? (
            <div className="text-center py-4">
              <div className="mb-3" style={{ fontSize: '4rem' }}>🚗</div>
              <h5>No hay vehículos registrados</h5>
              <p className="text-muted">Comienza agregando el primer vehículo.</p>
              <Button variant="primary" onClick={abrirModalNuevo}>
                ➕ Agregar Vehículo
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Chapa</th>
                    <th>Vehículo</th>
                    <th>Año</th>
                    <th>Tipo</th>
                    <th>Cliente</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {vehiculos.map(vehiculo => (
                    <tr key={vehiculo.id}>
                      <td>
                        <Badge bg="secondary">#{vehiculo.id}</Badge>
                      </td>
                      <td>
                        <strong className="text-primary">{vehiculo.chapa}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{vehiculo.marca} {vehiculo.modelo}</strong>
                        </div>
                      </td>
                      <td>{vehiculo.anio}</td>
                      <td>
                        <Badge bg={getTipoBadge(vehiculo.tipo)}>
                          {getTipoLabel(vehiculo.tipo)}
                        </Badge>
                      </td>
                      <td>
                        <small>{getClienteNombre(vehiculo.clienteId)}</small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => abrirModalEditar(vehiculo)}
                            title="Editar"
                          >
                            ✏️
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => eliminarVehiculo(vehiculo.id)}
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

      {/* Modal para crear/editar vehículo */}
      <Modal show={showModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editando ? '✏️ Editar Vehículo' : '➕ Nuevo Vehículo'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cliente *</Form.Label>
                  <Form.Select
                    value={vehiculoActual.clienteId}
                    onChange={(e) => setVehiculoActual(prev => ({
                      ...prev, 
                      clienteId: e.target.value
                    }))}
                    required
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre} - {cliente.rucCi}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chapa *</Form.Label>
                  <Form.Control
                    type="text"
                    value={vehiculoActual.chapa}
                    onChange={(e) => setVehiculoActual(prev => ({
                      ...prev, 
                      chapa: e.target.value.toUpperCase()
                    }))}
                    placeholder="ABC123"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Marca *</Form.Label>
                  <Form.Control
                    type="text"
                    value={vehiculoActual.marca}
                    onChange={(e) => setVehiculoActual(prev => ({
                      ...prev, 
                      marca: e.target.value
                    }))}
                    placeholder="Toyota, Ford, etc."
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Modelo *</Form.Label>
                  <Form.Control
                    type="text"
                    value={vehiculoActual.modelo}
                    onChange={(e) => setVehiculoActual(prev => ({
                      ...prev, 
                      modelo: e.target.value
                    }))}
                    placeholder="Corolla, Fiesta, etc."
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Año *</Form.Label>
                  <Form.Control
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={vehiculoActual.anio}
                    onChange={(e) => setVehiculoActual(prev => ({
                      ...prev, 
                      anio: parseInt(e.target.value)
                    }))}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo *</Form.Label>
                  <Form.Select
                    value={vehiculoActual.tipo}
                    onChange={(e) => setVehiculoActual(prev => ({
                      ...prev, 
                      tipo: e.target.value
                    }))}
                  >
                    <option value="moto">🏍️ Moto</option>
                    <option value="coche">🚗 Coche</option>
                    <option value="camioneta">🚙 Camioneta</option>
                    <option value="camion">🚛 Camión</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={guardarVehiculo}
            disabled={loading || !vehiculoActual.marca || !vehiculoActual.modelo || !vehiculoActual.chapa || !vehiculoActual.clienteId}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Guardando...
              </>
            ) : (
              <>
                💾 {editando ? 'Actualizar' : 'Crear'} Vehículo
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionVehiculos;