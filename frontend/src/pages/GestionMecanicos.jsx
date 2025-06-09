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
import { mecanicosAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const GestionMecanicos = () => {
  const [mecanicos, setMecanicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(false);
  const [mecanicoActual, setMecanicoActual] = useState({
    id: null,
    nombre: '',
    direccion: '',
    telefono: '',
    fechaIngreso: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
    especialidad: ''
  });

  const especialidades = [
    'Motor',
    'Transmisión',
    'Frenos',
    'Suspensión',
    'Electricidad',
    'Aire Acondicionado',
    'Carrocería',
    'Pintura',
    'General'
  ];

  useEffect(() => {
    cargarMecanicos();
  }, []);

  const cargarMecanicos = async () => {
    try {
      setLoading(true);
      const response = await mecanicosAPI.getAll();
      setMecanicos(response.data);
    } catch (error) {
      setError('Error al cargar mecánicos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setMecanicoActual({
      id: null,
      nombre: '',
      direccion: '',
      telefono: '',
      fechaIngreso: new Date().toISOString().split('T')[0],
      especialidad: ''
    });
    setEditando(false);
    setShowModal(true);
  };

  const abrirModalEditar = (mecanico) => {
    setMecanicoActual({
      id: mecanico.id,
      nombre: mecanico.nombre || '',
      direccion: mecanico.direccion || '',
      telefono: mecanico.telefono || '',
      fechaIngreso: mecanico.fechaIngreso || new Date().toISOString().split('T')[0],
      especialidad: mecanico.especialidad || ''
    });
    setEditando(true);
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setEditando(false);
  };

  const guardarMecanico = async () => {
    try {
      setLoading(true);
      setError('');

      // Only send fields that exist in MecanicoEntity
      const mecanicoData = {
        nombre: mecanicoActual.nombre,
        direccion: mecanicoActual.direccion,
        telefono: mecanicoActual.telefono,
        fechaIngreso: mecanicoActual.fechaIngreso,
        especialidad: mecanicoActual.especialidad
      };

      if (editando) {
        await mecanicosAPI.update(mecanicoActual.id, mecanicoData);
        setSuccess('Mecánico actualizado exitosamente');
      } else {
        await mecanicosAPI.create(mecanicoData);
        setSuccess('Mecánico creado exitosamente');
      }

      await cargarMecanicos();
      cerrarModal();
    } catch (error) {
      setError('Error al guardar mecánico: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const eliminarMecanico = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este mecánico?')) {
      try {
        setLoading(true);
        await mecanicosAPI.delete(id);
        setSuccess('Mecánico eliminado exitosamente');
        await cargarMecanicos();
      } catch (error) {
        setError('Error al eliminar mecánico: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const getEspecialidadBadge = (especialidad) => {
    switch (especialidad) {
      case 'Motor': return 'danger';
      case 'Transmisión': return 'warning';
      case 'Frenos': return 'primary';
      case 'Suspensión': return 'success';
      case 'Electricidad': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PY');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>👨‍🔧 Gestión de Mecánicos</h2>
        <Button variant="primary" onClick={abrirModalNuevo}>
          ➕ Nuevo Mecánico
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
          <h5 className="mb-0">📋 Lista de Mecánicos ({mecanicos.length})</h5>
        </Card.Header>
        <Card.Body>
          {loading && mecanicos.length === 0 ? (
            <LoadingSpinner message="Cargando mecánicos..." />
          ) : mecanicos.length === 0 ? (
            <div className="text-center py-4">
              <div className="mb-3" style={{ fontSize: '4rem' }}>👨‍🔧</div>
              <h5>No hay mecánicos registrados</h5>
              <p className="text-muted">Comienza agregando el primer mecánico.</p>
              <Button variant="primary" onClick={abrirModalNuevo}>
                ➕ Agregar Mecánico
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Teléfono</th>
                    <th>Dirección</th>
                    <th>Fecha Ingreso</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mecanicos.map(mecanico => (
                    <tr key={mecanico.id}>
                      <td>
                        <Badge bg="secondary">#{mecanico.id}</Badge>
                      </td>
                      <td>
                        <strong>{mecanico.nombre}</strong>
                      </td>
                      <td>
                        <Badge bg={getEspecialidadBadge(mecanico.especialidad)}>
                          {mecanico.especialidad}
                        </Badge>
                      </td>
                      <td>
                        {mecanico.telefono ? (
                          <span>📞 {mecanico.telefono}</span>
                        ) : (
                          <span className="text-muted">Sin teléfono</span>
                        )}
                      </td>
                      <td>
                        <small className="text-muted">
                          {mecanico.direccion || 'Sin dirección'}
                        </small>
                      </td>
                      <td>
                        <small>{formatDate(mecanico.fechaIngreso)}</small>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => abrirModalEditar(mecanico)}
                            title="Editar"
                          >
                            ✏️
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => eliminarMecanico(mecanico.id)}
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

      {/* Modal para crear/editar mecánico */}
      <Modal show={showModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editando ? '✏️ Editar Mecánico' : '➕ Nuevo Mecánico'}
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
                    value={mecanicoActual.nombre}
                    onChange={(e) => setMecanicoActual(prev => ({
                      ...prev, 
                      nombre: e.target.value
                    }))}
                    placeholder="Nombre completo del mecánico"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Especialidad *</Form.Label>
                  <Form.Select
                    value={mecanicoActual.especialidad}
                    onChange={(e) => setMecanicoActual(prev => ({
                      ...prev, 
                      especialidad: e.target.value
                    }))}
                    required
                  >
                    <option value="">Seleccione una especialidad</option>
                    {especialidades.map(esp => (
                      <option key={esp} value={esp}>{esp}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="tel"
                    value={mecanicoActual.telefono}
                    onChange={(e) => setMecanicoActual(prev => ({
                      ...prev, 
                      telefono: e.target.value
                    }))}
                    placeholder="Número de teléfono"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Ingreso *</Form.Label>
                  <Form.Control
                    type="date"
                    value={mecanicoActual.fechaIngreso}
                    onChange={(e) => setMecanicoActual(prev => ({
                      ...prev, 
                      fechaIngreso: e.target.value
                    }))}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={mecanicoActual.direccion}
                onChange={(e) => setMecanicoActual(prev => ({
                  ...prev, 
                  direccion: e.target.value
                }))}
                placeholder="Dirección del mecánico"
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
            onClick={guardarMecanico}
            disabled={loading || !mecanicoActual.nombre || !mecanicoActual.especialidad || !mecanicoActual.fechaIngreso}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Guardando...
              </>
            ) : (
              <>
                💾 {editando ? 'Actualizar' : 'Crear'} Mecánico
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GestionMecanicos;