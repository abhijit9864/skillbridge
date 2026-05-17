import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import axios from "axios";

import {
  FaFilePdf,
  FaPlayCircle,
  FaBookOpen,
} from "react-icons/fa";

import "../styles/LearnCourse.css";

const API_URL =
  import.meta.env.VITE_API_URL;

const LearnCourse = () => {

  const { courseId } =
    useParams();

  const videoRef =
    useRef(null);

  const [course, setCourse] =
    useState(null);

  const [selectedModule,
    setSelectedModule] =
    useState(null);

  const [selectedContent,
    setSelectedContent] =
    useState(null);

  /* FETCH COURSE */

  useEffect(() => {

    fetchCourse();

  }, []);

  const fetchCourse = async () => {

    try {

      const token =
        localStorage.getItem("token");

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

      const courseData =
        response.data;

      setCourse(courseData);

      /* DEFAULT MODULE */

      if (
        courseData.modules?.length > 0
      ) {

        const firstModule =
          courseData.modules[0];

        setSelectedModule(
          firstModule
        );

        /* NO DEFAULT VIDEO */

        setSelectedContent(null);
      }

    } catch (error) {

      console.log(error);
    }
  };

  /* FETCH PROGRESS */

  const fetchProgress =
    async (contentId) => {

      try {

        const token =
          localStorage.getItem("token");

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
          localStorage.getItem("token");

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
    async (content) => {

      setSelectedContent(
        content
      );

      fetchProgress(content.id);
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

        {/* COURSE HEADER */}

        <div className="course-header">

          <h1 className="course-title">
            {course?.title}
          </h1>

          {/* <p className="course-description">
            {course?.description}
          </p> */}

        </div>

        {/* VIDEO WRAPPER */}

        <div className="video-wrapper">

          {!selectedContent ? (

            <div className="course-preview">

              <h2>
                Welcome to {course?.title}
              </h2>

              <p>
                Select any lesson from the
                right sidebar to start
                learning.
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

              {/* VIDEO / PDF */}

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

              {/* DESCRIPTION */}

              <div className="video-description">

                <h3>
                  About this Course
                </h3>

                <p>
                  {course?.description}
                </p>

              </div>

            </>
          )}

        </div>

      </div>

      {/* RIGHT SIDEBAR */}

      <div className="learn-right">

        <div className="sidebar-top">

          <h2>

            <FaBookOpen />

            Course Content

          </h2>

        </div>

        {course.modules.map(
          (module) => (

            <div
              key={module.id}
              className={`sidebar-module ${selectedModule?.id ===
                  module.id
                  ? "active-sidebar-module"
                  : ""
                }`}
            >

              {/* MODULE HEADER */}

              <div
                className="sidebar-module-header"
                onClick={() =>
                  setSelectedModule(
                    module
                  )
                }
              >

                <h3>
                  {module.title}
                </h3>

              </div>

              {/* CONTENTS */}

              {selectedModule?.id ===
                module.id && (

                  <div className="sidebar-content-list">

                    {module.contents
                      ?.length > 0 ? (

                      <>
                        {module.contents.map(
                          (content) => (

                            <div
                              key={content.id}
                              className={`sidebar-content-item ${selectedContent?.id ===
                                  content.id
                                  ? "active-content"
                                  : ""
                                }`}
                              onClick={() =>
                                handleContentClick(
                                  content
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

                        {/* PDF */}

                        <div
                          className="extra-learning-card"
                        >

                          <FaFilePdf />

                          <span>
                            Chapter PDF Notes
                          </span>

                        </div>

                        {/* ASSESSMENT */}

                        <div
                          className="extra-learning-card assessment-card"
                        >

                          📝

                          <span>
                            Chapter Assessment
                          </span>

                        </div>
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

        <button
  className="quiz-card"
  onClick={() =>
    navigate(`/courses/${courseId}/quiz`)
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