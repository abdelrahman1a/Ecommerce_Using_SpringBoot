package com.ecommerce.project.service;

import com.ecommerce.project.payload.AuthenticationResult;
import com.ecommerce.project.payload.UserResponse;
import com.ecommerce.project.security.request.LoginRequest;
import com.ecommerce.project.security.request.SignUpRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    AuthenticationResult login(LoginRequest loginRequest);

    ResponseEntity<?> register(@Valid SignUpRequest signupRequest);

    UserResponse getAllSellers(Pageable pageDetails);
}
