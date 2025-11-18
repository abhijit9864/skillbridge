import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import "./courses.css";

const Courses = ({ searchTerm }) => {
  const [courses, setCourses] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:4748/api/courses`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
    const interval = setInterval(fetchCourses, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter courses based on search term
  const filteredCourses = searchTerm
    ? courses.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : courses;

  const displayedCourses = showAll ? filteredCourses : filteredCourses.slice(0, 4);

  return (
    <div id="courses" className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold section-title">Popular Courses</h2>
        <button className="barbtn" onClick={() => setShowAll(!showAll)}>
          {showAll ? "See Less" : "See All"}
        </button>
      </div>

      <div className="row g-4">
        {displayedCourses.length > 0 ? (
          displayedCourses.map((course, index) => (
            <div className="col-md-6 col-lg-3" key={index}>
              <div
                className="card course-card"
                onClick={() => navigate(`/course/${course.course_id}`)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`http://localhost:4748${course.course_image}`}
                  alt="Course"
                  className="card-img-top course-image"
                />
                <div className="card-body d-flex flex-column">
                  <h3 className="course-title fs-5">{course.title}</h3>
                  <p className="course-details">
                    <span>{course.chapter_count || 0} Lessons</span> | Online Classes
                  </p>
                  <button className="enroll-btn mt-auto">Enroll Now</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-courses">No courses available</p>
        )}
      </div>
    </div>
  );
};

Courses.propTypes = {
  searchTerm: PropTypes.string
};

export default Courses;
