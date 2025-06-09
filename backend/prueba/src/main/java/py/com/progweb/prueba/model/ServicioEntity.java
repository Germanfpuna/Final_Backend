package py.com.progweb.prueba.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;

import javax.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "servicios")
public class ServicioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @JsonDeserialize(using = LocalDateDeserializer.class)
    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate fecha;
    
    @Column(length = 500)
    private String descripcion;
    
    @Column(name = "km_actual")
    private Integer kmActual;
    
    @Column(name = "costo_total", precision = 10, scale = 2)
    private BigDecimal costoTotal;
    
    // Solo guardar el ID del vehículo
    @Column(name = "vehiculo_id", nullable = false)
    private Long vehiculoId;
    
    // Constructors
    public ServicioEntity() {}
    
    public ServicioEntity(LocalDate fecha, String descripcion, Integer kmActual, BigDecimal costoTotal, Long vehiculoId) {
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.kmActual = kmActual;
        this.costoTotal = costoTotal;
        this.vehiculoId = vehiculoId;
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
    
    public Long getVehiculoId() { return vehiculoId; }
    public void setVehiculoId(Long vehiculoId) { 
        this.vehiculoId = vehiculoId;
    }

    @Override
    public String toString() {
        return "ServicioEntity{" +
                "id=" + id +
                ", fecha=" + fecha +
                ", descripcion='" + descripcion + '\'' +
                ", kmActual=" + kmActual +
                ", costoTotal=" + costoTotal +
                ", vehiculoId=" + vehiculoId +
                '}';
    }
}