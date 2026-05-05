package com.skillbridge.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "course_contents",uniqueConstraints = {
        @UniqueConstraint(columnNames = {"module_id", "order_index"})
})
public class CourseContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ContentType type; // VIDEO / PDF / QUIZ

    @Column(name = "content_url")
    private String contentUrl;

    private Integer duration; // seconds (for video)

    @Column(name = "order_index")
    private Integer orderIndex;

    @ManyToOne
    @JoinColumn(name = "module_id")
    private CourseModule module;

    // getters & setters
    public Long getId() { return id; }

    public ContentType getType() { return type; }
    public void setType(ContentType type) { this.type = type; }

    public String getContentUrl() { return contentUrl; }
    public void setContentUrl(String contentUrl) { this.contentUrl = contentUrl; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public CourseModule getModule() { return module; }
    public void setModule(CourseModule module) { this.module = module; }
}