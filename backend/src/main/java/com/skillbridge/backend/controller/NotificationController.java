package com.skillbridge.backend.controller;

import com.skillbridge.backend.config.JwtUtil;
import com.skillbridge.backend.entity.Notification;
import com.skillbridge.backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    private final JwtUtil jwtUtil;

    public NotificationController(
            NotificationService notificationService,
            JwtUtil jwtUtil) {

        this.notificationService = notificationService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Notification> getNotifications(
            @RequestHeader("Authorization")
            String authHeader) {

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        return notificationService.getNotifications(email);
    }
}