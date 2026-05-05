package com.skillbridge.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "course_modules",uniqueConstraints = {
        @UniqueConstraint(columnNames = {"course_id", "title"}),
        @UniqueConstraint(columnNames = {"course_id", "order_index"})
})
public class CourseModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "order_index")
    private Integer orderIndex;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    // getters & setters
    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Integer getOrderIndex() { return orderIndex; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
}