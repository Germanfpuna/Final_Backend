package py.com.progweb.prueba.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "vehiculos")
public class VehiculoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String marca;

    @Column(length = 20)
    private String chapa;

    @Column(length = 50)
    private String modelo;

    private Integer anio;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private TipoVehiculo tipo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private ClienteEntity cliente;

    @OneToMany(mappedBy = "vehiculo", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ServicioEntity> servicios;

    // Constructors
    public VehiculoEntity() {}

    public VehiculoEntity(String marca, String chapa, String modelo, Integer anio, TipoVehiculo tipo, ClienteEntity cliente) {
        this.marca = marca;
        this.chapa = chapa;
        this.modelo = modelo;
        this.anio = anio;
        this.tipo = tipo;
        this.cliente = cliente;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public String getChapa() { return chapa; }
    public void setChapa(String chapa) { this.chapa = chapa; }

    public String getModelo() { return modelo; }
    public void setModelo(String modelo) { this.modelo = modelo; }

    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }

    public TipoVehiculo getTipo() { return tipo; }
    public void setTipo(TipoVehiculo tipo) { this.tipo = tipo; }

    public ClienteEntity getCliente() { return cliente; }
    public void setCliente(ClienteEntity cliente) { this.cliente = cliente; }

    public List<ServicioEntity> getServicios() { return servicios; }
    public void setServicios(List<ServicioEntity> servicios) { this.servicios = servicios; }
}

enum TipoVehiculo {
    OCASIONAL,
    REGULAR,
    VIP;

    public String getDescripcion() {
        switch (this) {
            case OCASIONAL: return "Ocasional";
            case REGULAR: return "Regular";
            case VIP: return "VIP";
            default: return "";
        }
    }
}
