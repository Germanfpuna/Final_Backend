package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.MecanicoDAO;
import py.com.progweb.prueba.model.MecanicoEntity;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/mecanicos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MecanicosRest {

    @Inject
    private MecanicoDAO mecanicoDAO;

    @GET
    public Response listar() {
        try {
            List<MecanicoEntity> mecanicos = mecanicoDAO.listarTodos();
            return Response.ok(mecanicos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener mecánicos: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response obtenerPorId(@PathParam("id") Long id) {
        try {
            MecanicoEntity mecanico = mecanicoDAO.buscarPorId(id);
            if (mecanico == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.ok(mecanico).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener mecánico: " + e.getMessage()).build();
        }
    }

    @POST
    public Response agregar(MecanicoEntity mecanico) {
        try {
            mecanicoDAO.crear(mecanico);
            return Response.status(Response.Status.CREATED).entity(mecanico).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al crear mecánico: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, MecanicoEntity mecanico) {
        try {
            MecanicoEntity existente = mecanicoDAO.buscarPorId(id);
            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            
            if (mecanico.getNombre() != null) existente.setNombre(mecanico.getNombre());
            if (mecanico.getDireccion() != null) existente.setDireccion(mecanico.getDireccion());
            if (mecanico.getTelefono() != null) existente.setTelefono(mecanico.getTelefono());
            if (mecanico.getFechaIngreso() != null) existente.setFechaIngreso(mecanico.getFechaIngreso());
            if (mecanico.getEspecialidad() != null) existente.setEspecialidad(mecanico.getEspecialidad());
            
            mecanicoDAO.actualizar(existente);
            return Response.ok(existente).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al actualizar mecánico: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        try {
            MecanicoEntity mecanico = mecanicoDAO.buscarPorId(id);
            if (mecanico == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            mecanicoDAO.eliminar(id);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al eliminar mecánico: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/especialidad/{especialidad}")
    public Response buscarPorEspecialidad(@PathParam("especialidad") String especialidad) {
        try {
            List<MecanicoEntity> mecanicos = mecanicoDAO.buscarPorEspecialidad(especialidad);
            return Response.ok(mecanicos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar mecánicos: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/nombre/{nombre}")
    public Response buscarPorNombre(@PathParam("nombre") String nombre) {
        try {
            List<MecanicoEntity> mecanicos = mecanicoDAO.buscarPorNombre(nombre);
            return Response.ok(mecanicos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar mecánicos: " + e.getMessage()).build();
        }
    }
}