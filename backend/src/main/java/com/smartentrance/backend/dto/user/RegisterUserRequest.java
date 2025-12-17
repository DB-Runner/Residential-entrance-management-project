package com.smartentrance.backend.dto.user;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterUserRequest {
    @NotBlank
    private String firstName;

    private String lastName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    // @Size(min = 8, message = "Password must be at least 8 characters long")
    // @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$", message = "Password must contain uppercase, lowercase and number")
    // Uncomment the above annotations to enforce password complexity rules
    private String password;

    private boolean rememberMe;
}