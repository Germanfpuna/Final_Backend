# Taller Mecánico - Sistema de Gestión

Este proyecto es un sistema de gestión para talleres mecánicos desarrollado con Java EE y React. Proporciona APIs RESTful para gestionar clientes, vehículos, repuestos, mecánicos y servicios.

## Requisitos

### Backend
- Java 8+
- WildFly 18.0.1+
- PostgreSQL 12+
- Maven 3.6+

### Frontend
- Node.js 16+ o superior
- npm 7+ o superior
- React 18+

## Estructura del Proyecto

```
Final Back/
├── backend/
│   └── prueba/
│       ├── src/main/java/py/com/progweb/prueba/
│       │   ├── ejb/          # Componentes EJB para lógica de negocio
│       │   ├── model/        # Entidades JPA
│       │   └── rest/         # Servicios web RESTful
│       ├── src/main/resources/META-INF/  # Configuración de persistencia
│       └── src/main/webapp/WEB-INF/      # Configuración de aplicación web
└── frontend/
    ├── src/
    │   ├── components/       # Componentes React reutilizables
    │   ├── pages/           # Páginas de la aplicación
    │   ├── services/        # APIs y servicios
    │   └── App.js          # Componente principal
    ├── package.json
    └── public/
```

## Dependencias

### Backend
- Hibernate 5.6.15.Final
- CDI API 1.2
- EJB API 3.2
- JAX-RS API 2.1.1
- Jackson Databind 2.15.3
- PostgreSQL Driver 42.2.18

### Frontend
- React 18.x
- React Bootstrap 2.x
- Axios para peticiones HTTP
- React Router DOM para navegación

## Configuración

### Base de Datos

1. Crear base de datos PostgreSQL:
```sql
CREATE DATABASE taller_mecanico;
```

2. Ejecutar el script SQL de inicialización:
```bash
psql -d taller_mecanico -f backup.sql
```

### WildFly

1. Configurar datasource en WildFly:
```xml
<datasource jndi-name="java:jboss/datasources/pruebaPU" pool-name="pruebaPU">
    <connection-url>jdbc:postgresql://localhost:5432/taller_mecanico</connection-url>
    <driver>postgresql</driver>
    <security>
        <user-name>postgres</user-name>
        <password>your_password</password>
    </security>
</datasource>
```

## Despliegue

### Backend

1. Compilar el proyecto:
```bash
cd backend/prueba
mvn clean install
```

2. Desplegar en WildFly:
```bash
mvn wildfly:deploy
```

O copiar manualmente `target/prueba.war` a `wildfly/standalone/deployments/`

### Frontend

1. Navegar al directorio frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

4. Abrir navegador en `http://localhost:5173`

### Construcción para Producción

1. Construir frontend para producción:
```bash
npm run build
```

2. Los archivos estáticos estarán en `build/`

## APIs Disponibles

El backend proporciona las siguientes APIs RESTful:

- **GET/POST/PUT/DELETE** `/api/clientes` - Gestionar clientes
- **GET/POST/PUT/DELETE** `/api/vehiculos` - Gestionar vehículos
- **GET/POST/PUT/DELETE** `/api/repuestos` - Gestionar repuestos
- **GET/POST/PUT/DELETE** `/api/mecanicos` - Gestionar mecánicos
- **GET/POST/PUT/DELETE** `/api/servicios` - Gestionar servicios
- **GET/POST/PUT/DELETE** `/api/detalle-servicios` - Gestionar detalles de servicios
- **GET/POST/PUT/DELETE** `/api/detalle-repuestos` - Gestionar uso de repuestos
- **GET/POST/PUT/DELETE** `/api/detalle-mecanicos` - Gestionar asignación de mecánicos


## Funcionalidades

### Gestión de Clientes
- Registro de clientes (ocasional, regular, VIP)
- Búsqueda por nombre, RUC/CI
- Historial de vehículos por cliente

### Gestión de Vehículos
- Registro de vehículos por cliente
- Tipos: moto, coche, camioneta, camión
- Búsqueda por chapa, marca, modelo

### Gestión de Repuestos
- Control de inventario
- Alertas de stock mínimo
- Seguimiento de precios

### Gestión de Servicios
- Registro de servicios realizados
- Asignación de mecánicos
- Control de repuestos utilizados
- Cálculo automático de costos

## Solución de Problemas

### Backend no inicia
- Verificar que PostgreSQL esté ejecutándose
- Verificar configuración del datasource en WildFly
- Revisar logs en `wildfly/standalone/log/server.log`

### Frontend no conecta al backend
- Verificar que WildFly esté ejecutándose en puerto 8080
- Verificar URL de API en `src/services/api.js`
- Verificar configuración CORS

### Errores de CORS
- Agregar filtro CORS en el backend
- Verificar headers en peticiones HTTP

## Desarrollo

### Agregar nuevas entidades
1. Crear entidad JPA en `model/`
2. Crear DAO en `ejb/`
3. Crear REST endpoint en `rest/`
4. Actualizar base de datos
5. Crear componentes React correspondientes

### Debugging
- Backend: Usar logs de WildFly y debugging remoto
- Frontend: Usar React Developer Tools y browser console

## Licencia

Este proyecto está bajo la Licencia MIT.