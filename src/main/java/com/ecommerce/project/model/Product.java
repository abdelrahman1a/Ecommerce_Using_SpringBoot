package com.ecommerce.project.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "Products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "prodcuts")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;
    @NotBlank()
    @Size(min = 3, message = "Product Name must contain at least 3 characters")
    private String productName;
    private String image;
    // add valid that productName must have at least 6 chars
    @NotBlank
    @Size(min = 6, message = "Product Description must contain at least 6 characters")
    private String description;
    private Integer quantity;
    private double discount;
    private double price;
    private double specialPrice;

    @ManyToOne()
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne()
    @JoinColumn(name = "seller_id")
    private User user;
}
