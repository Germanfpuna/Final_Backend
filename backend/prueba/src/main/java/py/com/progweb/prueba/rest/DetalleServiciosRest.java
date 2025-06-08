package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.DetalleServicioDAO;
import py.com.progweb.prueba.model.DetalleServicio;

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
            List<DetalleServicio> detalles = detalleServicioDAO.buscarPorServicio(servicioId);
            return Response.ok(detalles).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar detalles de servicio: " + e.getMessage()).build();
        }
    }
}