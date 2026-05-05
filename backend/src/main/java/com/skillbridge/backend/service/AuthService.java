package com.skillbridge.backend.service;

import com.skillbridge.backend.entity.*;
import com.skillbridge.backend.repository.UserRepository;
import com.skillbridge.backend.repository.OrganizationRepository;
import com.skillbridge.backend.config.JwtUtil;
import com.skillbridge.backend.dto.UserResponseDto;
import com.skillbridge.backend.dto.AuthResponse;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil; // ✅ FIXED

    // ✅ FIXED CONSTRUCTOR
    public AuthService(UserRepository userRepository,
                       OrganizationRepository organizationRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // 🔥 REGISTER
    public UserResponseDto register(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (user.getOrganization() != null && user.getOrganization().getId() != null) {

            Organization org = organizationRepository.findById(user.getOrganization().getId())
                    .orElseThrow(() -> new RuntimeException("Organization not found"));

            user.setOrganization(org);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        User savedUser = userRepository.save(user);

        return mapToDto(savedUser);
    }

    // 🔥 LOGIN (FIXED)
    public AuthResponse login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token);
    }

    // 🔥 DTO MAPPER
    private UserResponseDto mapToDto(User user) {

        UserResponseDto dto = new UserResponseDto();

        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setStatus(user.getStatus().name());

        if (user.getOrganization() != null) {
            dto.setOrganizationId(user.getOrganization().getId());
            dto.setOrganizationName(user.getOrganization().getName());
        }

        return dto;
    }
}