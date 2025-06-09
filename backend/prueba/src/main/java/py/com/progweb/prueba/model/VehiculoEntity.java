package py.com.progweb.prueba.model;

import javax.persistence.*;

@Entity
@Table(name = "vehiculos")
public class VehiculoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String marca;

    @Column(length = 20, unique = true)
    private String chapa;

    @Column(length = 50)
    private String modelo;

    private Integer anio;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    public TipoVehiculo tipo;

    // Solo guardar el ID del cliente, no el objeto completo
    @Column(name = "cliente_id", nullable = false)
    private Long clienteId;

    // Constructores
    public VehiculoEntity() {}

    public VehiculoEntity(String marca, String chapa, String modelo, Integer anio, TipoVehiculo tipo, Long clienteId) {
        this.marca = marca;
        this.chapa = chapa;
        this.modelo = modelo;
        this.anio = anio;
        this.tipo = tipo;
        this.clienteId = clienteId;
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

    public String getTipo() { return tipo.name().toLowerCase(); }
    public void setTipo(String tipo) { 
        if (validTipo(tipo)) {
            this.tipo = TipoVehiculo.valueOf(tipo.toLowerCase());
        } else {
            this.tipo = TipoVehiculo.coche;
        }
    }

    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { 
        this.clienteId = clienteId != null ? clienteId : 0L; 
    }

    public boolean validTipo(String tipo) {
        if (tipo == null) {
            return false;
        }
        for (TipoVehiculo tipoVehiculo : TipoVehiculo.values()) {
            if (tipoVehiculo.name().equalsIgnoreCase(tipo)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toString() {
        return "VehiculoEntity{" +
                "id=" + id +
                ", marca='" + marca + '\'' +
                ", chapa='" + chapa + '\'' +
                ", modelo='" + modelo + '\'' +
                ", anio=" + anio +
                ", tipo=" + tipo +
                ", clienteId=" + clienteId +
                '}';
    }


}

enum TipoVehiculo {
    moto, coche, camioneta, camion;
    
    public String getDescripcion() {
        switch (this) {
            case moto: return "Motocicleta";
            case coche: return "Coche";
            case camioneta: return "Camioneta";
            case camion: return "Camión";
            default: return "";
        }
    }
}
