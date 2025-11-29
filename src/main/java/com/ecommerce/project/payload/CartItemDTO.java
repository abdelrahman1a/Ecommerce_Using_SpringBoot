package com.ecommerce.project.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {

    private Long cartItemId;
    private ProductDTO productDTO;
    private CartDTO cartDTO;
    private Double discount;
    private Double productPrice;
    private Integer quantity;
}
