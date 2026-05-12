import { useState } from "react";

import axios from "axios";

import Swal from "sweetalert2";

import DashboardLayout from "../../layout/DashboardLayout";

import {
  FaBook,
  FaLayerGroup,
  FaUpload,
} from "react-icons/fa";

import "../../styles/create-course.css";

const API_URL = import.meta.env.VITE_API_URL;

function CreateCourse() {

  const token =
    localStorage.getItem("token");

  const [loading, setLoading] =
    useState(false);

  const [thumbnailPreview,
    setThumbnailPreview] =
    useState(null);

  const [formData, setFormData] =
    useState({

      /* COURSE */
      courseTitle: "",
      courseDescription: "",
      thumbnail: null,

      /* MODULE */
      moduleTitle: "",
      moduleOrder: "",

      /* CONTENT */
      contentTitle: "",
      contentType: "VIDEO",
      contentOrder: "",
      file: null,
    });

  /* SUBMIT */
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      /* CREATE COURSE */

      const courseData =
        new FormData();

      courseData.append(
        "title",
        formData.courseTitle
      );

      courseData.append(
        "description",
        formData.courseDescription
      );

      courseData.append(
        "thumbnail",
        formData.thumbnail
      );

      const courseResponse =
        await axios.post(
          `${API_URL}/api/courses`,
          courseData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      const createdCourse =
        courseResponse.data;

      /* CREATE MODULE */

      const moduleResponse =
        await axios.post(
          `${API_URL}/api/courses/${createdCourse.id}/modules`,
          {
            title:
              formData.moduleTitle,

            orderIndex: Number(
              formData.moduleOrder
            ),
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const createdModule =
        moduleResponse.data;

      /* UPLOAD CONTENT */

      const contentData =
        new FormData();

      contentData.append(
        "title",
        formData.contentTitle
      );

      contentData.append(
        "type",
        formData.contentType
      );

      contentData.append(
        "orderIndex",
        formData.contentOrder
      );

      contentData.append(
        "file",
        formData.file
      );

      await axios.post(
        `${API_URL}/api/courses/modules/${createdModule.id}/contents`,
        contentData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title:
          "Course Created Successfully",
        timer: 1800,
        showConfirmButton: false,
      });

      /* RESET */

      setFormData({

        courseTitle: "",
        courseDescription: "",
        thumbnail: null,

        moduleTitle: "",
        moduleOrder: "",

        contentTitle: "",
        contentType: "VIDEO",
        contentOrder: "",
        file: null,
      });

      setThumbnailPreview(null);

    } catch (error) {

      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
      });
    }

    setLoading(false);
  };

  return (

    <DashboardLayout>

      <div className="create-course-page">

        <div className="create-course-card">

          <div className="page-top">

            <h1>Create Course</h1>

            <p>
              Build professional learning
              content for students.
            </p>

          </div>

          <form
            className="course-form"
            onSubmit={handleSubmit}
          >

            <div className="form-grid">

              {/* COURSE */}

              <div className="form-section">

                <h2>
                  <FaBook />
                  Course Details
                </h2>

                <input
                  type="text"
                  placeholder="Course Title"
                  value={
                    formData.courseTitle
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseTitle:
                        e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Course Description"
                  value={
                    formData.courseDescription
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      courseDescription:
                        e.target.value,
                    })
                  }
                />

              </div>

              {/* MODULE */}

              <div className="form-section">

                <h2>
                  <FaLayerGroup />
                  Module Details
                </h2>

                <input
                  type="text"
                  placeholder="Module Title"
                  value={
                    formData.moduleTitle
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      moduleTitle:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Module Order"
                  value={
                    formData.moduleOrder
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      moduleOrder:
                        e.target.value,
                    })
                  }
                />

              </div>

              {/* THUMBNAIL */}

              <div className="form-section">

                <h2>
                  <FaUpload />
                  Course Thumbnail
                </h2>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {

                    setFormData({
                      ...formData,
                      thumbnail:
                        e.target.files[0],
                    });

                    setThumbnailPreview(
                      URL.createObjectURL(
                        e.target.files[0]
                      )
                    );
                  }}
                />

                {thumbnailPreview && (

                  <img
                    src={thumbnailPreview}
                    alt="preview"
                    className="thumbnail-preview"
                  />
                )}

              </div>

              {/* CONTENT */}

              <div className="form-section">

                <h2>
                  <FaUpload />
                  Upload Content
                </h2>

                <div className="content-grid">

                  <input
                    type="text"
                    placeholder="Content Title"
                    value={
                      formData.contentTitle
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contentTitle:
                          e.target.value,
                      })
                    }
                  />

                  <select
                    value={
                      formData.contentType
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contentType:
                          e.target.value,
                      })
                    }
                  >

                    <option value="VIDEO">
                      VIDEO
                    </option>

                    <option value="PDF">
                      PDF
                    </option>

                  </select>

                  <input
                    type="number"
                    placeholder="Content Order"
                    value={
                      formData.contentOrder
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contentOrder:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    type="file"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        file:
                          e.target.files[0],
                      })
                    }
                  />

                </div>

              </div>

            </div>

            <button
              type="submit"
              className="submit-course-btn"
            >

              {loading
                ? "Creating..."
                : "Create Course"}

            </button>

          </form>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default CreateCourse;