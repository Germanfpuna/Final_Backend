package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.DetalleMecanicoDAO;
import py.com.progweb.prueba.ejb.MecanicoDAO;
import py.com.progweb.prueba.ejb.DetalleServicioDAO;
import py.com.progweb.prueba.model.DetalleMecanico;
import py.com.progweb.prueba.model.MecanicoEntity;
import py.com.progweb.prueba.model.DetalleServicio;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

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
}