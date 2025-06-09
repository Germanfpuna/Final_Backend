-- Crear base de datos (si se ejecuta desde psql)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Conectar a la base
-- \c prueba

-- Tabla: clientes
CREATE TABLE if not exists clientes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    direccion VARCHAR(200),
    ruc_ci VARCHAR(20) UNIQUE,
    tipo_cliente VARCHAR(10) CHECK (tipo_cliente IN ('ocasional', 'regular', 'vip'))
);

CREATE INDEX if not exists idx_nombre ON clientes(nombre);
CREATE INDEX if not exists idx_ruc_ci ON clientes(ruc_ci);

-- Tabla: vehiculos
CREATE table if not exists vehiculos (
    id BIGSERIAL PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    chapa VARCHAR(20) UNIQUE,
    modelo VARCHAR(50),
    anio INT,
    tipo VARCHAR(10) CHECK (tipo IN ('moto', 'coche', 'camioneta', 'camion')),
    cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE
);

CREATE INDEX if not exists idx_marca ON vehiculos(marca);
CREATE INDEX if not exists idx_chapa ON vehiculos(chapa);
CREATE INDEX if not exists idx_cliente_id ON vehiculos(cliente_id);

-- Tabla: repuestos
CREATE TABLE if not exists repuestos (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(200),
    precio DECIMAL(10,2),
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 0
);

CREATE INDEX if not exists idx_codigo ON repuestos(codigo);
CREATE INDEX if not exists idx_nombre_rep ON repuestos(nombre);

-- Tabla: mecanicos
CREATE TABLE if not exists mecanicos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(15),
    fecha_ingreso DATE,
    especialidad VARCHAR(100)
);

CREATE INDEX if not exists idx_nombre_mec ON mecanicos(nombre);
CREATE INDEX if not exists idx_especialidad ON mecanicos(especialidad);
CREATE INDEX if not exists idx_fecha_ingreso ON mecanicos(fecha_ingreso);

-- Tabla: servicios
CREATE TABLE if not exists servicios (
    id BIGSERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    descripcion VARCHAR(500),
    km_actual INT,
    costo_total DECIMAL(10,2),
    vehiculo_id BIGINT NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE
);

CREATE INDEX if not exists idx_fecha ON servicios(fecha);
CREATE INDEX if not exists idx_vehiculo_id ON servicios(vehiculo_id);
CREATE INDEX if not exists idx_km_actual ON servicios(km_actual);

-- Tabla: detalle_servicios
CREATE TABLE if not exists detalle_servicios (
    id BIGSERIAL PRIMARY KEY,
    descripcion VARCHAR(500),
    costo DECIMAL(10,2),
    servicio_id BIGINT NOT NULL REFERENCES servicios(id) ON DELETE CASCADE
);

CREATE INDEX if not exists idx_servicio_id ON detalle_servicios(servicio_id);

-- Tabla: detalle_repuestos
CREATE TABLE if not exists detalle_repuestos (
    id BIGSERIAL PRIMARY KEY,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    precio_total DECIMAL(10,2),
    observaciones VARCHAR(200),
    repuesto_id BIGINT NOT NULL REFERENCES repuestos(id) ON DELETE CASCADE,
    detalle_servicio_id BIGINT NOT NULL REFERENCES detalle_servicios(id) ON DELETE CASCADE
);

CREATE INDEX if not exists idx_repuesto_id ON detalle_repuestos(repuesto_id);
CREATE INDEX if not exists idx_detalle_servicio_id_dr ON detalle_repuestos(detalle_servicio_id);

-- Tabla: detalle_mecanicos (CORREGIDA con todas las columnas del modelo)
CREATE TABLE if not exists detalle_mecanicos (
    id BIGSERIAL PRIMARY KEY,
    descripcion VARCHAR(500),
    horas_trabajadas DECIMAL(5,2),
    costo_total DECIMAL(10,2),
    mecanico_id BIGINT NOT NULL REFERENCES mecanicos(id) ON DELETE CASCADE,
    detalle_servicio_id BIGINT NOT NULL REFERENCES detalle_servicios(id) ON DELETE CASCADE
);

CREATE INDEX if not exists idx_mecanico_id ON detalle_mecanicos(mecanico_id);
CREATE INDEX if not exists idx_detalle_servicio_id_dm ON detalle_mecanicos(detalle_servicio_id);

-- Comentarios
COMMENT ON TABLE clientes IS 'Tabla que almacena información de los clientes del taller';
COMMENT ON TABLE vehiculos IS 'Tabla que almacena información de los vehículos de los clientes';
COMMENT ON TABLE repuestos IS 'Catálogo de repuestos disponibles en el taller';
COMMENT ON TABLE mecanicos IS 'Información del personal mecánico del taller';
COMMENT ON TABLE servicios IS 'Servicios realizados a los vehículos';
COMMENT ON TABLE detalle_servicios IS 'Detalles específicos de cada servicio';
COMMENT ON TABLE detalle_repuestos IS 'Repuestos utilizados en cada detalle de servicio';
COMMENT ON TABLE detalle_mecanicos IS 'Mecánicos asignados a cada detalle de servicio';

