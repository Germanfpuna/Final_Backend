package py.com.progweb.prueba.model;

import java.math.BigDecimal;
import java.util.List;

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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "servicio_id", nullable = false)
    private ServicioEntity servicio;
    
    @OneToMany(mappedBy = "detalleServicio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetalleRepuesto> detalleRepuestos;
    
    @OneToMany(mappedBy = "detalleServicio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetalleMecanico> detalleMecanicos;
    
    // Constructors
    public DetalleServicio() {}
    
    public DetalleServicio(String descripcion, BigDecimal costo, ServicioEntity servicio) {
        this.descripcion = descripcion;
        this.costo = costo;
        this.servicio = servicio;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public BigDecimal getCosto() { return costo; }
    public void setCosto(BigDecimal costo) { this.costo = costo; }
    
    public ServicioEntity getServicio() { return servicio; }
    public void setServicio(ServicioEntity servicio) { this.servicio = servicio; }
    
    public List<DetalleRepuesto> getDetalleRepuestos() { return detalleRepuestos; }
    public void setDetalleRepuestos(List<DetalleRepuesto> detalleRepuestos) { this.detalleRepuestos = detalleRepuestos; }
    
    public List<DetalleMecanico> getDetalleMecanicos() { return detalleMecanicos; }
    public void setDetalleMecanicos(List<DetalleMecanico> detalleMecanicos) { this.detalleMecanicos = detalleMecanicos; }
}