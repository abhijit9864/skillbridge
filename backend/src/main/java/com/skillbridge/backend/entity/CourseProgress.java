package com.skillbridge.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "course_progress",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "content_id"})
        }
)
public class CourseProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 👤 student
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // 🎥 content
    @ManyToOne
    @JoinColumn(name = "content_id")
    private CourseContent content;

    // ⏱ last watched time (seconds)
    private Integer lastWatchedTime;

    // 📊 progress %
    private Double progressPercent;

    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ✅ GETTERS & SETTERS

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public CourseContent getContent() {
        return content;
    }

    public void setContent(CourseContent content) {
        this.content = content;
    }

    public Integer getLastWatchedTime() {
        return lastWatchedTime;
    }

    public void setLastWatchedTime(Integer lastWatchedTime) {
        this.lastWatchedTime = lastWatchedTime;
    }

    public Double getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(Double progressPercent) {
        this.progressPercent = progressPercent;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}