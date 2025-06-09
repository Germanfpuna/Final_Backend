package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.DetalleServicioDAO;
import py.com.progweb.prueba.ejb.ServicioDAO;
import py.com.progweb.prueba.model.DetalleServicio;
import py.com.progweb.prueba.model.ServicioEntity;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/detalle-servicios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DetalleServiciosRest {

    @Inject
    private DetalleServicioDAO detalleServicioDAO;

    @Inject
    private ServicioDAO servicioDAO;

    @GET
    public Response listar() {
        try {
            List<DetalleServicio> detalles = detalleServicioDAO.listarTodos();
            return Response.ok(detalles).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener detalles de servicio: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response obtenerPorId(@PathParam("id") Long id) {
        try {
            DetalleServicio detalle = detalleServicioDAO.buscarPorId(id);
            if (detalle == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.ok(detalle).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener detalle de servicio: " + e.getMessage()).build();
        }
    }

    @POST
    public Response agregar(DetalleServicio detalleServicio) {
        try {
            // Validate required fields
            if (detalleServicio.getDescripcion() == null || detalleServicio.getDescripcion().trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Descripción es requerida").build();
            }

            if (detalleServicio.getCosto() == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Costo es requerido").build();
            }

            // Validate servicio ID
            if (detalleServicio.getServicioId() == null || detalleServicio.getServicioId() <= 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Servicio ID es requerido y debe ser mayor a 0").build();
            }
            
            // Verify service exists
            ServicioEntity servicio = servicioDAO.buscarPorId(detalleServicio.getServicioId());
            if (servicio == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Servicio no encontrado con ID: " + detalleServicio.getServicioId()).build();
            }
            
            detalleServicioDAO.crear(detalleServicio);
            return Response.status(Response.Status.CREATED).entity(detalleServicio).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al crear detalle de servicio: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, DetalleServicio detalleServicio) {
        try {
            DetalleServicio existente = detalleServicioDAO.buscarPorId(id);
            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            
            if (detalleServicio.getDescripcion() != null) existente.setDescripcion(detalleServicio.getDescripcion());
            if (detalleServicio.getCosto() != null) existente.setCosto(detalleServicio.getCosto());
            
            // Handle service update if provided
            if (detalleServicio.getServicioId() != null && detalleServicio.getServicioId() > 0) {
                ServicioEntity servicio = servicioDAO.buscarPorId(detalleServicio.getServicioId());
                if (servicio == null) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity("Servicio no encontrado con ID: " + detalleServicio.getServicioId()).build();
                }
                existente.setServicioId(detalleServicio.getServicioId());
            }
            
            detalleServicioDAO.actualizar(existente);
            return Response.ok(existente).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al actualizar detalle de servicio: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        try {
            DetalleServicio detalle = detalleServicioDAO.buscarPorId(id);
            if (detalle == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            detalleServicioDAO.eliminar(id);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al eliminar detalle de servicio: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/servicio/{servicioId}")
    public Response buscarPorServicio(@PathParam("servicioId") Long servicioId) {
        try {
            List<DetalleServicio> detalles = detalleServicioDAO.buscarPorServicioId(servicioId);
            return Response.ok(detalles).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar detalles de servicio: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/descripcion/{descripcion}")
    public Response buscarPorDescripcion(@PathParam("descripcion") String descripcion) {
        try {
            List<DetalleServicio> detalles = detalleServicioDAO.buscarPorDescripcion(descripcion);
            return Response.ok(detalles).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar detalles de servicio: " + e.getMessage()).build();
        }
    }

    // Endpoint para obtener información completa del detalle con datos del servicio
    @GET
    @Path("/{id}/completo")
    public Response obtenerDetalleCompleto(@PathParam("id") Long id) {
        try {
            DetalleServicio detalle = detalleServicioDAO.buscarPorId(id);
            if (detalle == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            
            ServicioEntity servicio = servicioDAO.buscarPorId(detalle.getServicioId());
            
            // Crear un objeto de respuesta con toda la información
            DetalleCompletoResponse response = new DetalleCompletoResponse(detalle, servicio);
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener detalle completo: " + e.getMessage()).build();
        }
    }
}

// Clase auxiliar para respuestas completas
class DetalleCompletoResponse {
    private DetalleServicio detalleServicio;
    private ServicioEntity servicio;
    
    public DetalleCompletoResponse(DetalleServicio detalleServicio, ServicioEntity servicio) {
        this.detalleServicio = detalleServicio;
        this.servicio = servicio;
    }
    
    public DetalleServicio getDetalleServicio() { return detalleServicio; }
    public void setDetalleServicio(DetalleServicio detalleServicio) { this.detalleServicio = detalleServicio; }
    
    public ServicioEntity getServicio() { return servicio; }
    public void setServicio(ServicioEntity servicio) { this.servicio = servicio; }
}