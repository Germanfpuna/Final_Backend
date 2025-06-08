package py.com.progweb.prueba.ejb;

import py.com.progweb.prueba.model.ServicioEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.time.LocalDate;
import java.util.List;

@Stateless
public class ServicioDAO {

    @PersistenceContext(unitName = "pruebaPU")
    private EntityManager em;

    public void crear(ServicioEntity servicio) {
        em.persist(servicio);
    }

    public ServicioEntity buscarPorId(Long id) {
        return em.find(ServicioEntity.class, id);
    }

    public List<ServicioEntity> listarTodos() {
        TypedQuery<ServicioEntity> query = em.createQuery("SELECT s FROM ServicioEntity s", ServicioEntity.class);
        return query.getResultList();
    }

    public void actualizar(ServicioEntity servicio) {
        em.merge(servicio);
    }

    public void eliminar(Long id) {
        ServicioEntity servicio = buscarPorId(id);
        if (servicio != null) {
            em.remove(servicio);
        }
    }

    public List<ServicioEntity> buscarPorVehiculo(Long vehiculoId) {
        TypedQuery<ServicioEntity> query = em.createQuery(
            "SELECT s FROM ServicioEntity s WHERE s.vehiculo.id = :vehiculoId ORDER BY s.fecha DESC", 
            ServicioEntity.class);
        query.setParameter("vehiculoId", vehiculoId);
        return query.getResultList();
    }

    public List<ServicioEntity> buscarPorFecha(LocalDate fechaInicio, LocalDate fechaFin) {
        TypedQuery<ServicioEntity> query = em.createQuery(
            "SELECT s FROM ServicioEntity s WHERE s.fecha BETWEEN :fechaInicio AND :fechaFin ORDER BY s.fecha DESC", 
            ServicioEntity.class);
        query.setParameter("fechaInicio", fechaInicio);
        query.setParameter("fechaFin", fechaFin);
        return query.getResultList();
    }

    public List<ServicioEntity> buscarPorCliente(Long clienteId) {
        TypedQuery<ServicioEntity> query = em.createQuery(
            "SELECT s FROM ServicioEntity s WHERE s.vehiculo.cliente.id = :clienteId ORDER BY s.fecha DESC", 
            ServicioEntity.class);
        query.setParameter("clienteId", clienteId);
        return query.getResultList();
    }
}