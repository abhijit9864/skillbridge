package com.skillbridge.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateCourseDto {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    public String getTitle() { return title; }
    public String getDescription() { return description; }
}