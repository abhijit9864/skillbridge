package com.skillbridge.backend.dto;

import java.util.List;

public class AdminDashboardDto {

    private Integer totalUsers;

    private Integer totalStudents;

    private Integer totalInstructors;

    private Integer approvedCourses;

    private Integer pendingCourses;

    private Integer rejectedCourses;

    private List<PendingCourseDto> pendingCoursesList;

    public static class PendingCourseDto {

        private Long id;

        private String title;

        private String thumbnailUrl;

        private String instructorName;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getThumbnailUrl() {
            return thumbnailUrl;
        }

        public void setThumbnailUrl(String thumbnailUrl) {
            this.thumbnailUrl = thumbnailUrl;
        }

        public String getInstructorName() {
            return instructorName;
        }

        public void setInstructorName(String instructorName) {
            this.instructorName = instructorName;
        }
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

    public void setTotalInstructors(Integer totalInstructors) {
        this.totalInstructors = totalInstructors;
    }

    public Integer getApprovedCourses() {
        return approvedCourses;
    }

    public void setApprovedCourses(Integer approvedCourses) {
        this.approvedCourses = approvedCourses;
    }

    public Integer getPendingCourses() {
        return pendingCourses;
    }

    public void setPendingCourses(Integer pendingCourses) {
        this.pendingCourses = pendingCourses;
    }

    public Integer getRejectedCourses() {
        return rejectedCourses;
    }

    public void setRejectedCourses(Integer rejectedCourses) {
        this.rejectedCourses = rejectedCourses;
    }

    public List<PendingCourseDto> getPendingCoursesList() {
        return pendingCoursesList;
    }

    public void setPendingCoursesList(
            List<PendingCourseDto> pendingCoursesList) {

        this.pendingCoursesList = pendingCoursesList;
    }
}