package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.DetalleMecanicoDAO;
import py.com.progweb.prueba.ejb.MecanicoDAO;
import py.com.progweb.prueba.ejb.DetalleServicioDAO;
import py.com.progweb.prueba.ejb.ServicioDAO;
import py.com.progweb.prueba.model.DetalleMecanico;
import py.com.progweb.prueba.model.MecanicoEntity;
import py.com.progweb.prueba.model.DetalleServicio;
import py.com.progweb.prueba.model.ServicioEntity;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.ArrayList;

@Path("/detalle-mecanicos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class DetalleMecanicosRest {

    @Inject
    private DetalleMecanicoDAO detalleMecanicoDAO;

    @Inject
    private MecanicoDAO mecanicoDAO;

    @Inject
    private DetalleServicioDAO detalleServicioDAO;

    @Inject
    private ServicioDAO servicioDAO;

    @GET
    public Response listar() {
        try {
            List<DetalleMecanico> detalles = detalleMecanicoDAO.listarTodos();
            return Response.ok(detalles).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener detalles de mecánico: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response buscarPorId(@PathParam("id") Long id) {
        try {
            DetalleMecanico detalle = detalleMecanicoDAO.buscarPorId(id);
            if (detalle == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Detalle de mecánico no encontrado").build();
            }
            return Response.ok(detalle).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar detalle: " + e.getMessage()).build();
        }
    }

    @POST
    public Response agregar(DetalleMecanico detalleMecanico) {
        try {
            // Validaciones
            if (detalleMecanico.getMecanicoId() == null || detalleMecanico.getMecanicoId() <= 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Mecánico ID es requerido").build();
            }

            if (detalleMecanico.getDetalleServicioId() == null || detalleMecanico.getDetalleServicioId() <= 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Detalle Servicio ID es requerido").build();
            }

            // Verificar que el mecánico existe
            MecanicoEntity mecanico = mecanicoDAO.buscarPorId(detalleMecanico.getMecanicoId());
            if (mecanico == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Mecánico no encontrado").build();
            }

            // Verificar que el detalle servicio existe
            DetalleServicio detalleServicio = detalleServicioDAO.buscarPorId(detalleMecanico.getDetalleServicioId());
            if (detalleServicio == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Detalle de servicio no encontrado").build();
            }

            detalleMecanicoDAO.crear(detalleMecanico);
            return Response.status(Response.Status.CREATED).entity(detalleMecanico).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al crear detalle de mecánico: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, DetalleMecanico detalleMecanico) {
        try {
            DetalleMecanico existente = detalleMecanicoDAO.buscarPorId(id);
            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Detalle de mecánico no encontrado").build();
            }

            detalleMecanico.setId(id);
            detalleMecanicoDAO.actualizar(detalleMecanico);
            return Response.ok(detalleMecanico).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al actualizar detalle: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        try {
            DetalleMecanico detalle = detalleMecanicoDAO.buscarPorId(id);
            if (detalle == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Detalle de mecánico no encontrado").build();
            }

            detalleMecanicoDAO.eliminar(id);
            return Response.ok().entity("Detalle eliminado exitosamente").build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al eliminar detalle: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/mecanico/{mecanicoId}")
    public Response buscarPorMecanico(@PathParam("mecanicoId") Long mecanicoId) {
        try {
            List<DetalleMecanico> detalles = detalleMecanicoDAO.buscarPorMecanicoId(mecanicoId);
            return Response.ok(detalles).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar detalles: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/servicio/{servicioId}")
    public Response buscarPorServicio(@PathParam("servicioId") Long servicioId) {
        try {
            // Verificar que el servicio existe
            ServicioEntity servicio = servicioDAO.buscarPorId(servicioId);
            if (servicio == null) {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Servicio no encontrado").build();
            }

            // Obtener todos los detalles de servicio para este servicio
            List<DetalleServicio> detallesServicio = detalleServicioDAO.buscarPorServicioId(servicioId);
            
            List<DetalleMecanico> todosMecanicos = new ArrayList<>();
            
            // Para cada detalle de servicio, obtener los mecánicos asignados
            for (DetalleServicio detalleServicio : detallesServicio) {
                List<DetalleMecanico> mecanicosPorDetalle = detalleMecanicoDAO.buscarPorDetalleServicioId(detalleServicio.getId());
                todosMecanicos.addAll(mecanicosPorDetalle);
            }

            return Response.ok(todosMecanicos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar mecánicos por servicio: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/detalle-servicio/{detalleServicioId}")
    public Response buscarPorDetalleServicio(@PathParam("detalleServicioId") Long detalleServicioId) {
        try {
            List<DetalleMecanico> detalles = detalleMecanicoDAO.buscarPorDetalleServicioId(detalleServicioId);
            return Response.ok(detalles).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar detalles por detalle servicio: " + e.getMessage()).build();
        }
    }
}