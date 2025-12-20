<<<<<<<< HEAD:backend/src/main/java/com/smartentrance/backend/dto/request/LoginRequest.java
package com.smartentrance.backend.dto.request;
========
package com.smartentrance.backend.dto.auth;
>>>>>>>> api-integration2:backend/src/main/java/com/smartentrance/backend/dto/auth/LoginRequest.java

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    private boolean rememberMe;
}