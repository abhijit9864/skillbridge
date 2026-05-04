package com.skillbridge.backend.controller;

import com.skillbridge.backend.entity.Organization;
import com.skillbridge.backend.service.OrganizationService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationService service;

    public OrganizationController(OrganizationService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Organization create(@Valid @RequestBody Organization org) {
        return service.createOrganization(org);
    }

    // GET ALL
    @GetMapping
    public List<Organization> getAll() {
        return service.getAllOrganizations();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Organization getById(@PathVariable Long id) {
        return service.getById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public Organization update(@PathVariable Long id,
                               @Valid @RequestBody Organization org) {
        return service.updateOrganization(id, org);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteOrganization(id);
        return "Deleted successfully";
    }
}