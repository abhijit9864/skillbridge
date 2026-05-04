package com.skillbridge.backend.service;

import com.skillbridge.backend.entity.Organization;
import com.skillbridge.backend.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrganizationService {

    private final OrganizationRepository repository;

    public OrganizationService(OrganizationRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Organization createOrganization(Organization org) {
        if (repository.existsByDomain(org.getDomain())) {
            throw new RuntimeException("Domain already exists!");
        }
        return repository.save(org);
    }

    // GET ALL
    public List<Organization> getAllOrganizations() {
        return repository.findAll();
    }

    // GET BY ID
    public Optional<Organization> getById(Long id) {
        return repository.findById(id);
    }

    // UPDATE
    public Organization updateOrganization(Long id, Organization updatedOrg) {
        Organization existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        // check if domain changed and already exists
        if (!existing.getDomain().equals(updatedOrg.getDomain())
                && repository.existsByDomain(updatedOrg.getDomain())) {
            throw new RuntimeException("Domain already exists!");
        }

        existing.setName(updatedOrg.getName());
        existing.setDomain(updatedOrg.getDomain());
        existing.setSubscriptionPlan(updatedOrg.getSubscriptionPlan());

        return repository.save(existing);
    }

    // DELETE
    public void deleteOrganization(Long id) {
        repository.deleteById(id);
    }
}