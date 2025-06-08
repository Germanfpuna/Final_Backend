package py.com.progweb.prueba.ejb;

import py.com.progweb.prueba.model.DetalleServicio;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Stateless
public class DetalleServicioDAO {

    @PersistenceContext(unitName = "pruebaPU")
    private EntityManager em;

    public void crear(DetalleServicio detalleServicio) {
        em.persist(detalleServicio);
    }

    public DetalleServicio buscarPorId(Long id) {
        return em.find(DetalleServicio.class, id);
    }

    public List<DetalleServicio> listarTodos() {
        TypedQuery<DetalleServicio> query = em.createQuery("SELECT ds FROM DetalleServicio ds", DetalleServicio.class);
        return query.getResultList();
    }

    public void actualizar(DetalleServicio detalleServicio) {
        em.merge(detalleServicio);
    }

    public void eliminar(Long id) {
        DetalleServicio detalleServicio = buscarPorId(id);
        if (detalleServicio != null) {
            em.remove(detalleServicio);
        }
    }

    public List<DetalleServicio> buscarPorServicio(Long servicioId) {
        TypedQuery<DetalleServicio> query = em.createQuery(
            "SELECT ds FROM DetalleServicio ds WHERE ds.servicio.id = :servicioId", 
            DetalleServicio.class);
        query.setParameter("servicioId", servicioId);
        return query.getResultList();
    }
}