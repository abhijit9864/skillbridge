package com.skillbridge.backend.dto;

import java.util.List;

public class InstructorDashboardDto {

    private Integer totalCourses;

    private Integer approvedCourses;

    private Integer pendingCourses;

    private Integer draftCourses;

    private Integer rejectedCourses;

    private Integer totalModules;

    private Integer totalContents;

    private List<RecentCourseDto> recentCourses;

    public static class RecentCourseDto {

        private Long id;

        private String title;

        private String thumbnailUrl;

        private String status;

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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
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

    public void setApprovedCourses(Integer approvedCourses) {
        this.approvedCourses = approvedCourses;
    }

    public Integer getPendingCourses() {
        return pendingCourses;
    }

    public void setPendingCourses(Integer pendingCourses) {
        this.pendingCourses = pendingCourses;
    }

    public Integer getDraftCourses() {
        return draftCourses;
    }

    public void setDraftCourses(Integer draftCourses) {
        this.draftCourses = draftCourses;
    }

    public Integer getRejectedCourses() {
        return rejectedCourses;
    }

    public void setRejectedCourses(Integer rejectedCourses) {
        this.rejectedCourses = rejectedCourses;
    }

    public Integer getTotalModules() {
        return totalModules;
    }

    public void setTotalModules(Integer totalModules) {
        this.totalModules = totalModules;
    }

    public Integer getTotalContents() {
        return totalContents;
    }

    public void setTotalContents(Integer totalContents) {
        this.totalContents = totalContents;
    }

    public List<RecentCourseDto> getRecentCourses() {
        return recentCourses;
    }

    public void setRecentCourses(List<RecentCourseDto> recentCourses) {
        this.recentCourses = recentCourses;
    }
}