package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.DetalleRepuestoDAO;
import py.com.progweb.prueba.ejb.RepuestoDAO;
import py.com.progweb.prueba.ejb.DetalleServicioDAO;
import py.com.progweb.prueba.model.DetalleRepuesto;
import py.com.progweb.prueba.model.RepuestoEntity;
import py.com.progweb.prueba.model.DetalleServicio;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/detalle-repuestos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DetalleRepuestosRest {

    @Inject
    private DetalleRepuestoDAO detalleRepuestoDAO;

    @Inject
    private RepuestoDAO repuestoDAO;

    @Inject
    private DetalleServicioDAO detalleServicioDAO;

    @GET
    public Response listar() {
        try {
            List<DetalleRepuesto> detalles = detalleRepuestoDAO.listarTodos();
            return Response.ok(detalles).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener detalles de repuesto: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response obtenerPorId(@PathParam("id") Long id) {
        try {
            DetalleRepuesto detalle = detalleRepuestoDAO.buscarPorId(id);
            if (detalle == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.ok(detalle).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener detalle de repuesto: " + e.getMessage()).build();
        }
    }

    @POST
    public Response agregar(DetalleRepuesto detalleRepuesto) {
        try {
            // Validaciones
            if (detalleRepuesto.getRepuestoId() == null || detalleRepuesto.getRepuestoId() <= 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Repuesto ID es requerido").build();
            }

            if (detalleRepuesto.getDetalleServicioId() == null || detalleRepuesto.getDetalleServicioId() <= 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Detalle Servicio ID es requerido").build();
            }

            if (detalleRepuesto.getCantidad() == null || detalleRepuesto.getCantidad() <= 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Cantidad debe ser mayor a 0").build();
            }

            // Verificar que el repuesto existe
            RepuestoEntity repuesto = repuestoDAO.buscarPorId(detalleRepuesto.getRepuestoId());
            if (repuesto == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Repuesto no encontrado").build();
            }

            // Verificar que el detalle servicio existe
            DetalleServicio detalleServicio = detalleServicioDAO.buscarPorId(detalleRepuesto.getDetalleServicioId());
            if (detalleServicio == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Detalle de servicio no encontrado").build();
            }

            detalleRepuestoDAO.crear(detalleRepuesto);
            return Response.status(Response.Status.CREATED).entity(detalleRepuesto).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al crear detalle de repuesto: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, DetalleRepuesto detalleRepuesto) {
        try {
            DetalleRepuesto existente = detalleRepuestoDAO.buscarPorId(id);
            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }

            if (detalleRepuesto.getCantidad() != null) existente.setCantidad(detalleRepuesto.getCantidad());
            if (detalleRepuesto.getPrecioUnitario() != null) existente.setPrecioUnitario(detalleRepuesto.getPrecioUnitario());
            if (detalleRepuesto.getPrecioTotal() != null) existente.setPrecioTotal(detalleRepuesto.getPrecioTotal());
            if (detalleRepuesto.getObservaciones() != null) existente.setObservaciones(detalleRepuesto.getObservaciones());

            detalleRepuestoDAO.actualizar(existente);
            return Response.ok(existente).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al actualizar detalle de repuesto: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        try {
            DetalleRepuesto detalle = detalleRepuestoDAO.buscarPorId(id);
            if (detalle == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            detalleRepuestoDAO.eliminar(id);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al eliminar detalle de repuesto: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/repuesto/{repuestoId}")
    public Response buscarPorRepuesto(@PathParam("repuestoId") Long repuestoId) {
        try {
            List<DetalleRepuesto> detalles = detalleRepuestoDAO.buscarPorRepuestoId(repuestoId);
            return Response.ok(detalles).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar detalles de repuesto: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/detalle-servicio/{detalleServicioId}")
    public Response buscarPorDetalleServicio(@PathParam("detalleServicioId") Long detalleServicioId) {
        try {
            List<DetalleRepuesto> detalles = detalleRepuestoDAO.buscarPorDetalleServicioId(detalleServicioId);
            return Response.ok(detalles).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar detalles de repuesto: " + e.getMessage()).build();
        }
    }

    // Endpoint para obtener información completa del detalle con datos del repuesto
    @GET
    @Path("/{id}/completo")
    public Response obtenerDetalleCompleto(@PathParam("id") Long id) {
        try {
            DetalleRepuesto detalle = detalleRepuestoDAO.buscarPorId(id);
            if (detalle == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            
            RepuestoEntity repuesto = repuestoDAO.buscarPorId(detalle.getRepuestoId());
            DetalleServicio detalleServicio = detalleServicioDAO.buscarPorId(detalle.getDetalleServicioId());
            
            // Crear un objeto de respuesta con toda la información
            DetalleRepuestoCompletoResponse response = new DetalleRepuestoCompletoResponse(detalle, repuesto, detalleServicio);
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener detalle completo: " + e.getMessage()).build();
        }
    }
}

// Clase auxiliar para respuestas completas
class DetalleRepuestoCompletoResponse {
    private DetalleRepuesto detalleRepuesto;
    private RepuestoEntity repuesto;
    private DetalleServicio detalleServicio;
    
    public DetalleRepuestoCompletoResponse(DetalleRepuesto detalleRepuesto, RepuestoEntity repuesto, DetalleServicio detalleServicio) {
        this.detalleRepuesto = detalleRepuesto;
        this.repuesto = repuesto;
        this.detalleServicio = detalleServicio;
    }
    
    public DetalleRepuesto getDetalleRepuesto() { return detalleRepuesto; }
    public void setDetalleRepuesto(DetalleRepuesto detalleRepuesto) { this.detalleRepuesto = detalleRepuesto; }
    
    public RepuestoEntity getRepuesto() { return repuesto; }
    public void setRepuesto(RepuestoEntity repuesto) { this.repuesto = repuesto; }
    
    public DetalleServicio getDetalleServicio() { return detalleServicio; }
    public void setDetalleServicio(DetalleServicio detalleServicio) { this.detalleServicio = detalleServicio; }
}