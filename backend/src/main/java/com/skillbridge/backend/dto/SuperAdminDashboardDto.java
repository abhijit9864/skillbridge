package com.skillbridge.backend.dto;

import java.util.List;

public class SuperAdminDashboardDto {

    private Integer totalOrganizations;

    private Integer totalUsers;

    private Integer totalStudents;

    private Integer totalInstructors;

    private Integer totalAdmins;

    private Integer totalCourses;

    private Integer approvedCourses;

    private Integer pendingCourses;

    private List<OrganizationDto> organizations;

    public static class OrganizationDto {

        private Long id;

        private String name;

        private String domain;

        private String subscriptionPlan;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDomain() {
            return domain;
        }

        public void setDomain(String domain) {
            this.domain = domain;
        }

        public String getSubscriptionPlan() {
            return subscriptionPlan;
        }

        public void setSubscriptionPlan(
                String subscriptionPlan) {

            this.subscriptionPlan = subscriptionPlan;
        }
    }

    public Integer getTotalOrganizations() {
        return totalOrganizations;
    }

    public void setTotalOrganizations(
            Integer totalOrganizations) {

        this.totalOrganizations = totalOrganizations;
    }

    public Integer getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Integer totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Integer getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Integer totalStudents) {
        this.totalStudents = totalStudents;
    }

    public Integer getTotalInstructors() {
        return totalInstructors;
    }

    public void setTotalInstructors(
            Integer totalInstructors) {

        this.totalInstructors = totalInstructors;
    }

    public Integer getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(Integer totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public Integer getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(Integer totalCourses) {
        this.totalCourses = totalCourses;
    }

    public Integer getApprovedCourses() {
        return approvedCourses;
    }

    public void setApprovedCourses(
            Integer approvedCourses) {

        this.approvedCourses = approvedCourses;
    }

    public Integer getPendingCourses() {
        return pendingCourses;
    }

    public void setPendingCourses(
            Integer pendingCourses) {

        this.pendingCourses = pendingCourses;
    }

    public List<OrganizationDto> getOrganizations() {
        return organizations;
    }

    public void setOrganizations(
            List<OrganizationDto> organizations) {

        this.organizations = organizations;
    }
}