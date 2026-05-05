package com.skillbridge.backend.controller;

import com.skillbridge.backend.config.JwtUtil;
import com.skillbridge.backend.dto.CreateCourseDto;
import com.skillbridge.backend.entity.Course;
import com.skillbridge.backend.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.skillbridge.backend.entity.CourseModule;
import java.util.Map;
import com.skillbridge.backend.entity.CourseContent;
import com.skillbridge.backend.entity.ContentType;
import org.springframework.web.multipart.MultipartFile;
import com.skillbridge.backend.entity.CourseProgress;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;
    private final JwtUtil jwtUtil;

    public CourseController(CourseService courseService, JwtUtil jwtUtil) {
        this.courseService = courseService;
        this.jwtUtil = jwtUtil;
    }

    // 🔥 CREATE COURSE
    @PostMapping
    public Course createCourse(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody CreateCourseDto dto) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return courseService.createCourse(email, dto);
    }

    @PutMapping("/{id}/submit")
    public Course submitCourse(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return courseService.submitCourse(email, id);
    }

    @PutMapping("/{id}/approve")
    public Course approveCourse(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return courseService.approveCourse(email, id);
    }

    @PutMapping("/{id}/reject")
    public Course rejectCourse(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return courseService.rejectCourse(email, id);
    }
    @GetMapping
    public List<Course> getCourses(
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return courseService.getCourses(email);
    }

    @PostMapping("/{courseId}/modules")
    public CourseModule addModule(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> body) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        String title = (String) body.get("title");
        Integer orderIndex = (Integer) body.get("orderIndex");

        return courseService.addModule(email, courseId, title, orderIndex);
    }

    @PostMapping(value = "/modules/{moduleId}/contents", consumes = "multipart/form-data")
    public CourseContent addContent(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long moduleId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestParam("orderIndex") Integer orderIndex) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return courseService.addContent(
                email,
                moduleId,
                ContentType.valueOf(type),
                file,
                orderIndex
        );
    }
    @PostMapping("/progress")
    public CourseProgress saveProgress(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> body) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        Long contentId = Long.valueOf(body.get("contentId").toString());
        Integer time = Integer.valueOf(body.get("lastWatchedTime").toString());

        return courseService.saveProgress(email, contentId, time);
    }
    @GetMapping("/progress/{contentId}")
    public CourseProgress getProgress(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long contentId) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return courseService.getProgress(email, contentId);
    }


}