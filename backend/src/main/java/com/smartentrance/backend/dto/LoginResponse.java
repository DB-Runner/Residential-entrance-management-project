package com.smartentrance.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {

    // JWT токен (или dummy string засега)
    private String token;

    private UserResponse user;
}