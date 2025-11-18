import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../landingPage/navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./course.css";
const api = import.meta.env.VITE_BASE_URL;

const Course = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const userName = localStorage.getItem("name") || "User";
  const userRole = localStorage.getItem("role"); // Fetch role from localStorage

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${api}/api/courses`);
        const data = await response.json();

        if (response.ok) {
          const sortedCourses = data.sort((a, b) => b.course_id - a.course_id);
          setCourses(sortedCourses);
        } else {
          console.error("Failed to fetch courses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term and publication status for students
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());

    // If the user is a student (role "1"), only show published courses
    if (userRole === "1") {
      return matchesSearch && course.is_published;
    }

    // For other roles, show all courses
    return matchesSearch;
  });

  return (
    <div className="container-fluid bg-light">
      {/* Navbar */}
      <Navbar activePage="courses" />

      {/* Greeting Section */}
      <div className="container page-container mt-5">
        <h2 className="fw-bold text-dark" style={{ fontSize: '32px', fontFamily: 'Arial, sans-serif' }}>Hello, {userName}! 👋</h2>
        {/* <p className="text-muted">Let us continue your learning journey.</p> */}
      </div>

      {/* Search Bar */}
      <div className="search-bar-container mb-4">
        <input
          type="text"
          className="form-control search-input"
          placeholder="Search for courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: '2px solid #6306b2', borderRadius: '10px', padding: '15px', fontSize: '18px', width: '100%', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
        />
      </div>

      {/* Course Grid */}
      <div className="container py-4">
        <h2 className="fw-bold mb-4 text-dark" style={{ fontSize: '32px', fontFamily: 'Arial, sans-serif' }}>Top Courses</h2>
        <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <div className="col" key={index}>
                <div
                  className="card course-card shadow border-0 h-100 position-relative"
                  style={{ borderRadius: '15px', transition: 'transform 0.3s', boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)', height: '400px' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <img
                    src={`${api}${course.course_image}`}
                    alt="Course"
                    className="card-img-top course-image"
                    style={{ borderRadius: '15px 15px 0 0', height: '250px', objectFit: 'cover' }}
                  />
                  <div className="card-body flex-column p-4" style={{ backgroundColor: '#f7f7f7' }}>
                    
                    {/* Hide "Published" or "Draft" badge if userRole === "1" (Student) */}
                    {userRole !== "1" && course.is_published !== undefined && (
                      <span 
                        className={`badge ${course.is_published ? "bg-success" : "bg-secondary"}`} 
                        style={{ position: "absolute", top: "10px", left: "10px", zIndex: 1 }}
                      >
                        {course.is_published ? "Published" : "Draft"}
                      </span>
                    )}

                    <h6 className="fw-bold text-dark text-truncate d-flex align-items-center" style={{ fontSize: '20px' }}>
                      {course.title}
                    </h6>
                    <p className="text-muted small">
                      By {course.instructor_name || "Unknown Instructor"}
                    </p>
                    <div className="d-flex align-items-center">
                      <span className="fw-bold text-warning">
                        ⭐ {course.rating || "4.5"}
                      </span>
                      <span className="text-muted small ms-2">
                        ({course.reviews || "1000+"} reviews)
                      </span>
                    </div>
                    <p className="fw-bold text-primary mt-2">
                      ${course.price || "Free"}
                    </p>
                    <button
                      className="w-100 text-white mt-auto"
                      style={{ backgroundColor: "#6306b2", borderRadius: '10px', transition: 'background-color 0.3s', padding: '15px', fontSize: '18px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5b05a0'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6306b2'}
                      onClick={async () => {
                        try {
                          const response = await fetch(
                            `${api}/api/courses/${course.course_id}/chapters`
                          );
                          const data = await response.json();
                          console.log("Fetched chapters data:", data);
                          if (
                            data.chapters &&
                            Array.isArray(data.chapters) &&
                            data.chapters.length > 0
                          ) {
                            navigate(`/course/${course.course_id}`);
                          } else {
                            navigate(`/lecturemode/${course.course_id}`);
                          }
                        } catch (error) {
                          console.error("Error fetching chapters:", error);
                          navigate(`/lecturemode/${course.course_id}`);
                        }
                      }}
                    >
                      View Course
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No courses found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Course;
