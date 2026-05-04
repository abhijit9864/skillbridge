package com.skillbridge.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "organizations",uniqueConstraints = @UniqueConstraint(columnNames = "domain"))
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name too long")
    private String name;


    @NotBlank(message = "Domain is required")
    @Size(max = 100)
    @Pattern(
            regexp = "^[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            message = "Invalid domain format"
    )
    private String domain;

    @NotBlank(message = "Subscription plan is required")
    @Column(name = "subscription_plan")
    private String subscriptionPlan;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}