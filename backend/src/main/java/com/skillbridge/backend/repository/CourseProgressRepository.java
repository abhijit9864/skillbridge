package com.skillbridge.backend.repository;

import com.skillbridge.backend.entity.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {

    Optional<CourseProgress> findByUserIdAndContentId(Long userId, Long contentId);
    List<CourseProgress> findByUserId(Long userId);
}