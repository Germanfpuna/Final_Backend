package py.com.progweb.prueba.rest;

import py.com.progweb.prueba.ejb.VehiculoDAO;
import py.com.progweb.prueba.ejb.ClientesDAO;
import py.com.progweb.prueba.model.VehiculoEntity;
import py.com.progweb.prueba.model.ClienteEntity;

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

    @Inject
    private ClientesDAO clienteDAO;

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
            // Validate required fields
            if (vehiculo.getChapa() == null || vehiculo.getChapa().trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Chapa es requerida").build();
            }
            
            if (vehiculo.getMarca() == null || vehiculo.getMarca().trim().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Marca es requerida").build();
            }
            
            // Validate tipo is provided
            if (vehiculo.getTipo() == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Tipo de vehículo es requerido").build();
            }
            
            // Validate tipo values
            String tipoStr = vehiculo.getTipo();
            if (!tipoStr.equals("moto") && !tipoStr.equals("coche") && 
                !tipoStr.equals("camioneta") && !tipoStr.equals("camion")) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Tipo de vehículo inválido. Valores permitidos: moto, coche, camioneta, camion").build();
            }
            // Check if chapa already exists
            try {
                VehiculoEntity existingVehiculo = vehiculoDAO.buscarPorChapa(vehiculo.getChapa());
                if (existingVehiculo != null) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity("Ya existe un vehículo con la chapa: " + vehiculo.getChapa()).build();
                }
            } catch (Exception e) {
                // Chapa doesn't exist, continue
            }

            // Validate cliente ID
            if (vehiculo.getClienteId() == null || vehiculo.getClienteId() <= 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Cliente ID es requerido y debe ser mayor a 0").build();
            }
            
            // Verify client exists
            ClienteEntity cliente = clienteDAO.buscarPorId(vehiculo.getClienteId());
            if (cliente == null) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Cliente no encontrado con ID: " + vehiculo.getClienteId()).build();
            }
            
            // Log for debugging
            System.out.println("Creando vehículo: " + vehiculo.toString());
            
            vehiculoDAO.crear(vehiculo);
            return Response.status(Response.Status.CREATED).entity(vehiculo).build();
            
        } catch (Exception e) {
            e.printStackTrace(); // Para debugging
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al crear vehículo: " + e.getMessage() + 
                           "\nTipo de error: " +
                           "\nVehiculo: "+ vehiculo.toString() +
                           e.getClass().getSimpleName()).build();
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

            // Handle client update if provided
            if (vehiculo.getClienteId() != null && vehiculo.getClienteId() > 0) {
                ClienteEntity cliente = clienteDAO.buscarPorId(vehiculo.getClienteId());
                if (cliente == null) {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity("Cliente no encontrado con ID: " + vehiculo.getClienteId()).build();
                }
                existente.setClienteId(vehiculo.getClienteId());
            }

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
            List<VehiculoEntity> vehiculos = vehiculoDAO.buscarPorClienteId(clienteId);
            return Response.ok(vehiculos).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al buscar vehículos: " + e.getMessage()).build();
        }
    }

    // Endpoint para obtener información completa del vehículo con datos del cliente
    @GET
    @Path("/{id}/completo")
    public Response obtenerVehiculoCompleto(@PathParam("id") Long id) {
        try {
            VehiculoEntity vehiculo = vehiculoDAO.buscarPorId(id);
            if (vehiculo == null) {
                return Response.status(Response.Status.NOT_FOUND).build();
            }
            
            ClienteEntity cliente = clienteDAO.buscarPorId(vehiculo.getClienteId());
            
            // Crear un objeto de respuesta con toda la información
            VehiculoCompletoResponse response = new VehiculoCompletoResponse(vehiculo, cliente);
            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener vehículo completo: " + e.getMessage()).build();
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
}

// Clase auxiliar para respuestas completas
class VehiculoCompletoResponse {
    private VehiculoEntity vehiculo;
    private ClienteEntity cliente;
    
    public VehiculoCompletoResponse(VehiculoEntity vehiculo, ClienteEntity cliente) {
        this.vehiculo = vehiculo;
        this.cliente = cliente;
    }
    
    public VehiculoEntity getVehiculo() { return vehiculo; }
    public void setVehiculo(VehiculoEntity vehiculo) { this.vehiculo = vehiculo; }
    
    public ClienteEntity getCliente() { return cliente; }
    public void setCliente(ClienteEntity cliente) { this.cliente = cliente; }
}