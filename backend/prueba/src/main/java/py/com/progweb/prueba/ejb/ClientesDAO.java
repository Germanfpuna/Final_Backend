package py.com.progweb.prueba.ejb;

import py.com.progweb.prueba.model.ClienteEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.NoResultException;
import java.util.List;

@Stateless
public class ClientesDAO {

    @PersistenceContext(unitName = "pruebaPU")
    private EntityManager em;

    public void crear(ClienteEntity cliente) {
        em.persist(cliente);
    }

    public ClienteEntity buscarPorId(Long id) {
        return em.find(ClienteEntity.class, id);
    }

    public List<ClienteEntity> listarTodos() {
        TypedQuery<ClienteEntity> query = em.createQuery("SELECT c FROM ClienteEntity c", ClienteEntity.class);
        return query.getResultList();
    }

    public void actualizar(ClienteEntity cliente) {
        em.merge(cliente);
    }

    public void eliminar(Long id) {
        ClienteEntity cliente = buscarPorId(id);
        if (cliente != null) {
            em.remove(cliente);
        }
    }

    public List<ClienteEntity> buscarPorNombre(String nombre) {
        TypedQuery<ClienteEntity> query = em.createQuery(
            "SELECT c FROM ClienteEntity c WHERE LOWER(c.nombre) LIKE LOWER(:nombre)", 
            ClienteEntity.class);
        query.setParameter("nombre", "%" + nombre + "%");
        return query.getResultList();
    }

    public ClienteEntity buscarPorRucCi(String rucCi) {
        try {
            TypedQuery<ClienteEntity> query = em.createQuery(
                "SELECT c FROM ClienteEntity c WHERE c.rucCi = :rucCi", 
                ClienteEntity.class);
            query.setParameter("rucCi", rucCi);
            return query.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    public List<ClienteEntity> buscarPorTipoCliente(String tipoCliente) {
        TypedQuery<ClienteEntity> query = em.createQuery(
            "SELECT c FROM ClienteEntity c WHERE c.tipoCliente = :tipoCliente", 
            ClienteEntity.class);
        query.setParameter("tipoCliente", tipoCliente);
        return query.getResultList();
    }

    public List<ClienteEntity> buscarPorTelefono(String telefono) {
        TypedQuery<ClienteEntity> query = em.createQuery(
            "SELECT c FROM ClienteEntity c WHERE c.telefono = :telefono", 
            ClienteEntity.class);
        query.setParameter("telefono", telefono);
        return query.getResultList();
    }

    public Long contarClientes() {
        TypedQuery<Long> query = em.createQuery("SELECT COUNT(c) FROM ClienteEntity c", Long.class);
        return query.getSingleResult();
    }

    public boolean existeRucCi(String rucCi) {
        TypedQuery<Long> query = em.createQuery(
            "SELECT COUNT(c) FROM ClienteEntity c WHERE c.rucCi = :rucCi", 
            Long.class);
        query.setParameter("rucCi", rucCi);
        return query.getSingleResult() > 0;
    }

    public List<ClienteEntity> buscarClientesConVehiculos() {
        TypedQuery<ClienteEntity> query = em.createQuery(
            "SELECT DISTINCT c FROM ClienteEntity c JOIN FETCH c.vehiculos", 
            ClienteEntity.class);
        return query.getResultList();
    }
}