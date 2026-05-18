package com.skillbridge.backend.service;

import com.skillbridge.backend.entity.Notification;
import com.skillbridge.backend.entity.User;
import com.skillbridge.backend.repository.NotificationRepository;
import com.skillbridge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {

        this.notificationRepository =
                notificationRepository;

        this.userRepository = userRepository;
    }

    public List<Notification> getNotifications(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(
                        user.getId()
                );
    }
}