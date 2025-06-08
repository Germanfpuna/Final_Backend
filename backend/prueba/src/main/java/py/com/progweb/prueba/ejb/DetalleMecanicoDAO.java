package py.com.progweb.prueba.ejb;

import py.com.progweb.prueba.model.DetalleMecanico;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
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

    public List<DetalleMecanico> buscarPorDetalleServicio(Long detalleServicioId) {
        TypedQuery<DetalleMecanico> query = em.createQuery(
            "SELECT dm FROM DetalleMecanico dm WHERE dm.detalleServicio.id = :detalleServicioId", 
            DetalleMecanico.class);
        query.setParameter("detalleServicioId", detalleServicioId);
        return query.getResultList();
    }

    public List<DetalleMecanico> buscarPorMecanico(Long mecanicoId) {
        TypedQuery<DetalleMecanico> query = em.createQuery(
            "SELECT dm FROM DetalleMecanico dm WHERE dm.mecanico.id = :mecanicoId", 
            DetalleMecanico.class);
        query.setParameter("mecanicoId", mecanicoId);
        return query.getResultList();
    }
}