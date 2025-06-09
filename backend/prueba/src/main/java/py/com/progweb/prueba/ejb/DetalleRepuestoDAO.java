package py.com.progweb.prueba.ejb;

import py.com.progweb.prueba.model.DetalleRepuesto;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Stateless
public class DetalleRepuestoDAO {

    @PersistenceContext(unitName = "pruebaPU")
    private EntityManager em;

    public void crear(DetalleRepuesto detalleRepuesto) {
        em.persist(detalleRepuesto);
    }

    public DetalleRepuesto buscarPorId(Long id) {
        return em.find(DetalleRepuesto.class, id);
    }

    public List<DetalleRepuesto> listarTodos() {
        TypedQuery<DetalleRepuesto> query = em.createQuery("SELECT dr FROM DetalleRepuesto dr", DetalleRepuesto.class);
        return query.getResultList();
    }

    public void actualizar(DetalleRepuesto detalleRepuesto) {
        em.merge(detalleRepuesto);
    }

    public void eliminar(Long id) {
        DetalleRepuesto detalleRepuesto = buscarPorId(id);
        if (detalleRepuesto != null) {
            em.remove(detalleRepuesto);
        }
    }

    public List<DetalleRepuesto> buscarPorRepuestoId(Long repuestoId) {
        TypedQuery<DetalleRepuesto> query = em.createQuery(
            "SELECT dr FROM DetalleRepuesto dr WHERE dr.repuestoId = :repuestoId", 
            DetalleRepuesto.class);
        query.setParameter("repuestoId", repuestoId);
        return query.getResultList();
    }

    public List<DetalleRepuesto> buscarPorDetalleServicioId(Long detalleServicioId) {
        TypedQuery<DetalleRepuesto> query = em.createQuery(
            "SELECT dr FROM DetalleRepuesto dr WHERE dr.detalleServicioId = :detalleServicioId", 
            DetalleRepuesto.class);
        query.setParameter("detalleServicioId", detalleServicioId);
        return query.getResultList();
    }
}