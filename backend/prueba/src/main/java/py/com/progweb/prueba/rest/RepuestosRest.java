package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.RepuestoDAO;
import py.com.progweb.prueba.model.RepuestoEntity;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/repuestos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RepuestosRest {

    @Inject
    private RepuestoDAO repuestoDAO;

    @GET
    public Response listar() {
        try {
            List<RepuestoEntity> repuestos = repuestoDAO.listarTodos();
            return Response.ok(repuestos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener repuestos: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response obtenerPorId(@PathParam("id") Long id) {
        try {
            RepuestoEntity repuesto = repuestoDAO.buscarPorId(id);
            if (repuesto == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.ok(repuesto).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener repuesto: " + e.getMessage()).build();
        }
    }

    @POST
    public Response agregar(RepuestoEntity repuesto) {
        try {
            repuestoDAO.crear(repuesto);
            return Response.status(Response.Status.CREATED).entity(repuesto).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al crear repuesto: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, RepuestoEntity repuesto) {
        try {
            RepuestoEntity existente = repuestoDAO.buscarPorId(id);
            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            
            if (repuesto.getCodigo() != null) existente.setCodigo(repuesto.getCodigo());
            if (repuesto.getNombre() != null) existente.setNombre(repuesto.getNombre());
            
            repuestoDAO.actualizar(existente);
            return Response.ok(existente).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al actualizar repuesto: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        try {
            RepuestoEntity repuesto = repuestoDAO.buscarPorId(id);
            if (repuesto == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            repuestoDAO.eliminar(id);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al eliminar repuesto: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/codigo/{codigo}")
    public Response buscarPorCodigo(@PathParam("codigo") String codigo) {
        try {
            RepuestoEntity repuesto = repuestoDAO.buscarPorCodigo(codigo);
            return Response.ok(repuesto).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Repuesto no encontrado").build();
        }
    }

    @GET
    @Path("/nombre/{nombre}")
    public Response buscarPorNombre(@PathParam("nombre") String nombre) {
        try {
            List<RepuestoEntity> repuestos = repuestoDAO.buscarPorNombre(nombre);
            return Response.ok(repuestos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar repuestos: " + e.getMessage()).build();
        }
    }
}