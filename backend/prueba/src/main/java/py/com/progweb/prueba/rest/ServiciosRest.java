package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.ServicioDAO;
import py.com.progweb.prueba.model.ServicioEntity;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.LocalDate;
import java.util.List;

@Path("/servicios")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ServiciosRest {

    @Inject
    private ServicioDAO servicioDAO;

    @GET
    public Response listar() {
        try {
            List<ServicioEntity> servicios = servicioDAO.listarTodos();
            return Response.ok(servicios).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener servicios: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response obtenerPorId(@PathParam("id") Long id) {
        try {
            ServicioEntity servicio = servicioDAO.buscarPorId(id);
            if (servicio == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.ok(servicio).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener servicio: " + e.getMessage()).build();
        }
    }

    @POST
    public Response agregar(ServicioEntity servicio) {
        try {
            servicioDAO.crear(servicio);
            return Response.status(Response.Status.CREATED).entity(servicio).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al crear servicio: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, ServicioEntity servicio) {
        try {
            ServicioEntity existente = servicioDAO.buscarPorId(id);
            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            
            if (servicio.getFecha() != null) existente.setFecha(servicio.getFecha());
            if (servicio.getDescripcion() != null) existente.setDescripcion(servicio.getDescripcion());
            if (servicio.getKmActual() != null) existente.setKmActual(servicio.getKmActual());
            if (servicio.getCostoTotal() != null) existente.setCostoTotal(servicio.getCostoTotal());
            
            servicioDAO.actualizar(existente);
            return Response.ok(existente).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al actualizar servicio: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        try {
            ServicioEntity servicio = servicioDAO.buscarPorId(id);
            if (servicio == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            servicioDAO.eliminar(id);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al eliminar servicio: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/vehiculo/{vehiculoId}")
    public Response buscarPorVehiculo(@PathParam("vehiculoId") Long vehiculoId) {
        try {
            List<ServicioEntity> servicios = servicioDAO.buscarPorVehiculo(vehiculoId);
            return Response.ok(servicios).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar servicios: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/cliente/{clienteId}")
    public Response buscarPorCliente(@PathParam("clienteId") Long clienteId) {
        try {
            List<ServicioEntity> servicios = servicioDAO.buscarPorCliente(clienteId);
            return Response.ok(servicios).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar servicios: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/fecha")
    public Response buscarPorFecha(@QueryParam("inicio") String fechaInicio, 
                                  @QueryParam("fin") String fechaFin) {
        try {
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFin);
            List<ServicioEntity> servicios = servicioDAO.buscarPorFecha(inicio, fin);
            return Response.ok(servicios).build();
        } catch (Exception e) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Error en parámetros de fecha: " + e.getMessage()).build();
        }
    }
}