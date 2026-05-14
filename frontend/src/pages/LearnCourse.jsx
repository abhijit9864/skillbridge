import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/LearnCourse.css";
const API_URL = import.meta.env.VITE_API_URL;

const LearnCourse = () => {

  const { courseId } = useParams();

  const [course, setCourse] = useState(null);

  const [selectedContent, setSelectedContent] =
    useState(null);

  useEffect(() => {

    fetchCourse();

  }, []);

  const fetchCourse = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/courses/${courseId}/learn`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCourse(response.data);

      // default first video
      if (
        response.data.modules.length > 0 &&
        response.data.modules[0].contents.length > 0
      ) {

        setSelectedContent(
          response.data.modules[0].contents[0]
        );
      }

    } catch (error) {

      console.log(error);
    }
  };

  if (!course) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="learn-page">

      {/* LEFT VIDEO SECTION */}
      <div className="video-section">

        <h1>{course.title}</h1>

        <p>{course.description}</p>

        {selectedContent && (
          <div className="video-player">

            <video
              controls
              width="100%"
              height="500"
              src={`${API_URL}/${selectedContent.contentUrl}`}
            />

            <h2>{selectedContent.title}</h2>

          </div>
        )}

      </div>

      {/* RIGHT MODULE SECTION */}
      <div className="module-section">

        <h2>Course Content</h2>

        {course.modules.map((module) => (

          <div
            key={module.id}
            className="module-card"
          >

            <h3>{module.title}</h3>

            {module.contents.map((content) => (

              <div
                key={content.id}
                className={`content-item ${
                  selectedContent?.id === content.id
                    ? "active-content"
                    : ""
                }`}
                onClick={() =>
                  setSelectedContent(content)
                }
              >

                ▶ {content.title}

              </div>

            ))}

          </div>

        ))}

      </div>

    </div>
  );
};

export default LearnCourse;