package py.com.progweb.prueba.model;

import javax.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "servicios")
public class ServicioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDate fecha;
    
    @Column(length = 500)
    private String descripcion;
    
    @Column(name = "km_actual")
    private Integer kmActual;
    
    @Column(name = "costo_total", precision = 10, scale = 2)
    private BigDecimal costoTotal;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehiculo_id", nullable = false)
    private VehiculoEntity vehiculo;
    
    @OneToMany(mappedBy = "servicio", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetalleServicio> detalleServicios;
    
    // Constructors
    public ServicioEntity() {}
    
    public ServicioEntity(LocalDate fecha, String descripcion, Integer kmActual, BigDecimal costoTotal, VehiculoEntity vehiculo) {
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.kmActual = kmActual;
        this.costoTotal = costoTotal;
        this.vehiculo = vehiculo;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public Integer getKmActual() { return kmActual; }
    public void setKmActual(Integer kmActual) { this.kmActual = kmActual; }
    
    public BigDecimal getCostoTotal() { return costoTotal; }
    public void setCostoTotal(BigDecimal costoTotal) { this.costoTotal = costoTotal; }
    
    public VehiculoEntity getVehiculo() { return vehiculo; }
    public void setVehiculo(VehiculoEntity vehiculo) { this.vehiculo = vehiculo; }
    
    public List<DetalleServicio> getDetalleServicios() { return detalleServicios; }
    public void setDetalleServicios(List<DetalleServicio> detalleServicios) { this.detalleServicios = detalleServicios; }
}