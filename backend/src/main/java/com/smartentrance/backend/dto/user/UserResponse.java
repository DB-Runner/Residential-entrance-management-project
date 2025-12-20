package com.smartentrance.backend.dto.user;

import lombok.Data;

@Data
public class UserResponse {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
}