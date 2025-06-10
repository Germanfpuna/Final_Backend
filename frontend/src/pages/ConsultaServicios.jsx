import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col, 
  Table,
  Badge,
  InputGroup
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { serviciosAPI, clientesAPI, vehiculosAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const ConsultaServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [serviciosEnriquecidos, setServiciosEnriquecidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filtros
  const [filtros, setFiltros] = useState({
    clienteId: '',
    fechaInicio: '',
    fechaFin: '',
    vehiculoId: '',
    searchTerm: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [serviciosRes, clientesRes] = await Promise.all([
        serviciosAPI.getAll(),
        clientesAPI.getAll()
      ]);
      
      const serviciosData = serviciosRes.data;
      setServicios(serviciosData);
      setClientes(clientesRes.data);
      
      // Enriquecer servicios con información de cliente y vehículo
      await enriquecerServicios(serviciosData);
      
    } catch (error) {
      setError('Error al cargar datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const enriquecerServicios = async (serviciosData) => {
    try {
      const serviciosConDetalles = await Promise.all(
        serviciosData.map(async (servicio) => {
          try {
            // Obtener información del vehículo
            const vehiculoResponse = await vehiculosAPI.getById(servicio.vehiculoId);
            const vehiculo = vehiculoResponse.data;
            
            // Obtener información del cliente
            const clienteResponse = await clientesAPI.getById(vehiculo.clienteId);
            const cliente = clienteResponse.data;
            
            return {
              ...servicio,
              vehiculo: vehiculo,
              cliente: cliente
            };
          } catch (err) {
            console.log(`Error cargando detalles para servicio ${servicio.id}:`, err);
            return {
              ...servicio,
              vehiculo: null,
              cliente: null
            };
          }
        })
      );
      
      setServiciosEnriquecidos(serviciosConDetalles);
    } catch (error) {
      console.error('Error enriqueciendo servicios:', error);
      setServiciosEnriquecidos(serviciosData);
    }
  };

  const aplicarFiltros = async () => {
    try {
      setLoading(true);
      setError('');
      
      let serviciosFiltrados = [];
      
      if (filtros.clienteId) {
        // Filtrar por cliente - necesitamos obtener los vehículos del cliente primero
        const vehiculosResponse = await vehiculosAPI.buscarPorCliente(filtros.clienteId);
        const vehiculosCliente = vehiculosResponse.data;
        const vehiculoIds = vehiculosCliente.map(v => v.id);
        
        serviciosFiltrados = servicios.filter(servicio => 
          vehiculoIds.includes(servicio.vehiculoId)
        );
      } else if (filtros.vehiculoId) {
        serviciosFiltrados = servicios.filter(servicio => 
          servicio.vehiculoId === parseInt(filtros.vehiculoId)
        );
      } else if (filtros.fechaInicio && filtros.fechaFin) {
        const fechaInicio = new Date(filtros.fechaInicio);
        const fechaFin = new Date(filtros.fechaFin);
        
        serviciosFiltrados = servicios.filter(servicio => {
          const fechaServicio = new Date(servicio.fecha);
          return fechaServicio >= fechaInicio && fechaServicio <= fechaFin;
        });
      } else {
        serviciosFiltrados = [...servicios];
      }
      
      // Enriquecer los servicios filtrados
      await enriquecerServicios(serviciosFiltrados);
      
    } catch (error) {
      setError('Error al aplicar filtros: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorBusqueda = (serviciosParaFiltrar) => {
    if (!filtros.searchTerm) return serviciosParaFiltrar;
    
    const term = filtros.searchTerm.toLowerCase();
    return serviciosParaFiltrar.filter(servicio => 
      servicio.descripcion?.toLowerCase().includes(term) ||
      servicio.vehiculo?.chapa?.toLowerCase().includes(term) ||
      servicio.cliente?.nombre?.toLowerCase().includes(term)
    );
  };

  const limpiarFiltros = () => {
    setFiltros({
      clienteId: '',
      fechaInicio: '',
      fechaFin: '',
      vehiculoId: '',
      searchTerm: ''
    });
    cargarDatos();
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-PY');
  };

  const formatearMoneda = (monto) => {
    return `₲ ${parseFloat(monto || 0).toLocaleString()}`;
  };

  const getEstadoBadge = (costo) => {
    if (costo > 1000000) return 'danger';
    if (costo > 500000) return 'warning';
    return 'success';
  };

  // Aplicar filtro de búsqueda en tiempo real
  const serviciosMostrados = filtrarPorBusqueda(serviciosEnriquecidos);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Consulta de Servicios</h2>
        <Button as={Link} to="/registro-servicio" variant="primary">
          Nuevo Servicio
        </Button>
      </div>
      
      {error && <ErrorAlert message={error} onClose={() => setError('')} />}

      {/* Filtros */}
      <Card className="mb-4">
        <Card.Header>
          <h5 className="mb-0">Filtros de Búsqueda</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Búsqueda General</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Buscar por descripción, chapa, cliente..."
                    value={filtros.searchTerm}
                    onChange={(e) => setFiltros(prev => ({...prev, searchTerm: e.target.value}))}
                  />
                  <Button variant="outline-secondary" disabled>
                    Buscar
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Cliente</Form.Label>
                <Form.Select 
                  value={filtros.clienteId}
                  onChange={(e) => setFiltros(prev => ({...prev, clienteId: e.target.value}))}
                >
                  <option value="">Todos los clientes</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control
                  type="date"
                  value={filtros.fechaInicio}
                  onChange={(e) => setFiltros(prev => ({...prev, fechaInicio: e.target.value}))}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                  type="date"
                  value={filtros.fechaFin}
                  onChange={(e) => setFiltros(prev => ({...prev, fechaFin: e.target.value}))}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={aplicarFiltros} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Buscando...
                </>
              ) : (
                <>
                  Buscar
                </>
              )}
            </Button>
            <Button variant="outline-secondary" onClick={limpiarFiltros}>
              Limpiar
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Resultados */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            Servicios Encontrados ({serviciosMostrados.length})
          </h5>
          <div>
            <small className="text-muted">
              Total: {formatearMoneda(serviciosMostrados.reduce((sum, s) => sum + parseFloat(s.costoTotal || 0), 0))}
            </small>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <LoadingSpinner message="Cargando servicios..." />
          ) : serviciosMostrados.length === 0 ? (
            <div className="text-center py-4">
              <div className="mb-3" style={{ fontSize: '4rem' }}>📋</div>
              <h5>No se encontraron servicios</h5>
              <p className="text-muted">
                {filtros.searchTerm || filtros.clienteId || filtros.fechaInicio ?
                  'No hay servicios que coincidan con los filtros aplicados.' :
                  'No hay servicios registrados en el sistema.'
                }
              </p>
              <Button variant="primary" as={Link} to="/registro-servicio">
                Registrar Primer Servicio
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped hover>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Vehículo</th>
                    <th>Descripción</th>
                    <th>Kilometraje</th>
                    <th>Costo Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {serviciosMostrados.map(servicio => (
                    <tr key={servicio.id}>
                      <td>
                        <Badge bg="secondary">#{servicio.id}</Badge>
                      </td>
                      <td>{formatearFecha(servicio.fecha)}</td>
                      <td>
                        <div>
                          <strong>{servicio.cliente?.nombre || 'Cargando...'}</strong>
                          {servicio.cliente?.telefono && (
                            <small className="d-block text-muted">
                              Tel: {servicio.cliente.telefono}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <strong>{servicio.vehiculo?.chapa || 'Cargando...'}</strong>
                          {servicio.vehiculo && (
                            <small className="d-block text-muted">
                              {servicio.vehiculo.marca} {servicio.vehiculo.modelo}
                            </small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div 
                          className="text-truncate" 
                          style={{maxWidth: '200px'}}
                          title={servicio.descripcion}
                        >
                          {servicio.descripcion || 'Sin descripción'}
                        </div>
                      </td>
                      <td>
                        {servicio.kmActual ? (
                          <span>{servicio.kmActual.toLocaleString()} km</span>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        <Badge bg={getEstadoBadge(servicio.costoTotal)}>
                          {formatearMoneda(servicio.costoTotal)}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            as={Link}
                            to={`/detalle-servicio/${servicio.id}`}
                            variant="outline-primary" 
                            size="sm"
                            title="Ver detalles"
                          >
                            Ver
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
    </div>
  );
};

export default ConsultaServicios;