-- Datos de ejemplo
INSERT INTO clientes (nombre, telefono, direccion, ruc_ci, tipo_cliente) VALUES
('Juan Pérez', '0981234567', 'Av. España 123', '1234567-8', 'regular'),
('María González', '0987654321', 'Calle Brasil 456', '8765432-1', 'vip'),
('Carlos López', '0976543210', 'Ruta 2 Km 15', '5555555-5', 'ocasional')
ON CONFLICT (ruc_ci) DO NOTHING;

INSERT INTO vehiculos (marca, chapa, modelo, anio, tipo, cliente_id) VALUES
('Toyota', 'ABC123', 'Corolla', 2020, 'coche', 1),
('Honda', 'XYZ789', 'Civic', 2019, 'coche', 2),
('Yamaha', 'MOT456', 'YBR125', 2021, 'moto', 3)
ON CONFLICT (chapa) DO NOTHING;

INSERT INTO repuestos (codigo, nombre, descripcion, precio, stock_actual, stock_minimo) VALUES
('REP001', 'Aceite Motor 20W50', 'Aceite para motor gasolina', 25000.00, 50, 10),
('REP002', 'Filtro de Aire', 'Filtro de aire universal', 15000.00, 30, 5),
('REP003', 'Pastillas de Freno', 'Pastillas de freno delanteras', 45000.00, 20, 3)
ON CONFLICT (codigo) DO NOTHING;

INSERT INTO mecanicos (nombre, direccion, telefono, fecha_ingreso, especialidad) VALUES
('Pedro Martínez', 'Barrio San Blas', '0991234567', '2020-01-15', 'Motor'),
('Ana Rodríguez', 'Fernando de la Mora', '0997654321', '2019-06-10', 'Transmisión'),
('Luis Fernández', 'Lambaré', '0993456789', '2021-03-20', 'Frenos')
ON CONFLICT DO NOTHING;

INSERT INTO servicios (fecha, descripcion, km_actual, costo_total, vehiculo_id) VALUES
('2024-01-15', 'Cambio de aceite y filtros', 15000, 150000.00, 1),
('2024-01-16', 'Revisión general', 25000, 200000.00, 2),
('2024-01-17', 'Cambio de pastillas de freno', 5000, 75000.00, 3)
ON CONFLICT DO NOTHING;

INSERT INTO detalle_servicios (descripcion, costo, servicio_id) VALUES
('Cambio de aceite motor', 80000.00, 1),
('Cambio de filtro de aire', 70000.00, 1),
('Revisión sistema eléctrico', 200000.00, 2),
('Cambio pastillas freno delanteras', 75000.00, 3)
ON CONFLICT DO NOTHING;

INSERT INTO detalle_repuestos (cantidad, precio_unitario, precio_total, observaciones, repuesto_id, detalle_servicio_id) VALUES
(3, 25000.00, 75000.00, 'Aceite 20W50 para cambio', 1, 1),
(1, 15000.00, 15000.00, 'Filtro de aire nuevo', 2, 2),
(1, 45000.00, 45000.00, 'Pastillas delanteras', 3, 4)
ON CONFLICT DO NOTHING;

INSERT INTO detalle_mecanicos (descripcion, horas_trabajadas, costo_total, mecanico_id, detalle_servicio_id) VALUES
('Cambio de aceite y filtros', 2.00, 50000.00, 1, 1),
('Instalación filtro aire', 1.00, 25000.00, 1, 2),
('Revisión sistema eléctrico', 4.00, 100000.00, 2, 3),
('Cambio pastillas freno', 1.50, 37500.00, 3, 4)
ON CONFLICT DO NOTHING;

-- Vista: servicios completos
CREATE OR REPLACE VIEW vista_servicios_completos AS
SELECT 
    s.id AS servicio_id,
    s.fecha,
    s.descripcion AS servicio_descripcion,
    s.km_actual,
    s.costo_total,
    v.marca,
    v.modelo,
    v.chapa,
    c.nombre AS cliente_nombre,
    c.telefono AS cliente_telefono
FROM servicios s
JOIN vehiculos v ON s.vehiculo_id = v.id
JOIN clientes c ON v.cliente_id = c.id;

-- Vista: repuestos utilizados
CREATE OR REPLACE VIEW vista_repuestos_utilizados AS
SELECT 
    r.codigo,
    r.nombre,
    COALESCE(SUM(dr.cantidad), 0) AS cantidad_total_utilizada,
    COUNT(dr.id) AS veces_utilizado,
    MAX(s.fecha) AS ultima_utilizacion
FROM repuestos r
LEFT JOIN detalle_repuestos dr ON r.id = dr.repuesto_id
LEFT JOIN detalle_servicios ds ON dr.detalle_servicio_id = ds.id
LEFT JOIN servicios s ON ds.servicio_id = s.id
GROUP BY r.id, r.codigo, r.nombre
ORDER BY cantidad_total_utilizada DESC;

