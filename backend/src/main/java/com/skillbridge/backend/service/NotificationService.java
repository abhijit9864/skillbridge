package com.skillbridge.backend.service;

import com.skillbridge.backend.entity.Notification;
import com.skillbridge.backend.entity.User;
import com.skillbridge.backend.repository.NotificationRepository;
import com.skillbridge.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.skillbridge.backend.entity.NotificationType;
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
    public Notification sendMessage(
            String email,
            Long userId,
            String title,
            String message) {

        User sender = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        User receiver = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("Receiver not found"));

        Notification notification =
                new Notification();

        notification.setUser(receiver);

        notification.setTitle(title);

        notification.setMessage(message);

        notification.setType(
                NotificationType.PERSONAL
        );

        return notificationRepository.save(
                notification
        );
    }
    public Long getUnreadCount(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return notificationRepository
                .countByUserIdAndIsReadFalse(
                        user.getId()
                );
    }
    public Notification markAsRead(
            Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                ));

        notification.setIsRead(true);

        return notificationRepository.save(
                notification
        );
    }
}