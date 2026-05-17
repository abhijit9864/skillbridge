// src/pages/dashboard/Courses.jsx

import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import Swal from "sweetalert2";

import DashboardLayout from "../../layout/DashboardLayout";

import {
  FaBookOpen,
  FaPlus,
  FaSearch,
  FaEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import "../../styles/courses.css";

const API_URL =
  import.meta.env.VITE_API_URL;

function Courses() {

  const [loading,
    setLoading] =
    useState(false);

  const [courses,
    setCourses] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [status,
    setStatus] =
    useState("");

  const [page,
    setPage] =
    useState(0);

  const [totalPages,
    setTotalPages] =
    useState(1);

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const role =
    user?.role;

  /* FETCH */

  useEffect(() => {

    fetchCourses();

  }, [page, search, status]);

  const fetchCourses =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        let url =
          `${API_URL}/api/courses?page=${page}&size=8`;

        if (search) {
          url += `&search=${search}`;
        }

        if (status) {
          url += `&status=${status}`;
        }

        const response =
          await axios.get(url, {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          });

        setCourses(
          response.data.content
        );

        setTotalPages(
          response.data.totalPages
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  /* APPROVE */

  const handleApproveCourse =
    async (courseId) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

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
          title:
            "Course Approved",
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
          localStorage.getItem(
            "token"
          );

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
          title:
            "Course Rejected",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchCourses();

      } catch (error) {

        console.log(error);
      }
    };

  /* EDIT */

  const handleEditCourse =
    (courseId) => {

      window.location.href =
        `/dashboard/create-course/${courseId}`;
    };

  return (

    <DashboardLayout>

      <div className="courses-page">

        {/* HEADER */}

        <div className="courses-header">

          <div>

            <h1>
              Courses
            </h1>

            <p>
              Explore and manage
              learning programs.
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
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

            {/* STATUS */}
                
            {(role !== "STUDENT") && (
  <select 
    className="status-filter" 
    value={status} 
    onChange={(e) => setStatus(e.target.value)} // Fixed bracket here
  > 
    <option value=""> All Status </option> 
    <option value="APPROVED"> Approved </option> 
    <option value="DRAFT"> Draft </option> 
    <option value="PENDING"> Pending </option> 
    <option value="REJECTED"> Rejected </option> 
  </select>
)}


            {/* CREATE */}

            {(
              role ==="INSTRUCTOR" ) && (

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

        {/* LOADING */}

        {loading ? (

          <div className="loading-box">

            Loading...

          </div>

        ) : (

          <>
            {/* GRID */}

            <div className="courses-grid">

              {courses.map(
                (course) => (

                  <div
                    className="course-card"
                    key={course.id}
                    onClick={() =>
                      (window.location.href =
                        `/courses/${course.id}/learn`)
                    }
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

                      <h3>
                        {course.title}
                      </h3>

                      <p>
                        {course.description}
                      </p>

                      {/* AUTHOR */}

                      <div className="course-instructor">

                        <span className="course-author">

                          {
                            course.instructor
                              ?.name
                          }

                        </span>

                        <span className="course-date">

                          {new Date(
                            course.createdAt
                          ).toLocaleDateString()}

                        </span>

                      </div>

                      {/* STUDENT */}

                      {role ===
                        "STUDENT" && (

                        <button className="course-btn">

                          Continue Learning

                        </button>
                      )}

                      {/* INSTRUCTOR */}

                      {role ===
                        "INSTRUCTOR" && (

                        <div className="course-admin-actions">

                          {/* EDIT */}

                          <button
                            className="edit-btn"
                            disabled={
                              course.status ===
                              "APPROVED"
                            }
                            onClick={(e) => {

                              e.stopPropagation();

                              handleEditCourse(
                                course.id
                              );
                            }}
                          >

                            <FaEdit />

                            Edit

                          </button>

                          {/* SUBMIT */}

                          <button
                            className="submit-btn"
                            disabled={
                              course.status ===
                                "PENDING" ||
                              course.status ===
                                "APPROVED"
                            }
                            onClick={async (
                              e
                            ) => {

                              e.stopPropagation();

                              try {

                                const token =
                                  localStorage.getItem(
                                    "token"
                                  );

                                await axios.put(
                                  `${API_URL}/api/courses/${course.id}/submit`,
                                  {},
                                  {
                                    headers:
                                      {
                                        Authorization:
                                          `Bearer ${token}`,
                                      },
                                  }
                                );

                                Swal.fire({
                                  icon:
                                    "success",
                                  title:
                                    "Course Submitted",
                                  timer: 1500,
                                  showConfirmButton:
                                    false,
                                });

                                fetchCourses();

                              } catch (
                                error
                              ) {

                                console.log(
                                  error
                                );
                              }
                            }}
                          >

                            <FaCheck />

                            {course.status ===
                            "PENDING"
                              ? "Submitted"
                              : course.status ===
                                  "APPROVED"
                                ? "Approved"
                                : "Submit"}

                          </button>

                        </div>
                      )}

                      {/* ADMIN */}

                      {(role ===
                        "ADMIN" ||
                        role ===
                          "SUPERADMIN") && (

                        <div className="course-admin-actions">

                          <button
                            className="approve-btn"
                            disabled={
                              course.status ===
                              "APPROVED"
                            }
                            onClick={(e) => {

                              e.stopPropagation();

                              handleApproveCourse(
                                course.id
                              );
                            }}
                          >

                            <FaCheck />

                            Approve

                          </button>

                          <button
                            className="reject-btn"
                            disabled={
                              course.status ===
                              "REJECTED"
                            }
                            onClick={(e) => {

                              e.stopPropagation();

                              handleRejectCourse(
                                course.id
                              );
                            }}
                          >

                            <FaTimes />

                            Reject

                          </button>

                        </div>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>

            {/* PAGINATION */}

            <div className="pagination">

              <button
                disabled={
                  page === 0
                }
                onClick={() =>
                  setPage(
                    page - 1
                  )
                }
              >

                Previous

              </button>

              <span>

                Page {page + 1} of{" "}
                {totalPages}

              </span>

              <button
                disabled={
                  page + 1 ===
                  totalPages
                }
                onClick={() =>
                  setPage(
                    page + 1
                  )
                }
              >

                Next

              </button>

            </div>
          </>
        )}

      </div>

    </DashboardLayout>
  );
}

export default Courses;