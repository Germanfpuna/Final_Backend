package py.com.progweb.prueba.ejb;

import py.com.progweb.prueba.model.MecanicoEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Stateless
public class MecanicoDAO {

    @PersistenceContext(unitName = "pruebaPU")
    private EntityManager em;

    public void crear(MecanicoEntity mecanico) {
        em.persist(mecanico);
    }

    public MecanicoEntity buscarPorId(Long id) {
        return em.find(MecanicoEntity.class, id);
    }

    public List<MecanicoEntity> listarTodos() {
        TypedQuery<MecanicoEntity> query = em.createQuery("SELECT m FROM MecanicoEntity m", MecanicoEntity.class);
        return query.getResultList();
    }

    public void actualizar(MecanicoEntity mecanico) {
        em.merge(mecanico);
    }

    public void eliminar(Long id) {
        MecanicoEntity mecanico = buscarPorId(id);
        if (mecanico != null) {
            em.remove(mecanico);
        }
    }

    public List<MecanicoEntity> buscarPorEspecialidad(String especialidad) {
        TypedQuery<MecanicoEntity> query = em.createQuery(
            "SELECT m FROM MecanicoEntity m WHERE LOWER(m.especialidad) LIKE LOWER(:especialidad)", 
            MecanicoEntity.class);
        query.setParameter("especialidad", "%" + especialidad + "%");
        return query.getResultList();
    }

    public List<MecanicoEntity> buscarPorNombre(String nombre) {
        TypedQuery<MecanicoEntity> query = em.createQuery(
            "SELECT m FROM MecanicoEntity m WHERE LOWER(m.nombre) LIKE LOWER(:nombre)", 
            MecanicoEntity.class);
        query.setParameter("nombre", "%" + nombre + "%");
        return query.getResultList();
    }
}