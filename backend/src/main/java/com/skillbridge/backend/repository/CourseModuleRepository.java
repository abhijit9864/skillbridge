package com.skillbridge.backend.repository;

import com.skillbridge.backend.entity.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseModuleRepository extends JpaRepository<CourseModule, Long> {

    List<CourseModule> findByCourseIdOrderByOrderIndex(Long courseId);
    boolean existsByCourseIdAndTitleIgnoreCase(Long courseId, String title);
    boolean existsByCourseIdAndOrderIndex(Long courseId, Integer orderIndex);
}