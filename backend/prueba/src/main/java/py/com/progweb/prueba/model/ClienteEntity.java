package py.com.progweb.prueba.model;

import javax.persistence.*;

@Entity
@Table(name = "clientes")
public class ClienteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Column(length = 15)
    private String telefono;
    
    @Column(length = 200)
    private String direccion;
    
    @Column(name = "ruc_ci", length = 20, unique = true)
    private String rucCi;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_cliente")
    private TipoCliente tipoCliente;
    
    // Constructors
    public ClienteEntity() {}
    
    public ClienteEntity(String nombre, String telefono, String direccion, String rucCi, TipoCliente tipoCliente) {
        this.nombre = nombre;
        this.telefono = telefono;
        this.direccion = direccion;
        this.rucCi = rucCi;
        this.tipoCliente = tipoCliente;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    
    public String getRucCi() { return rucCi; }
    public void setRucCi(String rucCi) { this.rucCi = rucCi; }
    
    public TipoCliente getTipoCliente() { return tipoCliente; }
    public void setTipoCliente(TipoCliente tipoCliente) { this.tipoCliente = tipoCliente; }

    @Override
    public String toString() {
        return "ClienteEntity{" +
                "id=" + id +
                ", nombre='" + nombre + '\'' +
                ", telefono='" + telefono + '\'' +
                ", direccion='" + direccion + '\'' +
                ", rucCi='" + rucCi + '\'' +
                ", tipoCliente=" + tipoCliente +
                '}';
    }
}

enum TipoCliente {
    ocasional, regular, vip
}
