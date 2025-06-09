package py.com.progweb.prueba.model;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_repuestos")
public class DetalleRepuesto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Integer cantidad;
    
    @Column(name = "precio_unitario", precision = 10, scale = 2, nullable = false)
    private BigDecimal precioUnitario;
    
    @Column(name = "precio_total", precision = 10, scale = 2)
    private BigDecimal precioTotal;
    
    @Column(length = 200)
    private String observaciones;
    
    // Solo guardar el ID del repuesto
    @Column(name = "repuesto_id", nullable = false)
    private Long repuestoId;
    
    // Solo guardar el ID del detalle servicio
    @Column(name = "detalle_servicio_id", nullable = false)
    private Long detalleServicioId;
    
    // Constructors
    public DetalleRepuesto() {}
    
    public DetalleRepuesto(Integer cantidad, BigDecimal precioUnitario, 
                          String observaciones, Long repuestoId, Long detalleServicioId) {
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.precioTotal = precioUnitario.multiply(BigDecimal.valueOf(cantidad));
        this.observaciones = observaciones;
        this.repuestoId = repuestoId;
        this.detalleServicioId = detalleServicioId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    
    public BigDecimal getPrecioTotal() { return precioTotal; }
    public void setPrecioTotal(BigDecimal precioTotal) { this.precioTotal = precioTotal; }
    
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
    
    public Long getRepuestoId() { return repuestoId; }
    public void setRepuestoId(Long repuestoId) { this.repuestoId = repuestoId; }
    
    public Long getDetalleServicioId() { return detalleServicioId; }
    public void setDetalleServicioId(Long detalleServicioId) { this.detalleServicioId = detalleServicioId; }

    @Override
    public String toString() {
        return "DetalleRepuesto{" +
                "id=" + id +
                ", cantidad=" + cantidad +
                ", precioUnitario=" + precioUnitario +
                ", precioTotal=" + precioTotal +
                ", observaciones='" + observaciones + '\'' +
                ", repuestoId=" + repuestoId +
                ", detalleServicioId=" + detalleServicioId +
                '}';
    }
}