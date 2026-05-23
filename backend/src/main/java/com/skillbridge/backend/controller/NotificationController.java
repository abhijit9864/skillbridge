package com.skillbridge.backend.controller;

import com.skillbridge.backend.config.JwtUtil;
import com.skillbridge.backend.entity.Notification;
import com.skillbridge.backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
    @PostMapping("/send")
    public Notification sendMessage(

            @RequestHeader("Authorization")
            String authHeader,

            @RequestBody Map<String, String> body) {

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        Long userId =
                Long.valueOf(body.get("userId"));

        String title = body.getOrDefault(
                "title",
                "New Message"
        );

        String message = body.get("message");

        return notificationService.sendMessage(
                email,
                userId,
                title,
                message
        );
    }
    @GetMapping("/unread-count")
    public Long getUnreadCount(

            @RequestHeader("Authorization")
            String authHeader) {

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        return notificationService
                .getUnreadCount(email);
    }
    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable Long id) {

        return notificationService.markAsRead(id);
    }
}