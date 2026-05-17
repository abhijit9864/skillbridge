package com.skillbridge.backend.repository;

import com.skillbridge.backend.entity.Role;
import com.skillbridge.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByOrganizationId(Long orgId);
    int countByOrganizationId(Long organizationId);
    int countByOrganizationIdAndRole(
            Long organizationId,
            Role role
    );
    int countByRole(Role role);
    @Query("""
SELECT u FROM User u
WHERE u.organization.id = :orgId
AND u.role = :role
AND (
    LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
    OR
    LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
)
""")
    Page<User> searchStudents(
            @Param("orgId") Long orgId,
            @Param("role") Role role,
            @Param("search") String search,
            Pageable pageable
    );
    Page<User> findByOrganizationIdAndRole(
            Long organizationId,
            Role role,
            Pageable pageable
    );
}