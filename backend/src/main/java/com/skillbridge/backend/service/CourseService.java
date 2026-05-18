package com.skillbridge.backend.service;

import com.skillbridge.backend.dto.*;
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
import java.util.ArrayList;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final CourseModuleRepository moduleRepository;
    private final CourseContentRepository contentRepository;
    private final CourseProgressRepository progressRepository;
    private final OrganizationRepository organizationRepository;
    private final NotificationRepository notificationRepository;

    public CourseService(CourseRepository courseRepository,
                         UserRepository userRepository,
                         CourseModuleRepository moduleRepository,
                         CourseContentRepository contentRepository,
                         CourseProgressRepository progressRepository, OrganizationRepository organizationRepository, NotificationRepository notificationRepository) {

        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.moduleRepository = moduleRepository;
        this.contentRepository = contentRepository;
        this.progressRepository = progressRepository;
        this.organizationRepository = organizationRepository;
        this.notificationRepository = notificationRepository;
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
    public Course submitCourse(
            String email,
            Long courseId) {

        User instructor = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        if (!course.getInstructor().getId()
                .equals(instructor.getId())) {

            throw new RuntimeException(
                    "You can only submit your own course"
            );
        }

        course.setStatus(CourseStatus.PENDING);

        Course savedCourse =
                courseRepository.save(course);

        // ✅ notify admins
        List<User> users =
                userRepository.findByOrganizationId(
                        course.getOrganization().getId()
                );

        for (User user : users) {

            if (user.getRole() == Role.ADMIN) {

                createNotification(
                        user,
                        "New Course Submission",
                        instructor.getName()
                                + " submitted course: "
                                + course.getTitle()
                );
            }
        }

        return savedCourse;
    }

    // 🔥 APPROVE COURSE
    public Course approveCourse(
            String email,
            Long courseId) {

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (admin.getRole() != Role.ADMIN) {

            throw new RuntimeException(
                    "Only admin can approve course"
            );
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        course.setStatus(CourseStatus.APPROVED);

        Course savedCourse =
                courseRepository.save(course);

        // ✅ notify instructor
        createNotification(
                course.getInstructor(),
                "Course Approved",
                "Your course '"
                        + course.getTitle()
                        + "' has been approved"
        );

        return savedCourse;
    }

    // 🔥 REJECT COURSE
    public Course rejectCourse(
            String email,
            Long courseId) {

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (admin.getRole() != Role.ADMIN) {

            throw new RuntimeException(
                    "Only admin can reject course"
            );
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        course.setStatus(CourseStatus.REJECTED);

        Course savedCourse =
                courseRepository.save(course);

        // ✅ notify instructor
        createNotification(
                course.getInstructor(),
                "Course Rejected",
                "Your course '"
                        + course.getTitle()
                        + "' has been rejected"
        );

        return savedCourse;
    }

    //GET COURSE
    public Page<Course> getCourses(
            String email,
            int page,
            int size,
            String search,
            String status) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Pageable pageable =
                PageRequest.of(page, size);

        CourseStatus courseStatus = null;

        // ✅ frontend status filter
        if (status != null && !status.isBlank()) {

            courseStatus =
                    CourseStatus.valueOf(
                            status.toUpperCase()
                    );
        }

        // ✅ STUDENT ONLY APPROVED
        if (user.getRole() == Role.STUDENT) {

            return courseRepository.filterCourses(
                    user.getOrganization().getId(),
                    CourseStatus.APPROVED,
                    search,
                    pageable
            );
        }

        // ✅ INSTRUCTOR / ADMIN / SUPERADMIN
        return courseRepository.filterCourses(
                user.getOrganization().getId(),
                courseStatus,
                search,
                pageable
        );
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
    public CourseContent addContent(
            String email,
            Long moduleId,
            String title,
            String description,
            ContentType type,
            MultipartFile file,
            MultipartFile thumbnail,
            Integer orderIndex) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() ->
                        new RuntimeException("Module not found"));

        Course course = module.getCourse();

        if (!course.getInstructor().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "You can only modify your own course"
            );
        }

        if (contentRepository.existsByModuleIdAndOrderIndex(
                moduleId,
                orderIndex
        )) {

            throw new RuntimeException(
                    "Content orderIndex already exists"
            );
        }

        try {

            // ✅ VIDEO validation
            if (type == ContentType.VIDEO) {

                if (file == null || file.isEmpty()) {
                    throw new RuntimeException(
                            "Video file required"
                    );
                }

                if (file.getContentType() == null
                        || !file.getContentType()
                        .startsWith("video/")) {

                    throw new RuntimeException(
                            "Only video files allowed"
                    );
                }
            }

            // ✅ PDF validation
            if (type == ContentType.PDF) {

                if (file == null || file.isEmpty()) {
                    throw new RuntimeException(
                            "PDF file required"
                    );
                }

                if (file.getContentType() == null
                        || !file.getContentType()
                        .equals("application/pdf")) {

                    throw new RuntimeException(
                            "Only PDF files allowed"
                    );
                }
            }

            // ✅ QUIZ validation
            if (type == ContentType.QUIZ) {

                if (file != null && !file.isEmpty()) {
                    throw new RuntimeException(
                            "Quiz should not contain file"
                    );
                }
            }

            String dbPath = null;

            String thumbnailPath = null;

            // ✅ SAVE MAIN FILE
            if (file != null && !file.isEmpty()) {

                Path uploadDir = Paths.get(
                        System.getProperty("user.dir"),
                        "uploads"
                ).toAbsolutePath();

                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                String fileName =
                        System.currentTimeMillis()
                                + "_"
                                + file.getOriginalFilename();

                Path targetPath =
                        uploadDir.resolve(fileName);

                Files.copy(
                        file.getInputStream(),
                        targetPath,
                        StandardCopyOption.REPLACE_EXISTING
                );

                dbPath = "uploads/" + fileName;

                System.out.println(
                        "FILE SAVED TO: " + targetPath
                );
            }

            // ✅ SAVE THUMBNAIL
            if (thumbnail != null && !thumbnail.isEmpty()) {

                if (thumbnail.getContentType() == null
                        || !thumbnail.getContentType()
                        .startsWith("image/")) {

                    throw new RuntimeException(
                            "Only image thumbnails allowed"
                    );
                }

                Path uploadDir = Paths.get(
                        System.getProperty("user.dir"),
                        "uploads"
                ).toAbsolutePath();

                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                String thumbnailName =
                        System.currentTimeMillis()
                                + "_thumb_"
                                + thumbnail.getOriginalFilename();

                Path thumbnailTarget =
                        uploadDir.resolve(thumbnailName);

                Files.copy(
                        thumbnail.getInputStream(),
                        thumbnailTarget,
                        StandardCopyOption.REPLACE_EXISTING
                );

                thumbnailPath =
                        "uploads/" + thumbnailName;
            }

            CourseContent content = new CourseContent();

            content.setTitle(title);

            content.setDescription(description);

            content.setType(type);

            content.setContentUrl(dbPath);

            content.setThumbnailUrl(thumbnailPath);

            content.setDuration(null);

            content.setOrderIndex(orderIndex);

            content.setModule(module);

            return contentRepository.save(content);

        } catch (RuntimeException e) {

            throw e;

        } catch (IOException e) {

            throw new RuntimeException(
                    "File upload failed (IO error): "
                            + e.getMessage(),
                    e
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Upload failed: "
                            + e.getMessage(),
                    e
            );
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

    public CourseLearnDto getCourseLearn(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        CourseLearnDto dto = new CourseLearnDto();

        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setThumbnailUrl(course.getThumbnailUrl());

        List<CourseModule> modules =
                moduleRepository.findByCourseIdOrderByOrderIndex(courseId);

        List<CourseLearnDto.ModuleDto> moduleDtos =
                new ArrayList<>();

        for (CourseModule module : modules) {

            CourseLearnDto.ModuleDto moduleDto =
                    new CourseLearnDto.ModuleDto();

            moduleDto.setId(module.getId());
            moduleDto.setTitle(module.getTitle());
            moduleDto.setOrderIndex(module.getOrderIndex());

            List<CourseContent> contents =
                    contentRepository.findByModuleIdOrderByOrderIndex(
                            module.getId()
                    );

            List<CourseLearnDto.ContentDto> contentDtos =
                    new ArrayList<>();

            for (CourseContent content : contents) {

                CourseLearnDto.ContentDto contentDto =
                        new CourseLearnDto.ContentDto();

                contentDto.setId(content.getId());
                contentDto.setTitle(content.getTitle());
                contentDto.setType(content.getType().name());
                contentDto.setContentUrl(content.getContentUrl());
                contentDto.setDuration(content.getDuration());
                contentDto.setOrderIndex(content.getOrderIndex());

                contentDtos.add(contentDto);
            }

            moduleDto.setContents(contentDtos);

            moduleDtos.add(moduleDto);
        }

        dto.setModules(moduleDtos);

        return dto;
    }

    //Update Module
    public CourseModule updateModule(
            String email,
            Long moduleId,
            String title,
            Integer orderIndex) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));

        if (!module.getCourse()
                .getInstructor()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException("Unauthorized");
        }

        module.setTitle(title);
        module.setOrderIndex(orderIndex);

        return moduleRepository.save(module);
    }

    public CourseContent getContent(Long contentId) {

        return contentRepository.findById(contentId)
                .orElseThrow(() ->
                        new RuntimeException("Content not found"));
    }

    public StudentDashboardDto getStudentDashboard(String email) {

        User student = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CourseProgress> progresses =
                progressRepository.findByUserId(student.getId());

        StudentDashboardDto dto =
                new StudentDashboardDto();

        // ✅ total learning minutes
        int totalMinutes = progresses.stream()
                .mapToInt(p ->
                        p.getLastWatchedTime() != null
                                ? p.getLastWatchedTime() / 60
                                : 0
                )
                .sum();

        dto.setTotalLearningMinutes(totalMinutes);

        // ✅ active courses
        long activeCourses = progresses.stream()
                .map(p ->
                        p.getContent()
                                .getModule()
                                .getCourse()
                                .getId()
                )
                .distinct()
                .count();

        dto.setActiveCourses((int) activeCourses);

        // ✅ completion rate
        double avgProgress = progresses.stream()
                .mapToDouble(p ->
                        p.getProgressPercent() != null
                                ? p.getProgressPercent()
                                : 0
                )
                .average()
                .orElse(0);

        dto.setCompletionRate(avgProgress);

        // ✅ continue learning
        List<StudentDashboardDto.ContinueLearningDto>
                continueDtos = new ArrayList<>();

        for (CourseProgress progress : progresses) {

            Course course = progress.getContent()
                    .getModule()
                    .getCourse();

            StudentDashboardDto.ContinueLearningDto item =
                    new StudentDashboardDto.ContinueLearningDto();

            item.setCourseId(course.getId());

            item.setCourseTitle(course.getTitle());

            item.setThumbnailUrl(course.getThumbnailUrl());

            item.setLastContentTitle(
                    progress.getContent().getTitle()
            );

            item.setProgressPercent(
                    progress.getProgressPercent() != null
                            ? progress.getProgressPercent().intValue()
                            : 0
            );

            continueDtos.add(item);
        }

        dto.setContinueLearning(continueDtos);

        return dto;
    }
    public InstructorDashboardDto getInstructorDashboard(
            String email) {

        User instructor = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Course> courses =
                courseRepository.findByInstructor(instructor);

        InstructorDashboardDto dto =
                new InstructorDashboardDto();

        dto.setTotalCourses(courses.size());

        dto.setApprovedCourses(
                (int) courses.stream()
                        .filter(c ->
                                c.getStatus() == CourseStatus.APPROVED)
                        .count()
        );

        dto.setPendingCourses(
                (int) courses.stream()
                        .filter(c ->
                                c.getStatus() == CourseStatus.PENDING)
                        .count()
        );

        dto.setDraftCourses(
                (int) courses.stream()
                        .filter(c ->
                                c.getStatus() == CourseStatus.DRAFT)
                        .count()
        );

        dto.setRejectedCourses(
                (int) courses.stream()
                        .filter(c ->
                                c.getStatus() == CourseStatus.REJECTED)
                        .count()
        );

        // ✅ total modules
        int moduleCount = 0;

        // ✅ total contents
        int contentCount = 0;

        for (Course course : courses) {

            List<CourseModule> modules =
                    moduleRepository
                            .findByCourseIdOrderByOrderIndex(
                                    course.getId()
                            );

            moduleCount += modules.size();

            for (CourseModule module : modules) {

                List<CourseContent> contents =
                        contentRepository
                                .findByModuleIdOrderByOrderIndex(
                                        module.getId()
                                );

                contentCount += contents.size();
            }
        }

        dto.setTotalModules(moduleCount);

        dto.setTotalContents(contentCount);

        // ✅ recent courses
        List<InstructorDashboardDto.RecentCourseDto>
                recentDtos = new ArrayList<>();

        for (Course course : courses) {

            InstructorDashboardDto.RecentCourseDto item =
                    new InstructorDashboardDto.RecentCourseDto();

            item.setId(course.getId());

            item.setTitle(course.getTitle());

            item.setThumbnailUrl(course.getThumbnailUrl());

            item.setStatus(course.getStatus().name());

            recentDtos.add(item);
        }

        dto.setRecentCourses(recentDtos);

        return dto;
    }
    public AdminDashboardDto getAdminDashboard(
            String email) {

        User admin = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin allowed");
        }

        Long orgId = admin.getOrganization().getId();

        AdminDashboardDto dto =
                new AdminDashboardDto();

        // ✅ users
        dto.setTotalUsers(
                userRepository.countByOrganizationId(orgId)
        );

        dto.setTotalStudents(
                userRepository.countByOrganizationIdAndRole(
                        orgId,
                        Role.STUDENT
                )
        );

        dto.setTotalInstructors(
                userRepository.countByOrganizationIdAndRole(
                        orgId,
                        Role.INSTRUCTOR
                )
        );

        List<Course> courses =
                courseRepository.findByOrganizationId(orgId);

        dto.setApprovedCourses(
                (int) courses.stream()
                        .filter(c ->
                                c.getStatus() == CourseStatus.APPROVED)
                        .count()
        );

        dto.setPendingCourses(
                (int) courses.stream()
                        .filter(c ->
                                c.getStatus() == CourseStatus.PENDING)
                        .count()
        );

        dto.setRejectedCourses(
                (int) courses.stream()
                        .filter(c ->
                                c.getStatus() == CourseStatus.REJECTED)
                        .count()
        );

        // ✅ pending approval list
        List<AdminDashboardDto.PendingCourseDto>
                pendingDtos = new ArrayList<>();

        for (Course course : courses) {

            if (course.getStatus() == CourseStatus.PENDING) {

                AdminDashboardDto.PendingCourseDto item =
                        new AdminDashboardDto.PendingCourseDto();

                item.setId(course.getId());

                item.setTitle(course.getTitle());

                item.setThumbnailUrl(
                        course.getThumbnailUrl()
                );

                item.setInstructorName(
                        course.getInstructor().getName()
                );

                pendingDtos.add(item);
            }
        }

        dto.setPendingCoursesList(pendingDtos);

        return dto;
    }
    public SuperAdminDashboardDto getSuperAdminDashboard(
            String email) {

        User superAdmin = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (superAdmin.getRole() != Role.SUPER_ADMIN) {

            throw new RuntimeException(
                    "Only super admin allowed"
            );
        }

        SuperAdminDashboardDto dto =
                new SuperAdminDashboardDto();

        List<Organization> organizations =
                organizationRepository.findAll();

        List<Course> courses =
                courseRepository.findAll();

        dto.setTotalOrganizations(
                organizations.size()
        );

        dto.setTotalUsers(
                userRepository.findAll().size()
        );

        dto.setTotalStudents(
                userRepository.countByRole(Role.STUDENT)
        );

        dto.setTotalInstructors(
                userRepository.countByRole(Role.INSTRUCTOR)
        );

        dto.setTotalAdmins(
                userRepository.countByRole(Role.ADMIN)
        );

        dto.setTotalCourses(
                courses.size()
        );

        dto.setApprovedCourses(
                (int) courses.stream()
                        .filter(c ->
                                c.getStatus() == CourseStatus.APPROVED)
                        .count()
        );

        dto.setPendingCourses(
                (int) courses.stream()
                        .filter(c ->
                                c.getStatus() == CourseStatus.PENDING)
                        .count()
        );

        // ✅ org list
        List<SuperAdminDashboardDto.OrganizationDto>
                orgDtos = new ArrayList<>();

        for (Organization org : organizations) {

            SuperAdminDashboardDto.OrganizationDto item =
                    new SuperAdminDashboardDto.OrganizationDto();

            item.setId(org.getId());

            item.setName(org.getName());

            item.setDomain(org.getDomain());

            item.setSubscriptionPlan(
                    org.getSubscriptionPlan()
            );

            orgDtos.add(item);
        }

        dto.setOrganizations(orgDtos);

        return dto;
    }
    private void createNotification(
            User user,
            String title,
            String message) {

        Notification notification =
                new Notification();

        notification.setUser(user);

        notification.setTitle(title);

        notification.setMessage(message);

        notificationRepository.save(notification);
    }
}