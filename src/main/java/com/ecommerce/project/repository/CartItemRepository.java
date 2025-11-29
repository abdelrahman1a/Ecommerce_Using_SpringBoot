package com.ecommerce.project.repository;

import com.ecommerce.project.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {


    @Query("Select ci from CartItem ci where ci.product.productId=:productId and ci.cart.cartId=:cartId")
    CartItem findCartItemByProductIdAndCartId(@Param("productId") Long productId, @Param("cartId") Long cartId);

    @Modifying
    @Query("DELETE FROM CartItem ci where ci.cart.cartId=:cartId and ci.product.productId=:productId")
    void deleteCartItemByProductIdAndCartId(Long productId, Long cartId);
}
