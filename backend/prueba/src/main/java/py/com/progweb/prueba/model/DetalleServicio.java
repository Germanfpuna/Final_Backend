package py.com.progweb.prueba.model;

import java.math.BigDecimal;

import javax.persistence.*;

@Entity
@Table(name = "detalle_servicios")
public class DetalleServicio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 500)
    private String descripcion;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal costo;
    
    @Column(name = "servicio_id", nullable = false)
    private Long servicioId;
    
    // Constructors
    public DetalleServicio() {}
    
    public DetalleServicio(String descripcion, BigDecimal costo, Long servicioId) {
        this.descripcion = descripcion;
        this.costo = costo;
        this.servicioId = servicioId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public BigDecimal getCosto() { return costo; }
    public void setCosto(BigDecimal costo) { this.costo = costo; }
    
    public Long getServicioId() { return servicioId; }
    public void setServicioId(Long servicioId) { this.servicioId = servicioId; }

    @Override
    public String toString() {
        return "DetalleServicio{" +
                "id=" + id +
                ", descripcion='" + descripcion + '\'' +
                ", costo=" + costo +
                ", servicioId=" + servicioId +
                '}';
    }
}