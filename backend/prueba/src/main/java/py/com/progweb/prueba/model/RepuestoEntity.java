package py.com.progweb.prueba.model;


import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "repuestos")
public class RepuestoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String codigo;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @OneToMany(mappedBy = "repuesto", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetalleRepuesto> detalleRepuestos;
    
    // Constructors
    public RepuestoEntity() {}
    
    public RepuestoEntity(String codigo, String nombre) {
        this.codigo = codigo;
        this.nombre = nombre;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public List<DetalleRepuesto> getDetalleRepuestos() { return detalleRepuestos; }
    public void setDetalleRepuestos(List<DetalleRepuesto> detalleRepuestos) { this.detalleRepuestos = detalleRepuestos; }
}