-- Vista: mecánicos por especialidad
CREATE OR REPLACE VIEW vista_mecanicos_especialidad AS
SELECT 
    especialidad,
    COUNT(*) AS cantidad_mecanicos,
    STRING_AGG(nombre, ', ') AS nombres_mecanicos
FROM mecanicos
GROUP BY especialidad
ORDER BY cantidad_mecanicos DESC;

-- Vista: detalles completos de servicio
CREATE OR REPLACE VIEW vista_detalles_completos AS
SELECT 
    ds.id AS detalle_id,
    ds.descripcion AS detalle_descripcion,
    ds.costo AS detalle_costo,
    s.fecha AS servicio_fecha,
    s.descripcion AS servicio_descripcion,
    v.marca,
    v.modelo,
    v.chapa,
    c.nombre AS cliente_nombre,
    COALESCE(COUNT(DISTINCT dr.id), 0) AS cantidad_repuestos,
    COALESCE(COUNT(DISTINCT dm.id), 0) AS cantidad_mecanicos
FROM detalle_servicios ds
JOIN servicios s ON ds.servicio_id = s.id
JOIN vehiculos v ON s.vehiculo_id = v.id
JOIN clientes c ON v.cliente_id = c.id
LEFT JOIN detalle_repuestos dr ON ds.id = dr.detalle_servicio_id
LEFT JOIN detalle_mecanicos dm ON ds.id = dm.detalle_servicio_id
GROUP BY ds.id, ds.descripcion, ds.costo, s.fecha, s.descripcion, v.marca, v.modelo, v.chapa, c.nombre
ORDER BY s.fecha DESC;

-- Procedimiento para obtener historial de vehículo
CREATE OR REPLACE FUNCTION obtener_historial_vehiculo(vehiculo_id_param BIGINT)
RETURNS TABLE (
    fecha DATE,
    descripcion VARCHAR,
    km_actual INT,
    costo_total NUMERIC,
    mecanicos TEXT,
    repuestos_utilizados TEXT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.fecha,
        s.descripcion,
        s.km_actual,
        s.costo_total,
        STRING_AGG(DISTINCT m.nombre, ', ') AS mecanicos,
        STRING_AGG(DISTINCT r.nombre || ' (x' || dr.cantidad || ')', ', ') AS repuestos_utilizados
    FROM servicios s
    LEFT JOIN detalle_servicios ds ON s.id = ds.servicio_id
    LEFT JOIN detalle_mecanicos dm ON ds.id = dm.detalle_servicio_id
    LEFT JOIN mecanicos m ON dm.mecanico_id = m.id
    LEFT JOIN detalle_repuestos dr ON ds.id = dr.detalle_servicio_id
    LEFT JOIN repuestos r ON dr.repuesto_id = r.id
    WHERE s.vehiculo_id = vehiculo_id_param
    GROUP BY s.id, s.fecha, s.descripcion, s.km_actual, s.costo_total
    ORDER BY s.fecha DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para calcular costo total de servicio
CREATE OR REPLACE FUNCTION calcular_costo_servicio(servicio_id_param BIGINT)
RETURNS NUMERIC
AS $$
DECLARE
    costo_repuestos NUMERIC := 0;
    costo_mano_obra NUMERIC := 0;
    costo_total NUMERIC := 0;
BEGIN
    -- Calcular costo de repuestos
    SELECT COALESCE(SUM(dr.precio_total), 0)
    INTO costo_repuestos
    FROM detalle_servicios ds
    JOIN detalle_repuestos dr ON ds.id = dr.detalle_servicio_id
    WHERE ds.servicio_id = servicio_id_param;
    
    -- Calcular costo de mano de obra
    SELECT COALESCE(SUM(dm.costo_total), 0)
    INTO costo_mano_obra
    FROM detalle_servicios ds
    JOIN detalle_mecanicos dm ON ds.id = dm.detalle_servicio_id
    WHERE ds.servicio_id = servicio_id_param;
    
    costo_total := costo_repuestos + costo_mano_obra;
    
    RETURN costo_total;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar precio total de detalle repuesto
CREATE OR REPLACE FUNCTION actualizar_precio_total_repuesto()
RETURNS TRIGGER AS $$
BEGIN
    NEW.precio_total := NEW.cantidad * NEW.precio_unitario;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_precio_total
    BEFORE INSERT OR UPDATE ON detalle_repuestos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_precio_total_repuesto();

-- Índices adicionales para mejorar performance
CREATE INDEX IF NOT EXISTS idx_detalle_repuestos_precio ON detalle_repuestos(precio_total);
CREATE INDEX IF NOT EXISTS idx_detalle_mecanicos_costo ON detalle_mecanicos(costo_total);
CREATE INDEX IF NOT EXISTS idx_servicios_fecha_costo ON servicios(fecha, costo_total);
CREATE INDEX IF NOT EXISTS idx_repuestos_stock ON repuestos(stock_actual, stock_minimo);
