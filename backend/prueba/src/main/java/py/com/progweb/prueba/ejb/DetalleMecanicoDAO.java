package py.com.progweb.prueba.ejb;

import py.com.progweb.prueba.model.DetalleMecanico;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class DetalleMecanicoDAO {

    @PersistenceContext(unitName = "pruebaPU")
    private EntityManager em;

    public void crear(DetalleMecanico detalleMecanico) {
        em.persist(detalleMecanico);
    }

    public DetalleMecanico buscarPorId(Long id) {
        return em.find(DetalleMecanico.class, id);
    }

    public List<DetalleMecanico> listarTodos() {
        TypedQuery<DetalleMecanico> query = em.createQuery("SELECT dm FROM DetalleMecanico dm", DetalleMecanico.class);
        return query.getResultList();
    }

    public void actualizar(DetalleMecanico detalleMecanico) {
        em.merge(detalleMecanico);
    }

    public void eliminar(Long id) {
        DetalleMecanico detalleMecanico = buscarPorId(id);
        if (detalleMecanico != null) {
            em.remove(detalleMecanico);
        }
    }

    public List<DetalleMecanico> buscarPorMecanicoId(Long mecanicoId) {
        TypedQuery<DetalleMecanico> query = em.createQuery(
            "SELECT dm FROM DetalleMecanico dm WHERE dm.mecanicoId = :mecanicoId", 
            DetalleMecanico.class);
        query.setParameter("mecanicoId", mecanicoId);
        return query.getResultList();
    }

    public List<DetalleMecanico> buscarPorDetalleServicioId(Long detalleServicioId) {
        try {
            return em.createQuery(
                "SELECT dm FROM DetalleMecanico dm WHERE dm.detalleServicioId = :detalleServicioId", 
                DetalleMecanico.class)
                .setParameter("detalleServicioId", detalleServicioId)
                .getResultList();
        } catch (Exception e) {
            System.out.println("Error al buscar por detalle servicio ID: " + e.getMessage());
            List<DetalleMecanico> emptyList = new ArrayList<DetalleMecanico>();
            return emptyList;
        }
    }
}