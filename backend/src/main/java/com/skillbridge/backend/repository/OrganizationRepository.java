package com.skillbridge.backend.repository;
import com.skillbridge.backend.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    boolean existsByDomain(String domain);
}
