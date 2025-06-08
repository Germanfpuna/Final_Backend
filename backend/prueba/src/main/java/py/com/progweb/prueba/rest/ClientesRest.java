package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.ClientesDAO;
import py.com.progweb.prueba.model.ClienteEntity;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/clientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClientesRest {

    @Inject
    private ClientesDAO clienteDAO;

    @GET
    public Response listar() {
        try {
            List<ClienteEntity> clientes = clienteDAO.listarTodos();
            return Response.ok(clientes).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener clientes: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/{id}")
    public Response obtenerPorId(@PathParam("id") Long id) {
        try {
            ClienteEntity cliente = clienteDAO.buscarPorId(id);
            if (cliente == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            return Response.ok(cliente).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener cliente: " + e.getMessage()).build();
        }
    }

    @POST
    public Response agregar(ClienteEntity cliente) {
        try {
            clienteDAO.crear(cliente);
            return Response.status(Response.Status.CREATED).entity(cliente).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al crear cliente: " + e.getMessage()).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response actualizar(@PathParam("id") Long id, ClienteEntity cliente) {
        try {
            ClienteEntity existente = clienteDAO.buscarPorId(id);
            if (existente == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            
            if (cliente.getNombre() != null) existente.setNombre(cliente.getNombre());
            if (cliente.getTelefono() != null) existente.setTelefono(cliente.getTelefono());
            if (cliente.getDireccion() != null) existente.setDireccion(cliente.getDireccion());
            if (cliente.getRucCi() != null) existente.setRucCi(cliente.getRucCi());
            if (cliente.getTipoCliente() != null) existente.setTipoCliente(cliente.getTipoCliente());
            
            clienteDAO.actualizar(existente);
            return Response.ok(existente).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al actualizar cliente: " + e.getMessage()).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response eliminar(@PathParam("id") Long id) {
        try {
            ClienteEntity cliente = clienteDAO.buscarPorId(id);
            if (cliente == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            clienteDAO.eliminar(id);
            return Response.ok().build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al eliminar cliente: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/buscar/nombre/{nombre}")
    public Response buscarPorNombre(@PathParam("nombre") String nombre) {
        try {
            List<ClienteEntity> clientes = clienteDAO.buscarPorNombre(nombre);
            return Response.ok(clientes).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar clientes: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/buscar/ruc/{rucCi}")
    public Response buscarPorRucCi(@PathParam("rucCi") String rucCi) {
        try {
            ClienteEntity cliente = clienteDAO.buscarPorRucCi(rucCi);
            return Response.ok(cliente).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Cliente no encontrado").build();
        }
    }
}