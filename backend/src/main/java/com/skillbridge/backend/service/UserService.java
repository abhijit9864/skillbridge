package com.skillbridge.backend.service;

import com.skillbridge.backend.dto.UserResponseDto;
import com.skillbridge.backend.entity.User;
import com.skillbridge.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import com.skillbridge.backend.entity.Role;
import com.skillbridge.backend.dto.UpdateProfileDto;

import java.io.File;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 🔥 GET PROFILE
    public UserResponseDto getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToDto(user);
    }

    // 🔥 UPLOAD IMAGE
    @Transactional
    public UserResponseDto uploadProfileImage(String email, MultipartFile file) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                throw new RuntimeException("Only image files allowed");
            }

            String uploadPath = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
            File uploadDir = new File(uploadPath);

            if (!uploadDir.exists() && !uploadDir.mkdirs()) {
                throw new RuntimeException("Failed to create upload directory");
            }

            String originalName = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" +
                    (originalName != null ? originalName : "image.png");

            String fullPath = uploadPath + fileName;
            file.transferTo(new File(fullPath));

            String dbPath = "uploads/" + fileName;

            user.setProfileImageUrl(dbPath);
            userRepository.save(user);

            return mapToDto(user);

        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    // 🔥 GET ALL USERS (RBAC)
    public List<UserResponseDto> getAllUsers(String email) {

        User currentUser = getUserByEmail(email);

        List<User> users;

        switch (currentUser.getRole()) {
            case SUPER_ADMIN -> users = userRepository.findAll();

            case ADMIN -> {
                if (currentUser.getOrganization() == null) {
                    throw new RuntimeException("Organization not found");
                }
                users = userRepository.findByOrganizationId(
                        currentUser.getOrganization().getId()
                );
            }

            default -> throw new RuntimeException("Access denied");
        }

        return users.stream().map(this::mapToDto).toList();
    }

    @Transactional
    public UserResponseDto updateProfile(String email, UpdateProfileDto dto) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔄 update name
        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName());
        }

        // 🔐 update password
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        return mapToDto(userRepository.save(user));
    }

    // 🔥 UPDATE USER (RBAC + STATUS CONTROL)
    @Transactional
    public UserResponseDto updateUser(String email, Long userId, User updatedData) {

        User currentUser = getUserByEmail(email);

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        // 🔥 RBAC CHECK
        if (currentUser.getRole() == Role.ADMIN) {

            // same organization check
            if (!currentUser.getOrganization().getId()
                    .equals(targetUser.getOrganization().getId())) {
                throw new RuntimeException("Cannot update user from another organization");
            }

            // ADMIN can only manage STUDENTS
            if (targetUser.getRole() != Role.STUDENT) {
                throw new RuntimeException("Admin can only manage students");
            }
        }

        // SUPER_ADMIN → full access

        // 🔄 UPDATE FIELDS
        if (updatedData.getName() != null) {
            targetUser.setName(updatedData.getName());
        }

        if (updatedData.getStatus() != null) {
            targetUser.setStatus(updatedData.getStatus());
        }

        return mapToDto(userRepository.save(targetUser));
    }

    // 🔥 HELPER
    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // 🔁 DTO MAPPER
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

        dto.setProfileImageUrl(user.getProfileImageUrl());

        return dto;
    }
}