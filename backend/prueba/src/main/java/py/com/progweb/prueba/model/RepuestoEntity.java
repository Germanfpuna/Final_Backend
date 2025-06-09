package py.com.progweb.prueba.model;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "repuestos")
public class RepuestoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 50, unique = true)
    private String codigo;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Column(length = 200)
    private String descripcion;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal precio;
    
    @Column(name = "stock_actual")
    private Integer stockActual;
    
    @Column(name = "stock_minimo")
    private Integer stockMinimo;
    
    // Remove the @OneToMany collection entirely since you're using ID-based relationships
    // If you need to get DetalleRepuesto records, use DetalleRepuestoDAO.buscarPorRepuestoId(id)
    
    // Constructors
    public RepuestoEntity() {}
    
    public RepuestoEntity(String codigo, String nombre, String descripcion, BigDecimal precio, Integer stockActual, Integer stockMinimo) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stockActual = stockActual;
        this.stockMinimo = stockMinimo;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    
    public Integer getStockActual() { return stockActual; }
    public void setStockActual(Integer stockActual) { this.stockActual = stockActual; }
    
    public Integer getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Integer stockMinimo) { this.stockMinimo = stockMinimo; }

    @Override
    public String toString() {
        return "RepuestoEntity{" +
                "id=" + id +
                ", codigo='" + codigo + '\'' +
                ", nombre='" + nombre + '\'' +
                ", descripcion='" + descripcion + '\'' +
                ", precio=" + precio +
                ", stockActual=" + stockActual +
                ", stockMinimo=" + stockMinimo +
                '}';
    }
}