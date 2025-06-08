package py.com.progweb.prueba.model;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "mecanicos")
public class MecanicoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Column(length = 200)
    private String direccion;
    
    @Column(length = 15)
    private String telefono;
    
    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;
    
    @Column(length = 100)
    private String especialidad;
    
    @OneToMany(mappedBy = "mecanico", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DetalleMecanico> detalleMecanicos;
    
    // Constructors
    public MecanicoEntity() {}
    
    public MecanicoEntity(String nombre, String direccion, String telefono, LocalDate fechaIngreso, String especialidad) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.fechaIngreso = fechaIngreso;
        this.especialidad = especialidad;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public LocalDate getFechaIngreso() { return fechaIngreso; }
    public void setFechaIngreso(LocalDate fechaIngreso) { this.fechaIngreso = fechaIngreso; }
    
    public String getEspecialidad() { return especialidad; }
    public void setEspecialidad(String especialidad) { this.especialidad = especialidad; }
    
    public List<DetalleMecanico> getDetalleMecanicos() { return detalleMecanicos; }
    public void setDetalleMecanicos(List<DetalleMecanico> detalleMecanicos) { this.detalleMecanicos = detalleMecanicos; }
}