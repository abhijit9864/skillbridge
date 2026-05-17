package com.skillbridge.backend.dto;

import java.util.List;

public class StudentDashboardDto {

    private Integer totalLearningMinutes;

    private Integer activeCourses;

    private Double completionRate;

    private List<ContinueLearningDto> continueLearning;

    public static class ContinueLearningDto {

        private Long courseId;

        private String courseTitle;

        private String thumbnailUrl;

        private String lastContentTitle;

        private Integer progressPercent;

        public Long getCourseId() {
            return courseId;
        }

        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }

        public String getCourseTitle() {
            return courseTitle;
        }

        public void setCourseTitle(String courseTitle) {
            this.courseTitle = courseTitle;
        }

        public String getThumbnailUrl() {
            return thumbnailUrl;
        }

        public void setThumbnailUrl(String thumbnailUrl) {
            this.thumbnailUrl = thumbnailUrl;
        }

        public String getLastContentTitle() {
            return lastContentTitle;
        }

        public void setLastContentTitle(String lastContentTitle) {
            this.lastContentTitle = lastContentTitle;
        }

        public Integer getProgressPercent() {
            return progressPercent;
        }

        public void setProgressPercent(Integer progressPercent) {
            this.progressPercent = progressPercent;
        }
    }

    public Integer getTotalLearningMinutes() {
        return totalLearningMinutes;
    }

    public void setTotalLearningMinutes(Integer totalLearningMinutes) {
        this.totalLearningMinutes = totalLearningMinutes;
    }

    public Integer getActiveCourses() {
        return activeCourses;
    }

    public void setActiveCourses(Integer activeCourses) {
        this.activeCourses = activeCourses;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public List<ContinueLearningDto> getContinueLearning() {
        return continueLearning;
    }

    public void setContinueLearning(List<ContinueLearningDto> continueLearning) {
        this.continueLearning = continueLearning;
    }
}