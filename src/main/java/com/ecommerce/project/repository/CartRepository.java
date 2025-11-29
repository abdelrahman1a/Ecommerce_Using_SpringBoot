package com.ecommerce.project.repository;

import com.ecommerce.project.model.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    @Query("select c from Cart c where c.user.email=:email")
    Cart findCartByEmail(@Param("email") String email);

    @Query("select c from Cart c where c.user.email=:emailId and c.cartId=:cartId")
    Cart findCartByEmailAndCartId(@Param("emailId") String emailId, @Param("cartId") Long cartId);

    @Query("Select c from Cart c join fetch c.cartItems ci join fetch ci.product p where p.productId=:productId")
    List<Cart> findCartsByProductId(@Param("productId") Long productId);
}
