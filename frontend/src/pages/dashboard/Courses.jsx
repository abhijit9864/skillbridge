// src/pages/dashboard/Courses.jsx

import { useEffect, useState } from "react";

import axios from "axios";

import DashboardLayout from "../../layout/DashboardLayout";

import { FaBookOpen, FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

import "../../styles/courses.css";

const API_URL = import.meta.env.VITE_API_URL;

function Courses() {
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const role = user?.role;

  useEffect(() => {
    fetchCourses();
  }, []);

  /* FETCH COURSES */
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API_URL}/api/courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCourses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  /* FILTER */
  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="courses-page">
        {/* TOP */}
        <div className="courses-header">
          <div>
            <h1>Courses</h1>

            <p>Explore and manage learning programs.</p>
          </div>

          <div className="courses-actions">
            {/* SEARCH */}
            <div className="search-box">
              <FaSearch />

              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* CREATE BUTTON */}
            {(role === "ADMIN" || role === "INSTRUCTOR") && (
              <button
                className="create-course-btn"
                onClick={() =>
                  (window.location.href = "/dashboard/create-course")
                }
              >
                <FaPlus />
                Create Course
              </button>
            )}
          </div>
        </div>

        {/* COURSES GRID */}
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div className="course-card" key={course.id}>
              {/* TOP IMAGE */}
              <div className="course-image">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} />
                ) : (
                  <div className="course-placeholder">
                    <FaBookOpen />
                  </div>
                )}

                {/* STATUS */}
                <span
                  className={
                    course.status === "APPROVED"
                      ? "course-status approved"
                      : "course-status rejected"
                  }
                >
                  {course.status}
                </span>
              </div>

              {/* CONTENT */}
              <div className="course-content">
                {/* TITLE */}
                <h3>{course.title}</h3>

                {/* DESCRIPTION */}
                <p>{course.description}</p>

                {/* INSTRUCTOR */}
                <div className="course-instructor">
                  {/* PROFILE */}
                  {course.instructor?.profileImageUrl ? (
                    <img
                      src={course.instructor.profileImageUrl}
                      alt="profile"
                      className="instructor-img"
                    />
                  ) : (
                    <div className="instructor-placeholder">
                      {course.instructor?.name?.charAt(0)}
                    </div>
                  )}

                  {/* INFO */}
                  <div>
                    <h4>{course.instructor?.name}</h4>

                    <span>{course.instructor?.email}</span>
                  </div>
                </div>

                {/* DATE */}
                <div className="course-date">
                  Created: {new Date(course.createdAt).toLocaleDateString()}
                </div>

                {/* STUDENT */}
                {role === "STUDENT" && (
                  <button className="course-btn">Continue Learning</button>
                )}

                {/* ADMIN / INSTRUCTOR */}
                {(role === "ADMIN" || role === "INSTRUCTOR") && (
                  <div className="course-admin-actions">
                    <button className="edit-btn">
                      <FaEdit />
                      Edit
                    </button>

                    <button className="delete-btn">
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Courses;
