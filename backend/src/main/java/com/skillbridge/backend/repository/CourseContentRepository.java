package com.skillbridge.backend.repository;

import com.skillbridge.backend.entity.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseContentRepository extends JpaRepository<CourseContent, Long> {

    List<CourseContent> findByModuleIdOrderByOrderIndex(Long moduleId);
    boolean existsByModuleIdAndOrderIndex(Long moduleId, Integer orderIndex);
}