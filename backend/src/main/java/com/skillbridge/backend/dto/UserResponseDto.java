package com.skillbridge.backend.dto;

import lombok.Data;

@Data
public class UserResponseDto {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String status;

    private Long organizationId;
    private String organizationName;

    private String profileImageUrl; // ✅ ADD THIS
}