package py.com.progweb.prueba.ejb;

import py.com.progweb.prueba.model.RepuestoEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Stateless
public class RepuestoDAO {

    @PersistenceContext(unitName = "pruebaPU")
    private EntityManager em;

    public void crear(RepuestoEntity repuesto) {
        em.persist(repuesto);
    }

    public RepuestoEntity buscarPorId(Long id) {
        return em.find(RepuestoEntity.class, id);
    }

    public List<RepuestoEntity> listarTodos() {
        TypedQuery<RepuestoEntity> query = em.createQuery("SELECT r FROM RepuestoEntity r", RepuestoEntity.class);
        return query.getResultList();
    }

    public void actualizar(RepuestoEntity repuesto) {
        em.merge(repuesto);
    }

    public void eliminar(Long id) {
        RepuestoEntity repuesto = buscarPorId(id);
        if (repuesto != null) {
            em.remove(repuesto);
        }
    }

    public RepuestoEntity buscarPorCodigo(String codigo) {
        TypedQuery<RepuestoEntity> query = em.createQuery(
            "SELECT r FROM RepuestoEntity r WHERE r.codigo = :codigo", 
            RepuestoEntity.class);
        query.setParameter("codigo", codigo);
        return query.getSingleResult();
    }

    public List<RepuestoEntity> buscarPorNombre(String nombre) {
        TypedQuery<RepuestoEntity> query = em.createQuery(
            "SELECT r FROM RepuestoEntity r WHERE LOWER(r.nombre) LIKE LOWER(:nombre)", 
            RepuestoEntity.class);
        query.setParameter("nombre", "%" + nombre + "%");
        return query.getResultList();
    }
}