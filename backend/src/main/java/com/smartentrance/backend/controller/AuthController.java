package com.smartentrance.backend.controller;

import com.smartentrance.backend.dto.request.LoginRequest;
import com.smartentrance.backend.dto.response.LoginResponse;
import com.smartentrance.backend.dto.request.RegisterUserRequest;
import com.smartentrance.backend.dto.response.UserResponse;
import com.smartentrance.backend.security.JwtService;
import com.smartentrance.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.net.URI;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterUserRequest request) {
        LoginResponse loginResponse = authService.register(request);

        ResponseCookie cookie = jwtService.generateCookie(loginResponse.getToken(), request.isRememberMe());

        return ResponseEntity.created(URI.create("/api/auth/me"))
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(loginResponse.getUser());
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse loginResponse = authService.login(request);

        ResponseCookie cookie = jwtService.generateCookie(loginResponse.getToken(), request.isRememberMe());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(loginResponse.getUser());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtService.getCleanCookie().toString())
                .build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        return ResponseEntity.ok(authService.getAuthenticatedUser());
    }
}