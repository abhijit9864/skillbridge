import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "axios";

import {
  FaPlayCircle,
  FaBookOpen,
  FaHome,
} from "react-icons/fa";

import "../styles/LearnCourse.css";

const API_URL =
  import.meta.env.VITE_API_URL;

const LearnCourse = () => {

  const navigate =
    useNavigate();

  const { courseId } =
    useParams();

  const videoRef =
    useRef(null);

  const [course,
    setCourse] =
    useState(null);

  const [selectedModule,
    setSelectedModule] =
    useState(null);

  const [selectedContent,
    setSelectedContent] =
    useState(null);

  const [contentDetails,
    setContentDetails] =
    useState(null);

  const [homeSelected,
    setHomeSelected] =
    useState(true);

  /* FETCH COURSE */

  useEffect(() => {

    fetchCourse();

  }, []);

  const fetchCourse =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            `${API_URL}/api/courses/${courseId}/learn`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setCourse(
          response.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  /* FETCH PROGRESS + DESCRIPTION */

  const fetchProgress =
    async (contentId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await axios.get(
            `${API_URL}/api/courses/progress/${contentId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        /* LESSON DESCRIPTION */

        setContentDetails(
          response.data.content
        );

        /* VIDEO TIME */

        const lastTime =
          response.data
            ?.lastWatchedTime;

        setTimeout(() => {

          if (
            videoRef.current &&
            lastTime
          ) {

            videoRef.current.currentTime =
              lastTime;
          }

        }, 1000);

      } catch (error) {

        console.log(error);
      }
    };

  /* SAVE PROGRESS */

  const saveProgress =
    async () => {

      try {

        if (
          !videoRef.current ||
          !selectedContent
        ) {
          return;
        }

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(
          `${API_URL}/api/courses/progress`,
          {
            contentId:
              selectedContent.id,

            lastWatchedTime:
              Math.floor(
                videoRef.current
                  .currentTime
              ),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      } catch (error) {

        console.log(error);
      }
    };

  /* AUTO SAVE */

  useEffect(() => {

    const interval =
      setInterval(() => {

        saveProgress();

      }, 10000);

    return () =>
      clearInterval(interval);

  }, [selectedContent]);

  /* CONTENT CLICK */

  const handleContentClick =
    async (
      content,
      module
    ) => {

      setHomeSelected(false);

      setSelectedModule(
        module
      );

      setSelectedContent(
        content
      );

      fetchProgress(content.id);
    };

  /* HOME CLICK */

  const handleHomeClick =
    () => {

      setHomeSelected(true);

      setSelectedModule(null);

      setSelectedContent(null);

      setContentDetails(
        null
      );
    };

  /* LOADING */

  if (!course) {

    return (

      <div className="learn-loading">

        Loading...

      </div>
    );
  }

  return (

    <div className="learn-page">

      {/* LEFT */}

      <div className="learn-left">

        {/* HEADER */}

        <div className="course-header">

          <div className="course-header-top">

            <button
              className="back-btn"
              onClick={() =>
                navigate(
                  "/dashboard/courses"
                )
              }
            >

              ← Back

            </button>

          </div>

          <h1 className="course-title">

            {course?.title}

          </h1>

        </div>

        {/* VIDEO WRAPPER */}

        <div className="video-wrapper">

          {!selectedContent ? (

            <div className="course-preview">

              <h2>

                Welcome to
                {" "}
                {course?.title}

              </h2>

              <p>

                Start your learning
                journey by selecting
                a chapter from the
                course sidebar.

              </p>

            </div>

          ) : (

            <>
              {/* TOP INFO */}

              <div className="video-top-info">

                <span className="chapter-badge">

                  {selectedModule?.title}

                </span>

                <h2 className="content-title">

                  {selectedContent?.title}

                </h2>

              </div>

              {/* VIDEO */}

              {selectedContent.type ===
              "VIDEO" ? (

                <video
                  ref={videoRef}
                  controls
                  className="video-player"
                  src={`${API_URL}/${selectedContent.contentUrl}`}
                />

              ) : (

                <iframe
                  title="PDF"
                  className="pdf-viewer"
                  src={`${API_URL}/${selectedContent.contentUrl}`}
                />

              )}
            </>
          )}

        </div>

        {/* DESCRIPTION */}

        <div className="video-description">

          <h3>

            {!selectedContent
              ? "About this Course"
              : "Lesson Description"}

          </h3>

          <p>

            {!selectedContent
              ? course?.description
              : contentDetails
                  ?.description ||
                "No lesson description available."}

          </p>

        </div>

      </div>

      {/* RIGHT */}

      <div className="learn-right">

        {/* TOP */}

        <div className="sidebar-top">

          <h2>

            <FaBookOpen />

            Course Content

          </h2>

        </div>

        {/* HOME */}

        <div
          className={`sidebar-home ${
            homeSelected
              ? "active-sidebar-home"
              : ""
          }`}
          onClick={
            handleHomeClick
          }
        >

          <FaHome />

          <span>
            Home
          </span>

        </div>

        {/* MODULES */}

        {course.modules?.map(
          (module) => (

            <div
              key={module.id}
              className={`sidebar-module ${
                selectedModule?.id ===
                  module.id &&
                !homeSelected
                  ? "active-sidebar-module"
                  : ""
              }`}
            >

              {/* MODULE HEADER */}

              <div
                className="sidebar-module-header"
                onClick={() => {

                  setHomeSelected(
                    false
                  );

                  setSelectedModule(
                    selectedModule?.id ===
                      module.id
                      ? null
                      : module
                  );
                }}
              >

                <h3>

                  {module.title}

                </h3>

              </div>

              {/* CONTENTS */}

              {selectedModule?.id ===
                module.id &&
                !homeSelected && (

                  <div className="sidebar-content-list">

                    {module.contents
                      ?.length > 0 ? (

                      <>
                        {module.contents.map(
                          (
                            content
                          ) => (

                            <div
                              key={
                                content.id
                              }
                              className={`sidebar-content-item ${
                                selectedContent?.id ===
                                content.id
                                  ? "active-content"
                                  : ""
                              }`}
                              onClick={() =>
                                handleContentClick(
                                  content,
                                  module
                                )
                              }
                            >

                              <FaPlayCircle />

                              <span>

                                {content.title}

                              </span>

                            </div>
                          )
                        )}

                      </>

                    ) : (

                      <div className="empty-content">

                        No content available

                      </div>
                    )}

                  </div>
                )}

            </div>
          )
        )}

        {/* QUIZ */}

        <button
          className="quiz-card"
          onClick={() =>
            navigate(
              `/courses/${courseId}/quiz`
            )
          }
        >

          <div className="quiz-icon">

            🎯

          </div>

          <div className="quiz-info">

            <h4>
              Final Quiz
            </h4>

            <p>
              Test your knowledge
            </p>

          </div>

          <span className="quiz-arrow">

            →

          </span>

        </button>

      </div>

    </div>
  );
};

export default LearnCourse;