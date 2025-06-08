package py.com.progweb.prueba.rest;

import javax.ws.rs.*;
import java.util.HashMap;
import java.util.Map;

@Path("test")
@Produces("application/json")
@Consumes("application/json")
public class RestPrueba {

    @GET
    @Path("/saludo")
    public Map<String,String> saludo(@QueryParam("nombre") String nombre) {
        Map<String,String> mapa=new HashMap<String, String>();
        mapa.put("mensaje","hola "+nombre);
        return mapa;
    }
}
