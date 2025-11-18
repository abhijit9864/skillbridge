import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaPlay,
  FaArrowLeft,
  FaClock,
  FaGraduationCap,
  FaUser,
  FaCheckCircle,
  FaLock,
  FaClipboardCheck,
} from "react-icons/fa";
import Navbar from "../landingPage/navbar";
import "./course-detail.css";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const testSectionRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [chapterProgress, setChapterProgress] = useState({});
  const [unlockedChapters, setUnlockedChapters] = useState([]);
  const [allChaptersCompleted, setAllChaptersCompleted] = useState(false);
  const api = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole ? parseInt(storedRole) : null);
    const userStatus = localStorage.getItem("isLoggedIn");
    console.log(userStatus);
    setIsLoggedIn(userStatus === "true");
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `${api}/api/courses/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch course");
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(
          `${api}/api/courses/${id}/chapters`
        );
        if (!response.ok) throw new Error("Failed to fetch chapters");
        const data = await response.json();
        setChapters(data.chapters || []);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchChapters();
  }, [id]);

  useEffect(() => {
    if (id && chapters.length > 0) {
      let completedChapters = 0;
      const chapterProgressObj = {};
      const unlockedChapterIds = [];

      if (chapters.length > 0) {
        unlockedChapterIds.push(chapters[0].chapter_id);
      }

      chapters.forEach((ch, index) => {
        const savedProgress = localStorage.getItem(
          `progress_${id}_${ch.chapter_id}`
        );
        const progressValue = savedProgress ? parseFloat(savedProgress) : 0;

        chapterProgressObj[ch.chapter_id] = progressValue;

        if (progressValue >= 80) {
          completedChapters++;

          if (index < chapters.length - 1) {
            unlockedChapterIds.push(chapters[index + 1].chapter_id);
          }
        }
      });

      setChapterProgress(chapterProgressObj);
      setUnlockedChapters(unlockedChapterIds);

      const progressPercentage =
        chapters.length > 0 ? (completedChapters / chapters.length) * 100 : 0;
      setProgress(progressPercentage);

      setAllChaptersCompleted(
        completedChapters === chapters.length && chapters.length > 0
      );
    }
  }, [id, chapters]);

  // Check if we should scroll to the test section
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const showTest = queryParams.get("showTest");

    if (showTest === "true" && testSectionRef.current && allChaptersCompleted) {
      // Scroll to test section with a slight delay to ensure rendering is complete
      setTimeout(() => {
        testSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        // Add a highlight effect
        testSectionRef.current.classList.add("highlight-section");
        // Remove highlight after animation
        setTimeout(() => {
          testSectionRef.current.classList.remove("highlight-section");
        }, 2000);
      }, 500);
    }
  }, [location.search, allChaptersCompleted]);

  const handleEditClick = () => {
    navigate(`/lecturemode/${course.course_id}`);
  };

  const handlePlayClick = () => {
    if (!isLoggedIn) {
      alert("Please log in to access the course.");
      return;
    }

    if (chapters.length === 0) {
      alert("No chapters available.");
      return;
    }

    let lastWatchedChapter = parseInt(
      localStorage.getItem(`last_watched_chapter_${id}`)
    );

    if (
      !lastWatchedChapter ||
      !chapters.some((ch) => ch.chapter_id === lastWatchedChapter)
    ) {
      lastWatchedChapter = chapters[0].chapter_id;
    }

    navigate(`/courses/${id}/chapters/${lastWatchedChapter}`);
  };

  const handleChapterClick = (chapter) => {
    if (!isLoggedIn) {
      alert("Please log in to access the course content.");
      navigate("/login");
      return;
    }

    if (unlockedChapters.includes(chapter.chapter_id)) {
      navigate(`/courses/${id}/chapters/${chapter.chapter_id}`);
    } else {
      alert("Complete the previous chapter to unlock this one!");
    }
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} minutes`;
  };

  const handleBackClick = () => {
    if (!isLoggedIn) {
      navigate('/'); // Navigate to landing page if not logged in
    } else {
      navigate('/course'); // Navigate to courses page if logged in
    }
  };

  if (loading)
    return <div className="loading-text">Loading course details...</div>;
  if (error) return <div className="error-text">Error: {error}</div>;
  if (!course) return <div className="error-text">Course not found.</div>;

  return (
    <div className="course-detail-wrapper">
      <Navbar
        activePage="home"
        theme="light"
        toggleTheme={() => {}}
        setActivePage={() => {}}
      />

      <div className="course-hero">
        <div className="container">
          <button className="back-button" onClick={handleBackClick}>
            <FaArrowLeft /> Back to {isLoggedIn ? 'Courses' : 'Home'}
          </button>

          <div className="course-header">
            <h1 className="course-title-course">{course.title}</h1>

            <div className="course-meta">
              <div className="course-stats">
                <div className="stat-item">
                  <FaClock className="stat-icon" />
                  <span>
                    <strong>Total Length:</strong>{" "}
                    {formatDuration(
                      chapters.reduce(
                        (total, ch) => total + (ch.duration || 0),
                        0
                      )
                    )}
                  </span>
                </div>
                <div className="stat-item">
                  <FaGraduationCap className="stat-icon" />
                  <span>
                    <strong>{chapters.length}</strong> Chapters
                  </span>
                </div>
                <div className="stat-item">
                  <FaUser className="stat-icon" />
                  <span>
                    Instructor:{" "}
                    <strong>
                      {course.instructor_name || "Expert Instructor"}
                    </strong>
                  </span>
                </div>
                {chapters.length > 0 && (
                  <div className="stat-item">
                    <FaCheckCircle className="stat-icon" />
                    <span>
                      <strong>{Math.round(progress)}%</strong> completed
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {userRole !== null &&
            (userRole === 2 || userRole === 3 || userRole === 4) && (
              <button className="edit-course-btn" onClick={handleEditClick}>
                Edit Course
              </button>
            )}
        </div>
      </div>

      <div className="course-content-container">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="content-card">
                <h2 className="section-title">Course Overview</h2>
                <p className="course-description">{course.description}</p>

                {/* {chapters.length > 0 && (
                  <div className="progress-section">
                    <h4 className="progress-heading">Course Progress</h4>
                    <div className="progress-container">
                      {isLoggedIn ? (
                        <div
                          className="progress-bar"
                          style={{ width: `${progress}%` }}
                        ></div>
                      ) : (
                        <div className="login-required-progress">
                          <FaLock className="lock-icon" />
                          <span>Log in to track your progress</span>
                        </div>
                      )}
                    </div>
                    {isLoggedIn && (
                      <div className="progress-text">
                        {Math.round(progress)}% completed
                        {progress === 100 && " 🎉"}
                      </div>
                    )}
                  </div>
                )} */}
              </div>

              <div className="content-card">
                <h2 className="section-title">Course Content</h2>
                {error ? (
                  <p className="error-text">Error: {error}</p>
                ) : chapters.length > 0 ? (
                  <div className="chapters-list">
                    {chapters.map((chapter, index) => {
                      const isCompleted =
                        isLoggedIn && chapterProgress[chapter.chapter_id] >= 80;
                      const isUnlocked =
                        isLoggedIn &&
                        unlockedChapters.includes(chapter.chapter_id);

                      return (
                        <div
                          key={chapter.chapter_id}
                          className={`chapter-item ${
                            isLoggedIn
                              ? isUnlocked
                                ? "unlocked"
                                : "locked"
                              : "locked"
                          } ${isCompleted ? "completed" : ""}`}
                          onClick={() => handleChapterClick(chapter)}
                        >
                          <div className="chapter-info">
                            <span className="chapter-number">
                              Chapter {index + 1}
                            </span>
                            <h3 className="chapter-title">{chapter.title}</h3>
                            {!isLoggedIn ? (
                              <span className="chapter-locked-message">
                                Login required to access
                              </span>
                            ) : !isUnlocked ? (
                              <span className="chapter-locked-message">
                                Complete previous chapter to unlock
                              </span>
                            ) : (
                              <div className="chapter-progress-container">
                                <div
                                  className="chapter-progress-bar"
                                  style={{
                                    width: `${
                                      chapterProgress[chapter.chapter_id] || 0
                                    }%`,
                                  }}
                                ></div>
                                <span className="chapter-progress-text">
                                  {Math.round(
                                    chapterProgress[chapter.chapter_id] || 0
                                  )}
                                  % complete
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="chapter-meta">
                            <div className="duration">
                              <FaClock />{" "}
                              {formatDuration(chapter.duration || 0)}
                            </div>
                            <div className="chapter-status">
                              {isCompleted ? (
                                <FaCheckCircle className="completed-icon" />
                              ) : isUnlocked ? (
                                <FaPlay className="play-icon" />
                              ) : (
                                <FaLock className="locked-icon" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {!isLoggedIn && (
                      <div className="login-prompt">
                        <p>
                          Log in to access course content and track your
                          progress.
                        </p>
                        <button
                          className="login-btn"
                          onClick={() => navigate("/login")}
                        >
                          Log In Now
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="no-chapters">No chapters available yet.</p>
                )}

                {allChaptersCompleted && isLoggedIn && (
                  <div className="test-section" ref={testSectionRef}>
                    <h2 className="section-title">Final Assessment</h2>
                    <div className="test-info">
                      <div className="test-icon">
                        <FaClipboardCheck />
                      </div>
                      <div className="test-details">
                        <h3>Course Completion Test</h3>
                        <p>
                          Congratulations! You&apos;ve completed all chapters in
                          this course. You are now eligible to take the final
                          assessment test.
                        </p>
                        <p className="test-instructions">
                          Pass the test with at least 70% to earn your
                          certificate.
                        </p>
                      </div>
                    </div>
                    <div className="completion-actions">
                      <button
                        className="take-test-btn"
                        onClick={() => navigate(`/courses/${id}/test`)}
                      >
                        <FaClipboardCheck /> Start Final Test
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="course-sidebar">
                <div
                  className="thumbnail-container mt-4"
                  onClick={
                    isLoggedIn ? handlePlayClick : () => navigate("/login")
                  }
                >
                  <img
                    src={`${api}${course.course_image}`}
                    alt={course.title}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Course+Image";
                    }}
                  />
                  {!isLoggedIn ? (
                    <div className="locked-overlay">
                      <p>🔒 Log in to start learning</p>
                      <button
                        className="login-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/login");
                        }}
                      >
                        Log In Now
                      </button>
                    </div>
                  ) : (
                    <button className="play-button">
                      <FaPlay />
                    </button>
                  )}
                </div>

                <div className="course-features">
                  <h3>What you&apos;ll learn</h3>
                  <ul className="features-list">
                    <li>Complete understanding of {course.title}</li>
                    <li>Practical exercises and projects</li>
                    <li>Certificate of completion</li>
                    <li>Lifetime access to content</li>
                    <li>24/7 support from instructors</li>
                    <li>Access to community forums</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
