package com.skillbridge.backend.repository;

import com.skillbridge.backend.entity.Course;
import com.skillbridge.backend.entity.CourseStatus;
import com.skillbridge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CourseRepository extends JpaRepository<Course, Long> {

    // for instructor "my courses"
    List<Course> findByInstructor(User instructor);

    // for admin (org-level view)
    List<Course> findByOrganizationId(Long organizationId);

    List<Course> findByStatus(CourseStatus status);

    @Query("""
SELECT c FROM Course c
WHERE c.organization.id = :orgId
AND (
    LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%'))
)
ORDER BY c.createdAt DESC
""")
    Page<Course> searchCourses(
            @Param("orgId") Long orgId,
            @Param("search") String search,
            Pageable pageable
    );

    Page<Course> findByOrganizationIdOrderByCreatedAtDesc(
            Long orgId,
            Pageable pageable
    );
    @Query("""
SELECT c FROM Course c
WHERE c.organization.id = :orgId
AND (
    :status IS NULL
    OR c.status = :status
)
AND (
    LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%'))
)
ORDER BY c.createdAt DESC
""")
    Page<Course> filterCourses(
            @Param("orgId") Long orgId,
            @Param("status") CourseStatus status,
            @Param("search") String search,
            Pageable pageable
    );
}