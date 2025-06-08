package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.VehiculoDAO;
import py.com.progweb.prueba.model.VehiculoEntity;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/vehiculos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class VehiculosRest {

    @Inject
    private VehiculoDAO vehiculoDAO;

    @GET
    public Response listar() {
        try {
            List<VehiculoEntity> vehiculos = vehiculoDAO.listarTodos();
            return Response.ok(vehiculos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener vehículos: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response obtenerPorId(@PathParam("id") Long id) {
        try {
            VehiculoEntity vehiculo = vehiculoDAO.buscarPorId(id);
            if (vehiculo == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.ok(vehiculo).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener vehículo: " + e.getMessage()).build();
        }
    }

    @POST
    public Response agregar(VehiculoEntity vehiculo) {
        try {
            vehiculoDAO.crear(vehiculo);
            return Response.status(Response.Status.CREATED).entity(vehiculo).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al crear vehículo: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, VehiculoEntity vehiculo) {
        try {
            VehiculoEntity existente = vehiculoDAO.buscarPorId(id);
            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            
            if (vehiculo.getMarca() != null) existente.setMarca(vehiculo.getMarca());
            if (vehiculo.getChapa() != null) existente.setChapa(vehiculo.getChapa());
            if (vehiculo.getModelo() != null) existente.setModelo(vehiculo.getModelo());
            if (vehiculo.getAnio() != null) existente.setAnio(vehiculo.getAnio());
            if (vehiculo.getTipo() != null) existente.setTipo(vehiculo.getTipo());
            
            vehiculoDAO.actualizar(existente);
            return Response.ok(existente).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al actualizar vehículo: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        try {
            VehiculoEntity vehiculo = vehiculoDAO.buscarPorId(id);
            if (vehiculo == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            vehiculoDAO.eliminar(id);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al eliminar vehículo: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/cliente/{clienteId}")
    public Response buscarPorCliente(@PathParam("clienteId") Long clienteId) {
        try {
            List<VehiculoEntity> vehiculos = vehiculoDAO.buscarPorCliente(clienteId);
            return Response.ok(vehiculos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar vehículos: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/chapa/{chapa}")
    public Response buscarPorChapa(@PathParam("chapa") String chapa) {
        try {
            VehiculoEntity vehiculo = vehiculoDAO.buscarPorChapa(chapa);
            return Response.ok(vehiculo).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Vehículo no encontrado").build();
        }
    }

    @GET
    @Path("/marca/{marca}")
    public Response buscarPorMarca(@PathParam("marca") String marca) {
        try {
            List<VehiculoEntity> vehiculos = vehiculoDAO.buscarPorMarca(marca);
            return Response.ok(vehiculos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar vehículos: " + e.getMessage()).build();
        }
    }
}