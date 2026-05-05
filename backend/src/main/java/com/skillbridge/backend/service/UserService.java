package com.skillbridge.backend.service;

import com.skillbridge.backend.dto.UserResponseDto;
import com.skillbridge.backend.entity.User;
import com.skillbridge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 🔥 GET PROFILE USING EMAIL (from token)
    public UserResponseDto getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToDto(user);
    }

    // 🔥 UPLOAD IMAGE (SECURE VERSION)
    @Transactional
    public UserResponseDto uploadProfileImage(String email, MultipartFile file) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
            // validate
            if (file.isEmpty()) {
                throw new RuntimeException("File is empty");
            }

            if (file.getContentType() == null || !file.getContentType().startsWith("image/")) {
                throw new RuntimeException("Only image files allowed");
            }

            // folder
            String uploadPath = System.getProperty("user.dir") + File.separator + "uploads" + File.separator;
            File uploadDir = new File(uploadPath);

            if (!uploadDir.exists()) {
                if (!uploadDir.mkdirs()) {
                    throw new RuntimeException("Failed to create upload directory");
                }
            }

            // filename
            String originalName = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" +
                    (originalName != null ? originalName : "image.png");

            String fullPath = uploadPath + fileName;

            // save file
            file.transferTo(new File(fullPath));

            // ✅ correct path
            String dbPath = "uploads/" + fileName;

            // ✅ set + SAVE
            user.setProfileImageUrl(dbPath);
            userRepository.save(user);

            return mapToDto(user);

        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }

    // 🔁 MAPPER
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