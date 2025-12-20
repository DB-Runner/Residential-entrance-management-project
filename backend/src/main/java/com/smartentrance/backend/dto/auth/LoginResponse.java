<<<<<<<< HEAD:backend/src/main/java/com/smartentrance/backend/dto/response/LoginResponse.java
package com.smartentrance.backend.dto.response;
========
package com.smartentrance.backend.dto.auth;
>>>>>>>> api-integration2:backend/src/main/java/com/smartentrance/backend/dto/auth/LoginResponse.java

import com.smartentrance.backend.dto.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private UserResponse user;
}