package com.skillbridge.backend.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileDto {

    private String name;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }
}