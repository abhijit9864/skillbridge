package com.skillbridge.backend.controller;

import com.skillbridge.backend.config.JwtUtil;
import com.skillbridge.backend.dto.*;
import com.skillbridge.backend.entity.Course;
import com.skillbridge.backend.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
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

    @GetMapping
    public Page<Course> getCourses(

            @RequestHeader("Authorization")
            String authHeader,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "8")
            int size,

            @RequestParam(defaultValue = "")
            String search,

            @RequestParam(required = false)
            String status) {

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        return courseService.getCourses(
                email,
                page,
                size,
                search,
                status
        );
    }

    // 🔥 CREATE COURSE
    @PostMapping(consumes = "multipart/form-data")
    public Course createCourse(

            @RequestHeader("Authorization")
            String authHeader,

            @RequestParam("title")
            String title,

            @RequestParam("description")
            String description,

            @RequestParam(value = "thumbnail", required = false)
            MultipartFile thumbnail) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return courseService.createCourse(
                email,
                title,
                description,
                thumbnail
        );
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

    @PostMapping(
            value = "/modules/{moduleId}/contents",
            consumes = "multipart/form-data"
    )
    public CourseContent addContent(

            @RequestHeader("Authorization")
            String authHeader,

            @PathVariable
            Long moduleId,

            @RequestParam("title")
            String title,

            @RequestParam(value = "description", required = false)
            String description,

            @RequestParam("type")
            String type,

            @RequestParam("orderIndex")
            Integer orderIndex,

            @RequestParam(value = "file", required = false)
            MultipartFile file,

            @RequestParam(value = "thumbnail", required = false)
            MultipartFile thumbnail) {

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        System.out.println("FILE = " + file);

        System.out.println(
                "IS EMPTY = " +
                        (file != null ? file.isEmpty() : "NULL")
        );

        System.out.println(
                "NAME = " +
                        (file != null
                                ? file.getOriginalFilename()
                                : "NULL")
        );

        System.out.println("TYPE = " + type);

        return courseService.addContent(
                email,
                moduleId,
                title,
                description,
                ContentType.valueOf(type),
                file,
                thumbnail,
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
    @GetMapping("/{courseId}/learn")
    public CourseLearnDto getCourseLearn(
            @PathVariable Long courseId) {

        return courseService.getCourseLearn(courseId);
    }

    @PutMapping("/modules/{moduleId}")
    public CourseModule updateModule(

            @RequestHeader("Authorization")
            String authHeader,

            @PathVariable Long moduleId,

            @RequestBody Map<String, Object> body) {

        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);

        return courseService.updateModule(
                email,
                moduleId,
                (String) body.get("title"),
                (Integer) body.get("orderIndex")
        );
    }

    @GetMapping("/contents/{contentId}")
    public CourseContent getContent(
            @PathVariable Long contentId) {

        return courseService.getContent(contentId);
    }

    @GetMapping("/student/dashboard")
    public StudentDashboardDto getStudentDashboard(
            @RequestHeader("Authorization")
            String authHeader) {

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        return courseService.getStudentDashboard(email);
    }

    @GetMapping("/instructor/dashboard")
    public InstructorDashboardDto getInstructorDashboard(
            @RequestHeader("Authorization")
            String authHeader) {

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        return courseService.getInstructorDashboard(email);
    }
    @GetMapping("/admin/dashboard")
    public AdminDashboardDto getAdminDashboard(
            @RequestHeader("Authorization")
            String authHeader) {

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        return courseService.getAdminDashboard(email);
    }
    @GetMapping("/super-admin/dashboard")
    public SuperAdminDashboardDto getSuperAdminDashboard(
            @RequestHeader("Authorization")
            String authHeader) {

        String token = authHeader.substring(7);

        String email = jwtUtil.extractEmail(token);

        return courseService
                .getSuperAdminDashboard(email);
    }
}