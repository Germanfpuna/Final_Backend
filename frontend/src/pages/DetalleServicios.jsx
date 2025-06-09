import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Table,
  Badge,
  Alert
} from 'react-bootstrap';
import { 
  serviciosAPI, 
  detalleServiciosAPI, 
  detalleMecanicosAPI, 
  detalleRepuestosAPI 
} from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const DetalleServicio = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [servicio, setServicio] = useState(null);
  const [detallesServicio, setDetallesServicio] = useState([]);
  const [detalleMecanicos, setDetalleMecanicos] = useState([]);
  const [detalleRepuestos, setDetalleRepuestos] = useState([]);

  useEffect(() => {
    cargarDetalles();
  }, [id]);

  const cargarDetalles = async () => {
    try {
      setLoading(true);
      setError('');

      // Cargar servicio principal
      const servicioResponse = await serviciosAPI.getById(id);
      setServicio(servicioResponse.data);

      // Cargar detalles del servicio
      const detallesResponse = await detalleServiciosAPI.getByServicio(id);
      setDetallesServicio(detallesResponse.data);

      // Para cada detalle de servicio, cargar mecánicos y repuestos
      const todosMecanicos = [];
      const todosRepuestos = [];

      for (const detalle of detallesResponse.data) {
        try {
          // Cargar mecánicos para este detalle
          const mecanicosResponse = await detalleMecanicosAPI.getByMecanico(detalle.id);
          if (mecanicosResponse.data) {
            todosMecanicos.push(...mecanicosResponse.data);
          }
        } catch (err) {
          console.log('No hay mecánicos para detalle:', detalle.id);
        }

        try {
          // Cargar repuestos para este detalle
          const repuestosResponse = await detalleRepuestosAPI.getByDetalleServicio(detalle.id);
          if (repuestosResponse.data) {
            todosRepuestos.push(...repuestosResponse.data);
          }
        } catch (err) {
          console.log('No hay repuestos para detalle:', detalle.id);
        }
      }

      setDetalleMecanicos(todosMecanicos);
      setDetalleRepuestos(todosRepuestos);

    } catch (err) {
      setError('Error al cargar detalles del servicio: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-PY', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearMoneda = (monto) => {
    return `₲ ${parseFloat(monto || 0).toLocaleString()}`;
  };

  const calcularTotalMecanicos = () => {
    return detalleMecanicos.reduce((sum, mecanico) => sum + (parseFloat(mecanico.costoTotal) || 0), 0);
  };

  const calcularTotalRepuestos = () => {
    return detalleRepuestos.reduce((sum, repuesto) => sum + (parseFloat(repuesto.precioTotal) || 0), 0);
  };

  const calcularTotalDetalles = () => {
    return detallesServicio.reduce((sum, detalle) => sum + (parseFloat(detalle.costo) || 0), 0);
  };

  const imprimirServicio = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner message="Cargando detalles del servicio..." />;
  }

  if (error) {
    return (
      <div>
        <ErrorAlert message={error} />
        <Button as={Link} to="/consulta-servicios" variant="secondary">
          ← Volver a Consulta
        </Button>
      </div>
    );
  }

  if (!servicio) {
    return (
      <div>
        <Alert variant="warning">
          <h5>⚠️ Servicio no encontrado</h5>
          <p>El servicio solicitado no existe o ha sido eliminado.</p>
        </Alert>
        <Button as={Link} to="/consulta-servicios" variant="secondary">
          ← Volver a Consulta
        </Button>
      </div>
    );
  }

  return (
    <div className="print-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
        <h2>📄 Detalle de Servicio #{servicio.id}</h2>
        <div>
          <Button as={Link} to="/consulta-servicios" variant="outline-secondary" className="me-2">
            ← Volver
          </Button>
          <Button variant="primary" onClick={imprimirServicio}>
            🖨️ Imprimir
          </Button>
        </div>
      </div>

      {/* Header para impresión */}
      <div className="d-none d-print-block text-center mb-4">
        <h1>🔧 TALLER MECÁNICO</h1>
        <h3>Orden de Servicio #{servicio.id}</h3>
        <hr />
      </div>

      {/* Información Principal del Servicio */}
      <Card className="mb-4">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">📋 Información del Servicio</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h6>📝 Datos del Servicio</h6>
              <Table size="sm" className="table-borderless">
                <tbody>
                  <tr>
                    <td><strong>ID:</strong></td>
                    <td>#{servicio.id}</td>
                  </tr>
                  <tr>
                    <td><strong>Fecha:</strong></td>
                    <td>{formatearFecha(servicio.fecha)}</td>
                  </tr>
                  <tr>
                    <td><strong>Descripción:</strong></td>
                    <td>{servicio.descripcion || 'Sin descripción'}</td>
                  </tr>
                  <tr>
                    <td><strong>Kilometraje:</strong></td>
                    <td>
                      {servicio.kmActual ? 
                        `🛣️ ${servicio.kmActual.toLocaleString()} km` : 
                        'No especificado'
                      }
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Costo Total:</strong></td>
                    <td>
                      <Badge bg="success" style={{ fontSize: '1.1em' }}>
                        {formatearMoneda(servicio.costoTotal)}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <h6>👤 Cliente y Vehículo</h6>
              <Table size="sm" className="table-borderless">
                <tbody>
                  <tr>
                    <td><strong>Cliente:</strong></td>
                    <td>{servicio.cliente?.nombre || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>RUC/CI:</strong></td>
                    <td>{servicio.cliente?.rucCi || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Teléfono:</strong></td>
                    <td>📞 {servicio.cliente?.telefono || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Dirección:</strong></td>
                    <td>📍 {servicio.cliente?.direccion || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Vehículo:</strong></td>
                    <td>
                      {servicio.vehiculo ? (
                        <div>
                          <strong>🚗 {servicio.vehiculo.chapa}</strong>
                          <br />
                          <small>
                            {servicio.vehiculo.marca} {servicio.vehiculo.modelo} 
                            ({servicio.vehiculo.anio}) - {servicio.vehiculo.tipo}
                          </small>
                        </div>
                      ) : 'N/A'}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Detalles del Servicio */}
      {detallesServicio.length > 0 && (
        <Card className="mb-4">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">🔧 Trabajos Realizados</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered>
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Costo</th>
                </tr>
              </thead>
              <tbody>
                {detallesServicio.map(detalle => (
                  <tr key={detalle.id}>
                    <td>#{detalle.id}</td>
                    <td>{detalle.descripcion}</td>
                    <td>{formatearMoneda(detalle.costo)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-info">
                <tr>
                  <td colSpan="2"><strong>Subtotal Trabajos:</strong></td>
                  <td><strong>{formatearMoneda(calcularTotalDetalles())}</strong></td>
                </tr>
              </tfoot>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Mecánicos Asignados */}
      {detalleMecanicos.length > 0 && (
        <Card className="mb-4">
          <Card.Header className="bg-warning text-dark">
            <h5 className="mb-0">👨‍🔧 Mecánicos Asignados</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered>
              <thead className="table-dark">
                <tr>
                  <th>Mecánico</th>
                  <th>Especialidad</th>
                  <th>Descripción del Trabajo</th>
                  <th>Horas</th>
                  <th>Costo</th>
                </tr>
              </thead>
              <tbody>
                {detalleMecanicos.map((detalle, index) => (
                  <tr key={index}>
                    <td>
                      <strong>{detalle.mecanico?.nombre || `Mecánico ID: ${detalle.mecanicoId}`}</strong>
                    </td>
                    <td>
                      <Badge bg="secondary">
                        {detalle.mecanico?.especialidad || 'N/A'}
                      </Badge>
                    </td>
                    <td>{detalle.descripcion || 'Sin descripción'}</td>
                    <td>
                      {detalle.horasTrabajadas ? 
                        `⏰ ${detalle.horasTrabajadas}h` : 'N/A'
                      }
                    </td>
                    <td>{formatearMoneda(detalle.costoTotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-warning">
                <tr>
                  <td colSpan="4"><strong>Subtotal Mano de Obra:</strong></td>
                  <td><strong>{formatearMoneda(calcularTotalMecanicos())}</strong></td>
                </tr>
              </tfoot>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Repuestos Utilizados */}
      {detalleRepuestos.length > 0 && (
        <Card className="mb-4">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">🔩 Repuestos Utilizados</h5>
          </Card.Header>
          <Card.Body>
            <Table striped bordered>
              <thead className="table-dark">
                <tr>
                  <th>Código</th>
                  <th>Repuesto</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Total</th>
                  <th>Observaciones</th>
                </tr>
              </thead>
              <tbody>
                {detalleRepuestos.map((detalle, index) => (
                  <tr key={index}>
                    <td>
                      <Badge bg="dark">
                        {detalle.repuesto?.codigo || `REP-${detalle.repuestoId}`}
                      </Badge>
                    </td>
                    <td>
                      <strong>{detalle.repuesto?.nombre || `Repuesto ID: ${detalle.repuestoId}`}</strong>
                    </td>
                    <td className="text-center">
                      <Badge bg="primary">{detalle.cantidad}</Badge>
                    </td>
                    <td>{formatearMoneda(detalle.precioUnitario)}</td>
                    <td>
                      <strong>{formatearMoneda(detalle.precioTotal)}</strong>
                    </td>
                    <td>
                      <small>{detalle.observaciones || '-'}</small>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-success">
                <tr>
                  <td colSpan="4"><strong>Subtotal Repuestos:</strong></td>
                  <td><strong>{formatearMoneda(calcularTotalRepuestos())}</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Resumen Final */}
      <Card className="mb-4">
        <Card.Header className="bg-dark text-white">
          <h5 className="mb-0">💰 Resumen de Costos</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={8}>
              <Table>
                <tbody>
                  <tr>
                    <td>💼 Costo de Trabajos:</td>
                    <td className="text-end">{formatearMoneda(calcularTotalDetalles())}</td>
                  </tr>
                  <tr>
                    <td>👨‍🔧 Costo de Mano de Obra:</td>
                    <td className="text-end">{formatearMoneda(calcularTotalMecanicos())}</td>
                  </tr>
                  <tr>
                    <td>🔩 Costo de Repuestos:</td>
                    <td className="text-end">{formatearMoneda(calcularTotalRepuestos())}</td>
                  </tr>
                  <tr className="table-dark">
                    <td><strong>💯 TOTAL GENERAL:</strong></td>
                    <td className="text-end">
                      <strong style={{ fontSize: '1.5em', color: '#28a745' }}>
                        {formatearMoneda(servicio.costoTotal)}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={4}>
              <div className="bg-light p-3 rounded">
                <h6>📊 Estadísticas</h6>
                <p><strong>Trabajos realizados:</strong> {detallesServicio.length}</p>
                <p><strong>Mecánicos involucrados:</strong> {detalleMecanicos.length}</p>
                <p><strong>Repuestos utilizados:</strong> {detalleRepuestos.length}</p>
                <p className="mb-0">
                  <strong>Total de horas:</strong> {' '}
                  {detalleMecanicos.reduce((sum, m) => sum + (parseFloat(m.horasTrabajadas) || 0), 0)} horas
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Footer para impresión */}
      <div className="d-none d-print-block text-center mt-4">
        <hr />
        <p>
          <strong>🔧 TALLER MECÁNICO</strong><br />
          Fecha de impresión: {new Date().toLocaleDateString('es-PY')}<br />
          Gracias por su confianza
        </p>
      </div>
    </div>
  );
};

export default DetalleServicio;