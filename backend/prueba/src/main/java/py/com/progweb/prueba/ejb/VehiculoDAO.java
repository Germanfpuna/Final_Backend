package py.com.progweb.prueba.ejb;

import py.com.progweb.prueba.model.VehiculoEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Stateless
public class VehiculoDAO {

    @PersistenceContext(unitName = "pruebaPU")
    private EntityManager em;

    public void crear(VehiculoEntity vehiculo) {
        em.persist(vehiculo);
    }

    public VehiculoEntity buscarPorId(Long id) {
        return em.find(VehiculoEntity.class, id);
    }

    public List<VehiculoEntity> listarTodos() {
        TypedQuery<VehiculoEntity> query = em.createQuery("SELECT v FROM VehiculoEntity v", VehiculoEntity.class);
        return query.getResultList();
    }

    public void actualizar(VehiculoEntity vehiculo) {
        em.merge(vehiculo);
    }

    public void eliminar(Long id) {
        VehiculoEntity vehiculo = buscarPorId(id);
        if (vehiculo != null) {
            em.remove(vehiculo);
        }
    }

    public List<VehiculoEntity> buscarPorCliente(Long clienteId) {
        TypedQuery<VehiculoEntity> query = em.createQuery(
            "SELECT v FROM VehiculoEntity v WHERE v.cliente.id = :clienteId", 
            VehiculoEntity.class);
        query.setParameter("clienteId", clienteId);
        return query.getResultList();
    }

    public VehiculoEntity buscarPorChapa(String chapa) {
        TypedQuery<VehiculoEntity> query = em.createQuery(
            "SELECT v FROM VehiculoEntity v WHERE v.chapa = :chapa", 
            VehiculoEntity.class);
        query.setParameter("chapa", chapa);
        return query.getSingleResult();
    }

    public List<VehiculoEntity> buscarPorMarca(String marca) {
        TypedQuery<VehiculoEntity> query = em.createQuery(
            "SELECT v FROM VehiculoEntity v WHERE LOWER(v.marca) LIKE LOWER(:marca)", 
            VehiculoEntity.class);
        query.setParameter("marca", "%" + marca + "%");
        return query.getResultList();
    }
}