import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/prueba';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Clientes API
export const clientesAPI = {
  getAll: () => api.get('/clientes'),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (cliente) => api.post('/clientes', cliente),
  update: (id, cliente) => api.put(`/clientes/${id}`, cliente),
  delete: (id) => api.delete(`/clientes/${id}`),
  buscarPorNombre: (nombre) => api.get(`/clientes/buscar/nombre/${nombre}`),
  buscarPorRuc: (rucCi) => api.get(`/clientes/buscar/ruc/${rucCi}`)
};

// Vehículos API
export const vehiculosAPI = {
  getAll: () => api.get('/vehiculos'),
  getById: (id) => api.get(`/vehiculos/${id}`),
  create: (vehiculo) => api.post('/vehiculos', vehiculo),
  update: (id, vehiculo) => api.put(`/vehiculos/${id}`, vehiculo),
  delete: (id) => api.delete(`/vehiculos/${id}`),
  getByCliente: (clienteId) => api.get(`/vehiculos/cliente/${clienteId}`),
  getCompleto: (id) => api.get(`/vehiculos/${id}/completo`),
  buscarPorChapa: (chapa) => api.get(`/vehiculos/chapa/${chapa}`)
};

// Mecánicos API
export const mecanicosAPI = {
  getAll: () => api.get('/mecanicos'),
  getById: (id) => api.get(`/mecanicos/${id}`),
  create: (mecanico) => api.post('/mecanicos', mecanico),
  update: (id, mecanico) => api.put(`/mecanicos/${id}`, mecanico),
  delete: (id) => api.delete(`/mecanicos/${id}`),
  buscarPorEspecialidad: (especialidad) => api.get(`/mecanicos/especialidad/${especialidad}`),
  buscarPorNombre: (nombre) => api.get(`/mecanicos/nombre/${nombre}`)
};

// Repuestos API
export const repuestosAPI = {
  getAll: () => api.get('/repuestos'),
  getById: (id) => api.get(`/repuestos/${id}`),
  create: (repuesto) => api.post('/repuestos', repuesto),
  update: (id, repuesto) => api.put(`/repuestos/${id}`, repuesto),
  delete: (id) => api.delete(`/repuestos/${id}`),
  buscarPorCodigo: (codigo) => api.get(`/repuestos/codigo/${codigo}`),
  buscarPorNombre: (nombre) => api.get(`/repuestos/nombre/${nombre}`)
};

// Servicios API
export const serviciosAPI = {
  getAll: () => api.get('/servicios'),
  getById: (id) => api.get(`/servicios/${id}`),
  create: (servicio) => api.post('/servicios', servicio),
  update: (id, servicio) => api.put(`/servicios/${id}`, servicio),
  delete: (id) => api.delete(`/servicios/${id}`),
  getByVehiculo: (vehiculoId) => api.get(`/servicios/vehiculo/${vehiculoId}`),
  getByCliente: (clienteId) => api.get(`/servicios/cliente/${clienteId}`),
  getByFecha: (inicio, fin) => api.get(`/servicios/fecha?inicio=${inicio}&fin=${fin}`)
};

// Detalle Servicios API
export const detalleServiciosAPI = {
  getAll: () => api.get('/detalle-servicios'),
  getById: (id) => api.get(`/detalle-servicios/${id}`),
  create: (detalle) => api.post('/detalle-servicios', detalle),
  update: (id, detalle) => api.put(`/detalle-servicios/${id}`, detalle),
  delete: (id) => api.delete(`/detalle-servicios/${id}`),
  getByServicio: (servicioId) => api.get(`/detalle-servicios/servicio/${servicioId}`),
  getCompleto: (id) => api.get(`/detalle-servicios/${id}/completo`),
  buscarPorDescripcion: (descripcion) => api.get(`/detalle-servicios/descripcion/${descripcion}`)
};

// Detalle Mecánicos API
export const detalleMecanicosAPI = {
  getAll: () => api.get('/detalle-mecanicos'),
  create: (detalle) => api.post('/detalle-mecanicos', detalle),
  getByMecanico: (mecanicoId) => api.get(`/detalle-mecanicos/mecanico/${mecanicoId}`)
};

// Detalle Repuestos API
export const detalleRepuestosAPI = {
  getAll: () => api.get('/detalle-repuestos'),
  getById: (id) => api.get(`/detalle-repuestos/${id}`),
  create: (detalle) => api.post('/detalle-repuestos', detalle),
  update: (id, detalle) => api.put(`/detalle-repuestos/${id}`, detalle),
  delete: (id) => api.delete(`/detalle-repuestos/${id}`),
  getByRepuesto: (repuestoId) => api.get(`/detalle-repuestos/repuesto/${repuestoId}`),
  getByDetalleServicio: (detalleServicioId) => api.get(`/detalle-repuestos/detalle-servicio/${detalleServicioId}`),
  getCompleto: (id) => api.get(`/detalle-repuestos/${id}/completo`)
};

export default api;