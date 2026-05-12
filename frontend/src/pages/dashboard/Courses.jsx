// src/pages/dashboard/Courses.jsx

import { useEffect, useState } from "react";

import axios from "axios";

import Swal from "sweetalert2";

import DashboardLayout from "../../layout/DashboardLayout";

import {
  FaBookOpen,
  FaPlus,
  FaTrash,
  FaSearch,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import "../../styles/courses.css";

const API_URL = import.meta.env.VITE_API_URL;

function Courses() {

  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");

  const user =
    JSON.parse(localStorage.getItem("user"));

  const role = user?.role;

  useEffect(() => {
    fetchCourses();
  }, []);

  /* FETCH COURSES */
  const fetchCourses = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response = await axios.get(
        `${API_URL}/api/courses`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setCourses(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  /* APPROVE */
  const handleApproveCourse =
    async (courseId) => {

      try {

        const token =
          localStorage.getItem("token");

        await axios.put(
          `${API_URL}/api/courses/${courseId}/approve`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Course Approved",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchCourses();

      } catch (error) {

        console.log(error);
      }
    };

  /* REJECT */
  const handleRejectCourse =
    async (courseId) => {

      try {

        const token =
          localStorage.getItem("token");

        await axios.put(
          `${API_URL}/api/courses/${courseId}/reject`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Course Rejected",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchCourses();

      } catch (error) {

        console.log(error);
      }
    };

  /* DELETE */
  const handleDeleteCourse =
    async (courseId) => {

      const result =
        await Swal.fire({
          title: "Are you sure?",
          text:
            "This course will be deleted",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText:
            "Yes Delete",
        });

      if (!result.isConfirmed) return;

      try {

        const token =
          localStorage.getItem("token");

        await axios.delete(
          `${API_URL}/api/courses/${courseId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        Swal.fire({
          icon: "success",
          title: "Deleted",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchCourses();

      } catch (error) {

        console.log(error);
      }
    };

  /* EDIT */
  const handleEditCourse = (
    courseId
  ) => {

    window.location.href =
      `/dashboard/create-course/${courseId}`;
  };

  /* FILTER */
  const filteredCourses =
    courses.filter((course) =>
      course.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (

    <DashboardLayout>

      <div className="courses-page">

        {/* HEADER */}

        <div className="courses-header">

          <div>

            <h1>Courses</h1>

            <p>
              Explore and manage learning
              programs.
            </p>

          </div>

          <div className="courses-actions">

            {/* SEARCH */}

            <div className="search-box">

              <FaSearch />

              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {/* CREATE */}

            {(role === "ADMIN" ||
              role === "INSTRUCTOR" ||
              role === "SUPERADMIN") && (

              <button
                className="create-course-btn"
                onClick={() =>
                  (window.location.href =
                    "/dashboard/create-course")
                }
              >

                <FaPlus />

                Create Course

              </button>
            )}

          </div>

        </div>

        {/* GRID */}

        <div className="courses-grid">

          {filteredCourses.map((course) => (

            <div
              className="course-card"
              key={course.id}
            >

              {/* IMAGE */}

              <div className="course-image">

                {course.thumbnailUrl ? (

                  <img
                    src={`${API_URL}/${course.thumbnailUrl}`}
                    alt={course.title}
                  />

                ) : (

                  <div className="course-placeholder">

                    <FaBookOpen />

                  </div>
                )}

                {/* STATUS */}

                <span
                  className={`course-status ${course.status?.toLowerCase()}`}
                >

                  {course.status}

                </span>

              </div>

              {/* CONTENT */}

              <div className="course-content">

                <h3>{course.title}</h3>

                <p>
                  {course.description}
                </p>

                {/* AUTHOR */}

                <div className="course-instructor">

                  <span className="course-author">

                    {course.instructor?.name}

                  </span>

                  <span className="course-date">

                    {new Date(
                      course.createdAt
                    ).toLocaleDateString()}

                  </span>

                </div>

                {/* STUDENT */}

                {role === "STUDENT" && (

                  <button className="course-btn">

                    Continue Learning

                  </button>
                )}

                {/* INSTRUCTOR */}

                {role === "INSTRUCTOR" && (

                  <div className="course-admin-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEditCourse(
                          course.id
                        )
                      }
                    >

                      <FaEdit />

                      Edit

                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteCourse(
                          course.id
                        )
                      }
                    >

                      <FaTrash />

                      Delete

                    </button>

                  </div>
                )}

                {/* ADMIN / SUPERADMIN */}

                {(role === "ADMIN" ||
                  role === "SUPERADMIN") && (

                  <div className="course-admin-actions">

                    <button
                      className="approve-btn"
                      onClick={() =>
                        handleApproveCourse(
                          course.id
                        )
                      }
                    >

                      <FaCheck />

                      Approve

                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        handleRejectCourse(
                          course.id
                        )
                      }
                    >

                      <FaTimes />

                      Reject

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