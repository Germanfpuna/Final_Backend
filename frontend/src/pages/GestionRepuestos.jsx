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
  Alert,
  InputGroup
} from 'react-bootstrap';
import { repuestosAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const GestionRepuestos = () => {
  const [repuestos, setRepuestos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [repuestoActual, setRepuestoActual] = useState({
    id: null,
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stockActual: '',
    stockMinimo: ''
  });

  useEffect(() => {
    cargarRepuestos();
  }, []);

  const cargarRepuestos = async () => {
    try {
      setLoading(true);
      const response = await repuestosAPI.getAll();
      setRepuestos(response.data);
    } catch (error) {
      setError('Error al cargar repuestos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtrarRepuestos = () => {
    if (!searchTerm) return repuestos;
    
    return repuestos.filter(repuesto => 
      repuesto.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repuesto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repuesto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const abrirModalNuevo = () => {
    setRepuestoActual({
      id: null,
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: '',
      stockActual: '',
      stockMinimo: ''
    });
    setEditando(false);
    setShowModal(true);
  };

  const abrirModalEditar = (repuesto) => {
    setRepuestoActual({
      ...repuesto,
      precio: repuesto.precio || '',
      stockActual: repuesto.stockActual || '',
      stockMinimo: repuesto.stockMinimo || ''
    });
    setEditando(true);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(false);
  };

  const guardarRepuesto = async () => {
    try {
      setLoading(true);
      setError('');

      // Only send fields that exist in RepuestoEntity
      const repuestoData = {
        codigo: repuestoActual.codigo,
        nombre: repuestoActual.nombre,
        descripcion: repuestoActual.descripcion || null,
        precio: repuestoActual.precio ? parseFloat(repuestoActual.precio) : null,
        stockActual: repuestoActual.stockActual ? parseInt(repuestoActual.stockActual) : 0,
        stockMinimo: repuestoActual.stockMinimo ? parseInt(repuestoActual.stockMinimo) : 0
      };

      if (editando) {
        await repuestosAPI.update(repuestoActual.id, repuestoData);
        setSuccess('Repuesto actualizado exitosamente');
      } else {
        await repuestosAPI.create(repuestoData);
        setSuccess('Repuesto creado exitosamente');
      }

      await cargarRepuestos();
      cerrarModal();
    } catch (error) {
      setError('Error al guardar repuesto: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const eliminarRepuesto = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este repuesto?')) {
      try {
        setLoading(true);
        await repuestosAPI.delete(id);
        setSuccess('Repuesto eliminado exitosamente');
        await cargarRepuestos();
      } catch (error) {
        setError('Error al eliminar repuesto: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStockBadge = (stockActual, stockMinimo) => {
    if (stockActual <= 0) return 'danger';
    if (stockActual <= stockMinimo) return 'warning';
    return 'success';
  };

  const repuestosFiltrados = filtrarRepuestos();
  const valorTotalStock = repuestosFiltrados.reduce((total, rep) => 
    total + (parseFloat(rep.precio || 0) * parseInt(rep.stockActual || 0)), 0
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🔩 Gestión de Repuestos</h2>
        <Button variant="primary" onClick={abrirModalNuevo}>
          ➕ Nuevo Repuesto
        </Button>
      </div>

      {error && <ErrorAlert message={error} onClose={() => setError('')} />}
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          ✅ {success}
        </Alert>
      )}

      {/* Filtros y estadísticas */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Buscar por código, nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
              🔄
            </Button>
          </InputGroup>
        </Col>
        <Col md={6}>
          <div className="d-flex justify-content-end">
            <Card className="border-0">
              <Card.Body className="p-2">
                <small className="text-muted">
                  <strong>Total productos:</strong> {repuestosFiltrados.length} | 
                  <strong> Valor stock:</strong> ₲ {valorTotalStock.toLocaleString()}
                </small>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      <Card>
        <Card.Header>
          <h5 className="mb-0">📦 Inventario de Repuestos ({repuestosFiltrados.length})</h5>
        </Card.Header>
        <Card.Body>
          {loading && repuestos.length === 0 ? (
            <LoadingSpinner message="Cargando repuestos..." />
          ) : repuestosFiltrados.length === 0 ? (
            <div className="text-center py-4">
              <div className="mb-3" style={{ fontSize: '4rem' }}>🔩</div>
              <h5>
                {searchTerm ? 'No se encontraron repuestos' : 'No hay repuestos registrados'}
              </h5>
              <p className="text-muted">
                {searchTerm ? 
                  'Intenta con otros términos de búsqueda.' :
                  'Comienza agregando el primer repuesto al inventario.'
                }
              </p>
              {!searchTerm && (
                <Button variant="primary" onClick={abrirModalNuevo}>
                  ➕ Agregar Repuesto
                </Button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover size="sm">
                <thead className="table-dark">
                  <tr>
                    <th>Código</th>
                    <th>Repuesto</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {repuestosFiltrados.map(repuesto => (
                    <tr key={repuesto.id}>
                      <td>
                        <Badge bg="dark">{repuesto.codigo}</Badge>
                      </td>
                      <td>
                        <strong>{repuesto.nombre}</strong>
                      </td>
                      <td>
                        <small className="text-muted">
                          {repuesto.descripcion || 'Sin descripción'}
                        </small>
                      </td>
                      <td>
                        <strong>₲ {parseFloat(repuesto.precio || 0).toLocaleString()}</strong>
                      </td>
                      <td>
                        <div>
                          <Badge bg={getStockBadge(repuesto.stockActual, repuesto.stockMinimo)}>
                            {repuesto.stockActual || 0}
                          </Badge>
                          {repuesto.stockMinimo && (
                            <small className="d-block text-muted">
                              Min: {repuesto.stockMinimo}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        {repuesto.stockActual <= 0 ? (
                          <Badge bg="danger">Sin Stock</Badge>
                        ) : repuesto.stockActual <= repuesto.stockMinimo ? (
                          <Badge bg="warning">Stock Bajo</Badge>
                        ) : (
                          <Badge bg="success">Disponible</Badge>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => abrirModalEditar(repuesto)}
                            title="Editar"
                          >
                            ✏️
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => eliminarRepuesto(repuesto.id)}
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

      {/* Modal para crear/editar repuesto */}
      <Modal show={showModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editando ? '✏️ Editar Repuesto' : '➕ Nuevo Repuesto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Código *</Form.Label>
                  <Form.Control
                    type="text"
                    value={repuestoActual.codigo}
                    onChange={(e) => setRepuestoActual(prev => ({
                      ...prev, 
                      codigo: e.target.value.toUpperCase()
                    }))}
                    placeholder="Ej: REP001"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    value={repuestoActual.nombre}
                    onChange={(e) => setRepuestoActual(prev => ({
                      ...prev, 
                      nombre: e.target.value
                    }))}
                    placeholder="Nombre del repuesto"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={repuestoActual.descripcion}
                onChange={(e) => setRepuestoActual(prev => ({
                  ...prev, 
                  descripcion: e.target.value
                }))}
                placeholder="Descripción detallada del repuesto"
              />
            </Form.Group>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio (₲) *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={repuestoActual.precio}
                    onChange={(e) => setRepuestoActual(prev => ({
                      ...prev, 
                      precio: e.target.value
                    }))}
                    placeholder="Precio de venta"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Actual</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={repuestoActual.stockActual}
                    onChange={(e) => setRepuestoActual(prev => ({
                      ...prev, 
                      stockActual: e.target.value
                    }))}
                    placeholder="Cantidad disponible"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Mínimo</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={repuestoActual.stockMinimo}
                    onChange={(e) => setRepuestoActual(prev => ({
                      ...prev, 
                      stockMinimo: e.target.value
                    }))}
                    placeholder="Stock mínimo"
                  />
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
            onClick={guardarRepuesto}
            disabled={loading || !repuestoActual.codigo || !repuestoActual.nombre || !repuestoActual.precio}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Guardando...
              </>
            ) : (
              <>
                💾 {editando ? 'Actualizar' : 'Crear'} Repuesto
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionRepuestos;