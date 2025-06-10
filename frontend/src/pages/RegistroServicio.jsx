import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Button,
    Row,
    Col,
    Alert,
    Table,
    Modal,
    Badge
} from 'react-bootstrap';
import {
    clientesAPI,
    vehiculosAPI,
    serviciosAPI,
    detalleServiciosAPI,
    mecanicosAPI,
    repuestosAPI,
    detalleMecanicosAPI,
    detalleRepuestosAPI
} from '../services/api';
import LoadingSpinner from './../components/LoadingSpinner';
import ErrorAlert from './../components/ErrorAlert';

const RegistroServicio = () => {
    const [clientes, setClientes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [mecanicos, setMecanicos] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Estado del servicio principal
    const [servicio, setServicio] = useState({
        fecha: new Date().toISOString().split('T')[0],
        descripcion: '',
        kmActual: '',
        vehiculoId: ''
    });

    // Estado de los detalles
    const [detalles, setDetalles] = useState([]);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [currentDetalle, setCurrentDetalle] = useState({
        descripcion: '',
        costo: '',
        mecanicos: [],
        repuestos: []
    });

    // Modal de mecánicos y repuestos
    const [showMecanicoModal, setShowMecanicoModal] = useState(false);
    const [showRepuestoModal, setShowRepuestoModal] = useState(false);
    const [mecanicoDetalle, setMecanicoDetalle] = useState({
        descripcion: '',
        horasTrabajadas: '',
        costoTotal: '',
        mecanicoId: ''
    });
    const [repuestoDetalle, setRepuestoDetalle] = useState({
        cantidad: '',
        precioUnitario: '',
        observaciones: '',
        repuestoId: ''
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            const [clientesRes, mecanicosRes, repuestosRes] = await Promise.all([
                clientesAPI.getAll(),
                mecanicosAPI.getAll(),
                repuestosAPI.getAll()
            ]);

            setClientes(clientesRes.data);
            setMecanicos(mecanicosRes.data);
            setRepuestos(repuestosRes.data);
        } catch (error) {
            setError('Error al cargar los datos iniciales: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClienteChange = async (clienteId) => {
        if (clienteId) {
            try {
                const response = await vehiculosAPI.buscarPorCliente(clienteId);
                setVehiculos(response.data);
                setServicio(prev => ({ ...prev, vehiculoId: '' }));
            } catch (error) {
                setError('Error al cargar vehículos del cliente');
                setVehiculos([]);
            }
        } else {
            setVehiculos([]);
            setServicio(prev => ({ ...prev, vehiculoId: '' }));
        }
    };

    // Función para calcular stock disponible considerando repuestos ya agregados - FIXED
    const calcularStockDisponible = (repuestoId) => {
        const repuesto = repuestos.find(r => r.id == repuestoId);
        if (!repuesto) return 0;

        // Usar stockActual en lugar de stock
        const stockInicial = repuesto.stockActual || 0;

        // Calcular cantidad ya utilizada en todos los detalles
        let cantidadUtilizada = 0;
        
        // Sumar repuestos en detalles ya guardados
        detalles.forEach(detalle => {
            detalle.repuestos.forEach(rep => {
                if (rep.repuestoId == repuestoId) {
                    cantidadUtilizada += parseInt(rep.cantidad);
                }
            });
        });

        // Sumar repuestos en el detalle actual
        currentDetalle.repuestos.forEach(rep => {
            if (rep.repuestoId == repuestoId) {
                cantidadUtilizada += parseInt(rep.cantidad);
            }
        });

        return Math.max(0, stockInicial - cantidadUtilizada);
    };

    // Función para validar si se puede agregar la cantidad solicitada
    const validarStockRepuesto = (repuestoId, cantidadSolicitada) => {
        const stockDisponible = calcularStockDisponible(repuestoId);
        return parseInt(cantidadSolicitada) <= stockDisponible;
    };

    const calcularCostoTotal = () => {
        return detalles.reduce((total, detalle) => {
            const costoDetalle = parseFloat(detalle.costo || 0);
            const costoMecanicos = detalle.mecanicos.reduce((sum, m) => sum + parseFloat(m.costoTotal || 0), 0);
            const costoRepuestos = detalle.repuestos.reduce((sum, r) => sum + parseFloat(r.precioTotal || 0), 0);
            return total + costoDetalle + costoMecanicos + costoRepuestos;
        }, 0);
    };

    const agregarMecanico = () => {
        if (mecanicoDetalle.mecanicoId && mecanicoDetalle.costoTotal) {
            const mecanico = mecanicos.find(m => m.id == mecanicoDetalle.mecanicoId);
            const nuevoMecanico = {
                ...mecanicoDetalle,
                id: Date.now(),
                mecanicoNombre: mecanico?.nombre,
                mecanicoEspecialidad: mecanico?.especialidad
            };

            setCurrentDetalle(prev => ({
                ...prev,
                mecanicos: [...prev.mecanicos, nuevoMecanico]
            }));

            setMecanicoDetalle({
                descripcion: '',
                horasTrabajadas: '',
                costoTotal: '',
                mecanicoId: ''
            });
            setShowMecanicoModal(false);
        }
    };

    const agregarRepuesto = () => {
        if (repuestoDetalle.repuestoId && repuestoDetalle.cantidad) {
            // Validar stock disponible
            if (!validarStockRepuesto(repuestoDetalle.repuestoId, repuestoDetalle.cantidad)) {
                const stockDisponible = calcularStockDisponible(repuestoDetalle.repuestoId);
                setError(`Stock insuficiente. Solo hay ${stockDisponible} unidades disponibles de este repuesto.`);
                return;
            }

            const repuesto = repuestos.find(r => r.id == repuestoDetalle.repuestoId);
            const precioUnitario = repuestoDetalle.precioUnitario || repuesto?.precio || 0;
            const precioTotal = parseFloat(repuestoDetalle.cantidad) * parseFloat(precioUnitario);

            const nuevoRepuesto = {
                ...repuestoDetalle,
                id: Date.now(),
                precioTotal: precioTotal,
                repuestoNombre: repuesto?.nombre,
                repuestoCodigo: repuesto?.codigo,
                precioUnitario: precioUnitario
            };

            setCurrentDetalle(prev => ({
                ...prev,
                repuestos: [...prev.repuestos, nuevoRepuesto]
            }));

            setRepuestoDetalle({
                cantidad: '',
                precioUnitario: '',
                observaciones: '',
                repuestoId: ''
            });
            setShowRepuestoModal(false);
            setError(''); // Limpiar errores previos
        }
    };

    const agregarDetalle = () => {
        if (currentDetalle.descripcion && currentDetalle.costo) {
            setDetalles(prev => [...prev, { ...currentDetalle, id: Date.now() }]);
            setCurrentDetalle({
                descripcion: '',
                costo: '',
                mecanicos: [],
                repuestos: []
            });
            setShowDetalleModal(false);
        }
    };

    const eliminarDetalle = (index) => {
        setDetalles(prev => prev.filter((_, i) => i !== index));
    };

    // Función para actualizar el stock de repuestos - FIXED
    const actualizarStockRepuestos = async () => {
        const actualizaciones = new Map();

        // Recopilar todas las cantidades de repuestos utilizados
        detalles.forEach(detalle => {
            detalle.repuestos.forEach(repuesto => {
                const repuestoId = repuesto.repuestoId;
                const cantidad = parseInt(repuesto.cantidad);
                
                if (actualizaciones.has(repuestoId)) {
                    actualizaciones.set(repuestoId, actualizaciones.get(repuestoId) + cantidad);
                } else {
                    actualizaciones.set(repuestoId, cantidad);
                }
            });
        });

        // Actualizar stock de cada repuesto
        for (const [repuestoId, cantidadUtilizada] of actualizaciones) {
            try {
                const repuesto = repuestos.find(r => r.id == repuestoId);
                if (repuesto) {
                    // Usar stockActual en lugar de stock
                    const nuevoStock = (repuesto.stockActual || 0) - cantidadUtilizada;
                    
                    // Validación final de stock
                    if (nuevoStock < 0) {
                        throw new Error(`Stock insuficiente para el repuesto ${repuesto.nombre}. Stock actual: ${repuesto.stockActual}, cantidad solicitada: ${cantidadUtilizada}`);
                    }

                    const repuestoActualizado = {
                        ...repuesto,
                        stockActual: nuevoStock
                    };

                    await repuestosAPI.update(repuestoId, repuestoActualizado);
                    console.log(`Stock actualizado para ${repuesto.nombre}: ${repuesto.stockActual} -> ${nuevoStock}`);
                }
            } catch (error) {
                console.error(`Error actualizando stock del repuesto ${repuestoId}:`, error);
                throw error;
            }
        }
    };

    const guardarServicio = async () => {
        if (!servicio.vehiculoId || !servicio.descripcion || detalles.length === 0) {
            setError('Por favor complete todos los campos obligatorios y agregue al menos un detalle');
            return;
        }

        // Validación final de stock antes de guardar
        const validacionStock = validarStockFinal();
        if (!validacionStock.valido) {
            setError(validacionStock.mensaje);
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Crear servicio principal
            const servicioData = {
                ...servicio,
                costoTotal: calcularCostoTotal()
            };

            console.log('Creando servicio:', servicioData);
            const servicioResponse = await serviciosAPI.create(servicioData);
            const servicioId = servicioResponse.data.id;

            // Crear detalles de servicio
            for (const detalle of detalles) {
                const detalleData = {
                    descripcion: detalle.descripcion,
                    costo: parseFloat(detalle.costo),
                    servicioId: servicioId
                };

                console.log('Creando detalle servicio:', detalleData);
                const detalleResponse = await detalleServiciosAPI.create(detalleData);
                const detalleServicioId = detalleResponse.data.id;

                // Crear detalle mecánicos
                for (const mecanico of detalle.mecanicos) {
                    const mecanicoData = {
                        descripcion: mecanico.descripcion,
                        horasTrabajadas: parseFloat(mecanico.horasTrabajadas || 0),
                        costoTotal: parseFloat(mecanico.costoTotal),
                        mecanicoId: parseInt(mecanico.mecanicoId),
                        detalleServicioId: detalleServicioId
                    };
                    console.log('Creando detalle mecánico:', mecanicoData);
                    await detalleMecanicosAPI.create(mecanicoData);
                }

                // Crear detalle repuestos
                for (const repuesto of detalle.repuestos) {
                    const repuestoData = {
                        cantidad: parseInt(repuesto.cantidad),
                        precioUnitario: parseFloat(repuesto.precioUnitario),
                        precioTotal: parseFloat(repuesto.precioTotal),
                        observaciones: repuesto.observaciones || '',
                        repuestoId: parseInt(repuesto.repuestoId),
                        detalleServicioId: detalleServicioId
                    };
                    console.log('Creando detalle repuesto:', repuestoData);
                    await detalleRepuestosAPI.create(repuestoData);
                }
            }

            // Actualizar stock de repuestos
            await actualizarStockRepuestos();

            // Recargar datos de repuestos para mostrar stock actualizado
            const repuestosResponse = await repuestosAPI.getAll();
            setRepuestos(repuestosResponse.data);

            setSuccess('Servicio registrado exitosamente. Stock de repuestos actualizado.');

            // Limpiar formulario
            setServicio({
                fecha: new Date().toISOString().split('T')[0],
                descripcion: '',
                kmActual: '',
                vehiculoId: ''
            });
            setDetalles([]);
            setVehiculos([]);

        } catch (error) {
            console.error('Error al guardar:', error);
            setError('Error al guardar el servicio: ' + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Función para validación final del stock - FIXED
    const validarStockFinal = () => {
        const utilizacion = new Map();
        
        // Calcular total de repuestos utilizados
        detalles.forEach(detalle => {
            detalle.repuestos.forEach(repuesto => {
                const repuestoId = repuesto.repuestoId;
                const cantidad = parseInt(repuesto.cantidad);
                
                if (utilizacion.has(repuestoId)) {
                    utilizacion.set(repuestoId, utilizacion.get(repuestoId) + cantidad);
                } else {
                    utilizacion.set(repuestoId, cantidad);
                }
            });
        });

        // Validar cada repuesto
        for (const [repuestoId, cantidadTotal] of utilizacion) {
            const repuesto = repuestos.find(r => r.id == repuestoId);
            if (!repuesto || (repuesto.stockActual || 0) < cantidadTotal) {
                return {
                    valido: false,
                    mensaje: `Stock insuficiente para ${repuesto?.nombre || 'repuesto desconocido'}. Stock disponible: ${repuesto?.stockActual || 0}, cantidad requerida: ${cantidadTotal}`
                };
            }
        }

        return { valido: true, mensaje: '' };
    };

    if (loading && clientes.length === 0) {
        return <LoadingSpinner message="Cargando datos iniciales..." />;
    }

    return (
        <div>
            <h2>🔧 Registro de Servicios</h2>

            {error && <ErrorAlert message={error} onClose={() => setError('')} />}
            {success && (
                <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                    ✅ {success}
                </Alert>
            )}

            <Card className="mb-4">
                <Card.Header>
                    <h5>📋 Información del Servicio</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cliente *</Form.Label>
                                <Form.Select onChange={(e) => handleClienteChange(e.target.value)}>
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
                                <Form.Label>Vehículo *</Form.Label>
                                <Form.Select
                                    value={servicio.vehiculoId}
                                    onChange={(e) => setServicio(prev => ({ ...prev, vehiculoId: e.target.value }))}
                                    required
                                >
                                    <option value="">Seleccione un vehículo</option>
                                    {vehiculos.map(vehiculo => (
                                        <option key={vehiculo.id} value={vehiculo.id}>
                                            {vehiculo.marca} {vehiculo.modelo} - {vehiculo.chapa} ({vehiculo.tipo})
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Fecha *</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={servicio.fecha}
                                    onChange={(e) => setServicio(prev => ({ ...prev, fecha: e.target.value }))}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Kilometraje Actual</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={servicio.kmActual}
                                    onChange={(e) => setServicio(prev => ({ ...prev, kmActual: e.target.value }))}
                                    placeholder="Ingrese el kilometraje"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Costo Total</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={`₲ ${calcularCostoTotal().toLocaleString()}`}
                                    readOnly
                                    className="bg-light"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción del Servicio *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={servicio.descripcion}
                            onChange={(e) => setServicio(prev => ({ ...prev, descripcion: e.target.value }))}
                            placeholder="Descripción general del servicio"
                            required
                        />
                    </Form.Group>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5>🔧 Detalles del Servicio</h5>
                    <Button variant="primary" onClick={() => setShowDetalleModal(true)}>
                        ➕ Agregar Detalle
                    </Button>
                </Card.Header>
                <Card.Body>
                    {detalles.length === 0 ? (
                        <p className="text-muted">No hay detalles agregados</p>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Descripción</th>
                                    <th>Costo Base</th>
                                    <th>Mecánicos</th>
                                    <th>Repuestos</th>
                                    <th>Total</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detalles.map((detalle, index) => {
                                    const costoMecanicos = detalle.mecanicos.reduce((sum, m) => sum + parseFloat(m.costoTotal || 0), 0);
                                    const costoRepuestos = detalle.repuestos.reduce((sum, r) => sum + parseFloat(r.precioTotal || 0), 0);
                                    const totalDetalle = parseFloat(detalle.costo) + costoMecanicos + costoRepuestos;

                                    return (
                                        <tr key={detalle.id}>
                                            <td>{detalle.descripcion}</td>
                                            <td>₲ {parseFloat(detalle.costo).toLocaleString()}</td>
                                            <td>
                                                <Badge bg="info">{detalle.mecanicos.length} mecánico(s)</Badge>
                                                {detalle.mecanicos.length > 0 && (
                                                    <div className="small mt-1">
                                                        ₲ {costoMecanicos.toLocaleString()}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <Badge bg="warning">{detalle.repuestos.length} repuesto(s)</Badge>
                                                {detalle.repuestos.length > 0 && (
                                                    <div className="small mt-1">
                                                        ₲ {costoRepuestos.toLocaleString()}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <strong>₲ {totalDetalle.toLocaleString()}</strong>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => eliminarDetalle(index)}
                                                >
                                                    🗑️
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary">
                    ❌ Cancelar
                </Button>
                <Button
                    variant="success"
                    size="lg"
                    onClick={guardarServicio}
                    disabled={loading || detalles.length === 0}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Guardando...
                        </>
                    ) : (
                        <>
                            💾 Guardar Servicio
                        </>
                    )}
                </Button>
            </div>

            {/* Modal para agregar detalle */}
            <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>➕ Agregar Detalle de Servicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Descripción *</Form.Label>
                        <Form.Control
                            type="text"
                            value={currentDetalle.descripcion}
                            onChange={(e) => setCurrentDetalle(prev => ({ ...prev, descripcion: e.target.value }))}
                            placeholder="Descripción del trabajo realizado"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Costo Base *</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            value={currentDetalle.costo}
                            onChange={(e) => setCurrentDetalle(prev => ({ ...prev, costo: e.target.value }))}
                            placeholder="Costo base del trabajo"
                        />
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6>👨‍🔧 Mecánicos Asignados</h6>
                                <Button variant="outline-primary" size="sm" onClick={() => setShowMecanicoModal(true)}>
                                    ➕ Agregar
                                </Button>
                            </div>
                            {currentDetalle.mecanicos.length === 0 ? (
                                <p className="text-muted small">No hay mecánicos asignados</p>
                            ) : (
                                currentDetalle.mecanicos.map((mec, index) => (
                                    <div key={mec.id} className="border p-2 mb-2 rounded bg-light">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>{mec.mecanicoNombre}</strong>
                                                <small className="d-block text-muted">{mec.mecanicoEspecialidad}</small>
                                                <small className="d-block">{mec.descripcion}</small>
                                                <small>{mec.horasTrabajadas}h - ₲{parseFloat(mec.costoTotal).toLocaleString()}</small>
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => setCurrentDetalle(prev => ({
                                                    ...prev,
                                                    mecanicos: prev.mecanicos.filter((_, i) => i !== index)
                                                }))}
                                            >
                                                ❌
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </Col>
                        <Col md={6}>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6>🔩 Repuestos Utilizados</h6>
                                <Button variant="outline-primary" size="sm" onClick={() => setShowRepuestoModal(true)}>
                                    ➕ Agregar
                                </Button>
                            </div>
                            {currentDetalle.repuestos.length === 0 ? (
                                <p className="text-muted small">No hay repuestos agregados</p>
                            ) : (
                                currentDetalle.repuestos.map((rep, index) => (
                                    <div key={rep.id} className="border p-2 mb-2 rounded bg-light">
                                        <div className="d-flex justify-content-between">
                                            <div>
                                                <strong>{rep.repuestoNombre}</strong>
                                                <small className="d-block text-muted">{rep.repuestoCodigo}</small>
                                                <small className="d-block">Cant: {rep.cantidad} × ₲{parseFloat(rep.precioUnitario).toLocaleString()}</small>
                                                <strong>Total: ₲{parseFloat(rep.precioTotal).toLocaleString()}</strong>
                                                {rep.observaciones && <small className="d-block text-muted">{rep.observaciones}</small>}
                                            </div>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => setCurrentDetalle(prev => ({
                                                    ...prev,
                                                    repuestos: prev.repuestos.filter((_, i) => i !== index)
                                                }))}
                                            >
                                                ❌
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalleModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={agregarDetalle}
                        disabled={!currentDetalle.descripcion || !currentDetalle.costo}
                    >
                        ➕ Agregar Detalle
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para agregar mecánico */}
            <Modal show={showMecanicoModal} onHide={() => setShowMecanicoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>👨‍🔧 Agregar Mecánico</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Mecánico *</Form.Label>
                        <Form.Select
                            value={mecanicoDetalle.mecanicoId}
                            onChange={(e) => setMecanicoDetalle(prev => ({ ...prev, mecanicoId: e.target.value }))}
                        >
                            <option value="">Seleccione un mecánico</option>
                            {mecanicos.map(mecanico => (
                                <option key={mecanico.id} value={mecanico.id}>
                                    {mecanico.nombre} - {mecanico.especialidad}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Descripción del Trabajo</Form.Label>
                        <Form.Control
                            type="text"
                            value={mecanicoDetalle.descripcion}
                            onChange={(e) => setMecanicoDetalle(prev => ({ ...prev, descripcion: e.target.value }))}
                            placeholder="Trabajo realizado por el mecánico"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Horas Trabajadas</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.5"
                            value={mecanicoDetalle.horasTrabajadas}
                            onChange={(e) => setMecanicoDetalle(prev => ({ ...prev, horasTrabajadas: e.target.value }))}
                            placeholder="Horas trabajadas"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Costo Total *</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            value={mecanicoDetalle.costoTotal}
                            onChange={(e) => setMecanicoDetalle(prev => ({ ...prev, costoTotal: e.target.value }))}
                            placeholder="Costo total del trabajo"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMecanicoModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={agregarMecanico}
                        disabled={!mecanicoDetalle.mecanicoId || !mecanicoDetalle.costoTotal}
                    >
                        ➕ Agregar Mecánico
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para agregar repuesto - FIXED */}
            <Modal show={showRepuestoModal} onHide={() => setShowRepuestoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>🔩 Agregar Repuesto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Repuesto *</Form.Label>
                        <Form.Select
                            value={repuestoDetalle.repuestoId}
                            onChange={(e) => {
                                const repuesto = repuestos.find(r => r.id == e.target.value);
                                setRepuestoDetalle(prev => ({
                                    ...prev,
                                    repuestoId: e.target.value,
                                    precioUnitario: repuesto?.precio || ''
                                }));
                            }}
                        >
                            <option value="">Seleccione un repuesto</option>
                            {repuestos.map(repuesto => {
                                const stockDisponible = calcularStockDisponible(repuesto.id);
                                return (
                                    <option 
                                        key={repuesto.id} 
                                        value={repuesto.id}
                                        disabled={stockDisponible <= 0}
                                    >
                                        {repuesto.codigo} - {repuesto.nombre} 
                                        (₲{parseFloat(repuesto.precio || 0).toLocaleString()}) 
                                        - Stock: {stockDisponible}
                                        {stockDisponible <= 0 ? ' (AGOTADO)' : ''}
                                    </option>
                                );
                            })}
                        </Form.Select>
                        {repuestoDetalle.repuestoId && (
                            <small className="text-muted">
                                Stock disponible: {calcularStockDisponible(repuestoDetalle.repuestoId)} unidades
                            </small>
                        )}
                    </Form.Group>

                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Cantidad *</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max={repuestoDetalle.repuestoId ? calcularStockDisponible(repuestoDetalle.repuestoId) : ''}
                                    value={repuestoDetalle.cantidad}
                                    onChange={(e) => setRepuestoDetalle(prev => ({ ...prev, cantidad: e.target.value }))}
                                    placeholder="Cantidad"
                                />
                                {repuestoDetalle.repuestoId && repuestoDetalle.cantidad && 
                                 parseInt(repuestoDetalle.cantidad) > calcularStockDisponible(repuestoDetalle.repuestoId) && (
                                    <small className="text-danger">
                                        Cantidad excede el stock disponible
                                    </small>
                                )}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Precio Unitario</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="0.01"
                                    value={repuestoDetalle.precioUnitario}
                                    onChange={(e) => setRepuestoDetalle(prev => ({ ...prev, precioUnitario: e.target.value }))}
                                    placeholder="Precio unitario"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3">
                        <Form.Label>Precio Total</Form.Label>
                        <Form.Control
                            type="text"
                            value={`₲ ${(parseFloat(repuestoDetalle.cantidad || 0) * parseFloat(repuestoDetalle.precioUnitario || 0)).toLocaleString()}`}
                            readOnly
                            className="bg-light"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Observaciones</Form.Label>
                        <Form.Control
                            type="text"
                            value={repuestoDetalle.observaciones}
                            onChange={(e) => setRepuestoDetalle(prev => ({ ...prev, observaciones: e.target.value }))}
                            placeholder="Observaciones adicionales"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRepuestoModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={agregarRepuesto}
                        disabled={
                            !repuestoDetalle.repuestoId || 
                            !repuestoDetalle.cantidad ||
                            parseInt(repuestoDetalle.cantidad) > calcularStockDisponible(repuestoDetalle.repuestoId) ||
                            parseInt(repuestoDetalle.cantidad) <= 0
                        }
                    >
                        ➕ Agregar Repuesto
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default RegistroServicio;