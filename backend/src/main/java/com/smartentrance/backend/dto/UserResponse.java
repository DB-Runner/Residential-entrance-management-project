package com.smartentrance.backend.dto;

import com.smartentrance.backend.model.enums.UserRole;
import lombok.Data;

@Data
public class UserResponse {
    private Integer id;
    private String fullName;
    private String email;
    private UserRole role;
}