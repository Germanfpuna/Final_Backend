package py.com.progweb.prueba.model;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_mecanicos")
public class DetalleMecanico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 500)
    private String descripcion;
    
    @Column(name = "horas_trabajadas", precision = 5, scale = 2)
    private BigDecimal horasTrabajadas;
    
    @Column(name = "costo_total", precision = 10, scale = 2)
    private BigDecimal costoTotal;
    
    // Solo guardar el ID del mecánico
    @Column(name = "mecanico_id", nullable = false)
    private Long mecanicoId;
    
    // Solo guardar el ID del detalle servicio
    @Column(name = "detalle_servicio_id", nullable = false)
    private Long detalleServicioId;
    
    // Constructors
    public DetalleMecanico() {}
    
    public DetalleMecanico(String descripcion, BigDecimal horasTrabajadas, BigDecimal costoTotal, 
                          Long mecanicoId, Long detalleServicioId) {
        this.descripcion = descripcion;
        this.horasTrabajadas = horasTrabajadas;
        this.costoTotal = costoTotal;
        this.mecanicoId = mecanicoId;
        this.detalleServicioId = detalleServicioId;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public BigDecimal getHorasTrabajadas() { return horasTrabajadas; }
    public void setHorasTrabajadas(BigDecimal horasTrabajadas) { this.horasTrabajadas = horasTrabajadas; }
    
    public BigDecimal getCostoTotal() { return costoTotal; }
    public void setCostoTotal(BigDecimal costoTotal) { this.costoTotal = costoTotal; }
    
    public Long getMecanicoId() { return mecanicoId; }
    public void setMecanicoId(Long mecanicoId) { this.mecanicoId = mecanicoId; }
    
    public Long getDetalleServicioId() { return detalleServicioId; }
    public void setDetalleServicioId(Long detalleServicioId) { this.detalleServicioId = detalleServicioId; }

    @Override
    public String toString() {
        return "DetalleMecanico{" +
                "id=" + id +
                ", descripcion='" + descripcion + '\'' +
                ", horasTrabajadas=" + horasTrabajadas +
                ", costoTotal=" + costoTotal +
                ", mecanicoId=" + mecanicoId +
                ", detalleServicioId=" + detalleServicioId +
                '}';
    }
}