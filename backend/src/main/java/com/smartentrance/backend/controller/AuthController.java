package com.smartentrance.backend.controller;

import com.smartentrance.backend.dto.LoginRequest;
import com.smartentrance.backend.dto.RegisterUserRequest;
import com.smartentrance.backend.dto.UserResponse;
import com.smartentrance.backend.model.User;
import com.smartentrance.backend.repository.UserRepository;
import com.smartentrance.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // ---------------- REGISTER ----------------
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody RegisterUserRequest request) {

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        User savedUser = userService.registerUser(user);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setEmail(savedUser.getEmail());
        response.setFullName(savedUser.getFullName());
        response.setRole(savedUser.getRole());

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ---------------- LOGIN ----------------
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest) {

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Проверка на паролата
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getHashedPassword())) {
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());

        return ResponseEntity.ok(response);
    }
}