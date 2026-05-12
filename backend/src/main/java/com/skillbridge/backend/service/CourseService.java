package com.skillbridge.backend.service;

import com.skillbridge.backend.dto.CreateCourseDto;
import com.skillbridge.backend.entity.*;
import com.skillbridge.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.io.File;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseModuleRepository moduleRepository;
    private final CourseContentRepository contentRepository;
    private final CourseProgressRepository progressRepository;

    public CourseService(CourseRepository courseRepository,
                         UserRepository userRepository,
                         CourseModuleRepository moduleRepository,
                         CourseContentRepository contentRepository,
                         CourseProgressRepository progressRepository) {

        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.moduleRepository = moduleRepository;
        this.contentRepository = contentRepository;
        this.progressRepository = progressRepository;
    }

    // 🔥 CREATE COURSE
    public Course createCourse(
            String email,
            String title,
            String description,
            MultipartFile thumbnail) {

        User instructor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (instructor.getRole() != Role.INSTRUCTOR) {
            throw new RuntimeException("Only instructors can create courses");
        }

        if (instructor.getOrganization() == null) {
            throw new RuntimeException("Instructor must belong to an organization");
        }

        try {

            String thumbnailPath = null;

            // ✅ thumbnail upload
            if (thumbnail != null && !thumbnail.isEmpty()) {

                String uploadDir = System.getProperty("user.dir")
                        + File.separator
                        + "uploads"
                        + File.separator;

                File dir = new File(uploadDir);

                if (!dir.exists()) {
                    dir.mkdirs();
                }

                String fileName = System.currentTimeMillis()
                        + "_"
                        + thumbnail.getOriginalFilename();

                String fullPath = uploadDir + fileName;

                thumbnail.transferTo(new File(fullPath));

                thumbnailPath = "uploads/" + fileName;
            }

            Course course = new Course();

            course.setTitle(title);

            course.setDescription(description);

            course.setThumbnailUrl(thumbnailPath);

            course.setInstructor(instructor);

            course.setOrganization(instructor.getOrganization());

            return courseRepository.save(course);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Course creation failed: " + e.getMessage()
            );
        }
    }

    // 🔥 SUBMIT COURSE
    public Course submitCourse(String email, Long courseId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(user.getId())) {
            throw new RuntimeException("You can only submit your own course");
        }

        if (course.getStatus() != CourseStatus.DRAFT) {
            throw new RuntimeException("Only draft courses can be submitted");
        }

        course.setStatus(CourseStatus.PENDING);
        return courseRepository.save(course);
    }

    // 🔥 APPROVE COURSE
    public Course approveCourse(String email, Long courseId) {

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can approve courses");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getOrganization().getId()
                .equals(admin.getOrganization().getId())) {
            throw new RuntimeException("Cannot approve outside your organization");
        }

        if (course.getStatus() != CourseStatus.PENDING) {
            throw new RuntimeException("Course must be pending");
        }

        course.setStatus(CourseStatus.APPROVED);
        return courseRepository.save(course);
    }

    // 🔥 REJECT COURSE
    public Course rejectCourse(String email, Long courseId) {

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can reject courses");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getOrganization().getId()
                .equals(admin.getOrganization().getId())) {
            throw new RuntimeException("Cannot reject outside your organization");
        }

        course.setStatus(CourseStatus.REJECTED);
        return courseRepository.save(course);
    }

    // 🔥 GET COURSES
    public List<Course> getCourses(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        switch (user.getRole()) {

            case SUPER_ADMIN:
                return courseRepository.findAll();

            case ADMIN:
                return courseRepository.findByOrganizationId(
                        user.getOrganization().getId()
                );

            case INSTRUCTOR:
                return courseRepository.findByInstructor(user);

            case STUDENT:
                return courseRepository.findByStatus(CourseStatus.APPROVED);

            default:
                throw new RuntimeException("Access denied");
        }
    }

    // 🔥 ADD MODULE
    public CourseModule addModule(String email, Long courseId, String title, Integer orderIndex) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!course.getInstructor().getId().equals(user.getId())) {
            throw new RuntimeException("You can only modify your own course");
        }

        if (moduleRepository.existsByCourseIdAndTitleIgnoreCase(courseId, title)) {
            throw new RuntimeException("Module name already exists");
        }

        if (moduleRepository.existsByCourseIdAndOrderIndex(courseId, orderIndex)) {
            throw new RuntimeException("orderIndex already exists");
        }

        CourseModule module = new CourseModule();
        module.setTitle(title);
        module.setOrderIndex(orderIndex);
        module.setCourse(course);

        return moduleRepository.save(module);
    }

    // 🔥 ADD CONTENT
    public CourseContent addContent(String email,
                                    Long moduleId,
                                    String title,
                                    ContentType type,
                                    MultipartFile file,
                                    Integer orderIndex) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        Course course = module.getCourse();

        if (!course.getInstructor().getId().equals(user.getId())) {
            throw new RuntimeException("You can only modify your own course");
        }

        if (contentRepository.existsByModuleIdAndOrderIndex(moduleId, orderIndex)) {
            throw new RuntimeException("Content orderIndex already exists");
        }

        try {

            System.out.println("SERVICE FILE = " + file);
            System.out.println("SERVICE EMPTY = " + (file != null ? file.isEmpty() : "NULL"));
            System.out.println("SERVICE NAME = " + (file != null ? file.getOriginalFilename() : "NULL"));

            // ✅ VIDEO validation
            if (type == ContentType.VIDEO) {

                if (file == null || file.isEmpty()) {
                    throw new RuntimeException("Video file required");
                }

                if (file.getContentType() == null
                        || !file.getContentType().startsWith("video/")) {

                    throw new RuntimeException("Only video files allowed");
                }
            }

            // ✅ PDF validation
            if (type == ContentType.PDF) {

                if (file == null || file.isEmpty()) {
                    throw new RuntimeException("PDF file required");
                }

                if (file.getContentType() == null
                        || !file.getContentType().equals("application/pdf")) {

                    throw new RuntimeException("Only PDF files allowed");
                }
            }

            // ✅ QUIZ validation
            if (type == ContentType.QUIZ) {

                if (file != null && !file.isEmpty()) {
                    throw new RuntimeException("Quiz should not contain file");
                }
            }

            String dbPath = null;

            // ✅ save file only if exists
            if (file != null && !file.isEmpty()) {

                Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads").toAbsolutePath();

                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                String fileName = System.currentTimeMillis()
                        + "_"
                        + file.getOriginalFilename();

                Path targetPath = uploadDir.resolve(fileName);

                // ✅ NIO copy — works reliably on Windows
                Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

                dbPath = "uploads/" + fileName;
                System.out.println("FILE SAVED TO: " + targetPath);
            }

            CourseContent content = new CourseContent();

            content.setTitle(title);
            content.setType(type);
            content.setContentUrl(dbPath);
            content.setDuration(null);
            content.setOrderIndex(orderIndex);
            content.setModule(module);

            return contentRepository.save(content);

        } catch (RuntimeException e) {
            throw e; // re-throw validation errors as-is
        } catch (IOException e) {
            throw new RuntimeException("File upload failed (IO error): " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Upload failed: " + e.getMessage(), e);
        }
    }
    // 🔥 SAVE PROGRESS
    public CourseProgress saveProgress(String email,
                                       Long contentId,
                                       Integer lastWatchedTime) {

        if (lastWatchedTime < 0) {
            throw new RuntimeException("Invalid time");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CourseContent content = contentRepository.findById(contentId)
                .orElseThrow(() -> new RuntimeException("Content not found"));

        CourseProgress progress = progressRepository
                .findByUserIdAndContentId(user.getId(), contentId)
                .orElse(new CourseProgress());

        progress.setUser(user);
        progress.setContent(content);
        progress.setLastWatchedTime(lastWatchedTime);

        if (content.getDuration() != null && content.getDuration() > 0) {
            double percent = (lastWatchedTime * 100.0) / content.getDuration();
            progress.setProgressPercent(Math.min(percent, 100.0));
        }

        return progressRepository.save(progress);
    }

    // 🔥 GET PROGRESS
    public CourseProgress getProgress(String email, Long contentId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return progressRepository
                .findByUserIdAndContentId(user.getId(), contentId)
                .orElse(null);
    }
}