package com.skillbridge.backend.controller;

import com.skillbridge.backend.entity.User;
import com.skillbridge.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.skillbridge.backend.dto.UserResponseDto;
import com.skillbridge.backend.dto.AuthResponse; // ✅ ADD THIS

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    // REGISTER
    @PostMapping("/register")
    public UserResponseDto register(@Valid @RequestBody User user) {
        return service.register(user);
    }

    // LOGIN ✅ FIXED
    @PostMapping("/login")
    public AuthResponse login(@RequestBody Map<String, String> request) {
        return service.login(
                request.get("email"),
                request.get("password")
        );
    }
}