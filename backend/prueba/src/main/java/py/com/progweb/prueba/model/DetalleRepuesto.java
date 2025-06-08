package py.com.progweb.prueba.model;
import javax.persistence.*;

@Entity
@Table(name = "detalle_repuestos")
public class DetalleRepuesto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repuesto_id", nullable = false)
    private RepuestoEntity repuesto;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detalle_servicio_id", nullable = false)
    private DetalleServicio detalleServicio;
    
    // Constructors
    public DetalleRepuesto() {}
    
    public DetalleRepuesto(RepuestoEntity repuesto, DetalleServicio detalleServicio) {
        this.repuesto = repuesto;
        this.detalleServicio = detalleServicio;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public RepuestoEntity getRepuesto() { return repuesto; }
    public void setRepuesto(RepuestoEntity repuesto) { this.repuesto = repuesto; }
    
    public DetalleServicio getDetalleServicio() { return detalleServicio; }
    public void setDetalleServicio(DetalleServicio detalleServicio) { this.detalleServicio = detalleServicio; }
}