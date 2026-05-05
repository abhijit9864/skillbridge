package com.skillbridge.backend.controller;

import com.skillbridge.backend.config.JwtUtil; // ✅ ADD
import com.skillbridge.backend.dto.UserResponseDto;
import com.skillbridge.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.skillbridge.backend.entity.User;
import java.util.List;
import com.skillbridge.backend.dto.UpdateProfileDto;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil; // ✅ ADD THIS

    // ✅ FIXED CONSTRUCTOR
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<UserResponseDto> getAllUsers(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return userService.getAllUsers(email);
    }

    // 🔥 GET PROFILE (/me)
    @GetMapping("/me")
    public UserResponseDto getMyProfile(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7); // remove "Bearer "
        String email = jwtUtil.extractEmail(token);

        return userService.getProfileByEmail(email);
    }

    // 📸 UPLOAD PROFILE IMAGE
    @PostMapping(value = "/upload-profile",consumes = "multipart/form-data")
    public UserResponseDto uploadProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return userService.uploadProfileImage(email, file);
    }
    @PutMapping("/{id}")
    public UserResponseDto updateUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody User user) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return userService.updateUser(email, id, user);
    }
    @PutMapping("/profile")
    public UserResponseDto updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileDto dto) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return userService.updateProfile(email, dto);
    }
}