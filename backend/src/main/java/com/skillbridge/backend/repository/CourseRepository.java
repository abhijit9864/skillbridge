package com.skillbridge.backend.repository;

import com.skillbridge.backend.entity.Course;
import com.skillbridge.backend.entity.CourseStatus;
import com.skillbridge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    // for instructor "my courses"
    List<Course> findByInstructor(User instructor);

    // for admin (org-level view)
    List<Course> findByOrganizationId(Long organizationId);

    List<Course> findByStatus(CourseStatus status);
}