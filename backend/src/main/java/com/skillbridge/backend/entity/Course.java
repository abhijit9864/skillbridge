package com.skillbridge.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    // 🔥 Course Status (Approval flow)
    @Enumerated(EnumType.STRING)
    private CourseStatus status;

    // 👨‍🏫 Instructor (creator)
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User instructor;

    // 🏢 Organization (multi-tenant)
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // 🔥 Auto-set values
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.status = CourseStatus.DRAFT; // default
    }

    // ✅ Getters & Setters

    public Long getId() { return id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public CourseStatus getStatus() { return status; }

    public void setStatus(CourseStatus status) { this.status = status; }

    public User getInstructor() { return instructor; }

    public void setInstructor(User instructor) { this.instructor = instructor; }

    public Organization getOrganization() { return organization; }

    public void setOrganization(Organization organization) { this.organization = organization; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}