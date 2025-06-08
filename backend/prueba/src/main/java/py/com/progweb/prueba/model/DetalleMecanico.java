package py.com.progweb.prueba.model;

import javax.persistence.*;

@Entity
@Table(name = "detalle_mecanicos")
public class DetalleMecanico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mecanico_id", nullable = false)
    private MecanicoEntity mecanico;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "detalle_servicio_id", nullable = false)
    private DetalleServicio detalleServicio;
    
    // Constructors
    public DetalleMecanico() {}
    
    public DetalleMecanico(MecanicoEntity mecanico, DetalleServicio detalleServicio) {
        this.mecanico = mecanico;
        this.detalleServicio = detalleServicio;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public MecanicoEntity getMecanico() { return mecanico; }
    public void setMecanico(MecanicoEntity mecanico) { this.mecanico = mecanico; }
    
    public DetalleServicio getDetalleServicio() { return detalleServicio; }
    public void setDetalleServicio(DetalleServicio detalleServicio) { this.detalleServicio = detalleServicio; }
}