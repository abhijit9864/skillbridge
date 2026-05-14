import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

import DashboardLayout from "../../layout/DashboardLayout";

import {
  FaBook,
  FaLayerGroup,
  FaUpload,
  FaPlus,
} from "react-icons/fa";

import "../../styles/create-course.css";

const API_URL =
  import.meta.env.VITE_API_URL;

function CreateCourse() {

  const { courseId } =
    useParams();

  const token =
    localStorage.getItem("token");

  const isEdit = !!courseId;

  const [loading, setLoading] =
    useState(false);

  const [existingCourse,
    setExistingCourse] =
    useState(null);

  const [moduleTitle,
    setModuleTitle] =
    useState("");

  const [moduleOrder,
    setModuleOrder] =
    useState("");

  const [newContent,
    setNewContent] =
    useState({

      moduleId: "",

      title: "",

      type: "VIDEO",

      orderIndex: "",

      file: null,
    });

  const [courseForm,
    setCourseForm] =
    useState({

      courseTitle: "",

      courseDescription: "",

      moduleTitle: "",

      moduleOrder: "",

      contentTitle: "",

      contentType: "VIDEO",

      contentOrder: "",

      file: null,
    });

  /* SELECTED */

  const [selectedModule,
    setSelectedModule] =
    useState(null);

  const [selectedContent,
    setSelectedContent] =
    useState(null);

  const [moduleForm,
    setModuleForm] =
    useState({

      title: "",

      orderIndex: "",
    });

  const [contentForm,
    setContentForm] =
    useState({

      title: "",

      orderIndex: "",

      file: null,
    });

  /* FETCH */

  useEffect(() => {

    if (courseId) {
      fetchCourse();
    }

  }, [courseId]);

  const fetchCourse = async () => {

    try {

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

      const course =
        response.data;

      setExistingCourse(course);

      if (
        course.modules?.length > 0
      ) {

        const module =
          course.modules[0];

        setSelectedModule(module);

        setModuleForm({

          title:
            module.title,

          orderIndex:
            module.orderIndex,
        });

        if (
          module.contents
            ?.length > 0
        ) {

          const content =
            module.contents[0];

          setSelectedContent(
            content
          );

          setContentForm({

            title:
              content.title,

            orderIndex:
              content.orderIndex,

            file: null,
          });
        }
      }

    } catch (error) {

      console.log(error);
    }
  };

  /* CREATE COURSE */

  const handleCreateCourse =
    async (e) => {

      e.preventDefault();

      setLoading(true);

      try {

        const courseData =
          new FormData();

        courseData.append(
          "title",
          courseForm.courseTitle
        );

        courseData.append(
          "description",
          courseForm.courseDescription
        );

        const courseResponse =
          await axios.post(
            `${API_URL}/api/courses`,
            courseData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const createdCourse =
          courseResponse.data;

        const moduleResponse =
          await axios.post(
            `${API_URL}/api/courses/${createdCourse.id}/modules`,
            {
              title:
                courseForm.moduleTitle,

              orderIndex:
                Number(
                  courseForm.moduleOrder
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

        const contentData =
          new FormData();

        contentData.append(
          "title",
          courseForm.contentTitle
        );

        contentData.append(
          "type",
          courseForm.contentType
        );

        contentData.append(
          "orderIndex",
          courseForm.contentOrder
        );

        if (courseForm.file) {

          contentData.append(
            "file",
            courseForm.file
          );
        }

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
            "Course Created",
          timer: 1500,
          showConfirmButton: false,
        });

      } catch (error) {

        console.log(error);

        Swal.fire({
          icon: "error",
          title:
            error.response?.data
              ?.message ||
            "Failed",
        });
      }

      setLoading(false);
    };

  /* UPDATE MODULE */

  const handleUpdateModule =
    async () => {

      try {

        await axios.put(
          `${API_URL}/api/courses/modules/${selectedModule.id}`,
          {
            title:
              moduleForm.title,

            orderIndex:
              Number(
                moduleForm.orderIndex
              ),
          },
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
            "Module Updated",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchCourse();

      } catch (error) {

        console.log(error);

        Swal.fire({
          icon: "error",
          title:
            error.response?.data
              ?.message ||
            "Failed",
        });
      }
    };

  /* UPDATE CONTENT */

  const handleUpdateContent =
    async () => {

      try {

        const formData =
          new FormData();

        formData.append(
          "title",
          contentForm.title
        );

        formData.append(
          "orderIndex",
          contentForm.orderIndex
        );

        if (contentForm.file) {

          formData.append(
            "file",
            contentForm.file
          );
        }

        await axios.put(
          `${API_URL}/api/contents/${selectedContent.id}`,
          formData,
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
            "Content Updated",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchCourse();

      } catch (error) {

        console.log(error);

        Swal.fire({
          icon: "error",
          title:
            error.response?.data
              ?.message ||
            "Failed",
        });
      }
    };

  /* ADD MODULE */

  const handleAddModule =
    async () => {

      try {

        await axios.post(
          `${API_URL}/api/courses/${courseId}/modules`,
          {
            title:
              moduleTitle,

            orderIndex:
              Number(
                moduleOrder
              ),
          },
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
            "Module Added",
          timer: 1500,
          showConfirmButton: false,
        });

        setModuleTitle("");
        setModuleOrder("");

        fetchCourse();

      } catch (error) {

        console.log(error);
      }
    };

  /* ADD CONTENT */

  const handleAddContent =
    async () => {

      try {

        const formData =
          new FormData();

        formData.append(
          "title",
          newContent.title
        );

        formData.append(
          "type",
          newContent.type
        );

        formData.append(
          "orderIndex",
          newContent.orderIndex
        );

        if (newContent.file) {

          formData.append(
            "file",
            newContent.file
          );
        }

        await axios.post(
          `${API_URL}/api/courses/modules/${newContent.moduleId}/contents`,
          formData,
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
            "Content Added",
          timer: 1500,
          showConfirmButton: false,
        });

        setNewContent({

          moduleId: "",

          title: "",

          type: "VIDEO",

          orderIndex: "",

          file: null,
        });

        fetchCourse();

      } catch (error) {

        console.log(error);
      }
    };

  return (

    <DashboardLayout>

      <div className="create-course-page">

        <div className="create-course-card">

          <div className="page-top">

            <h1>
              {isEdit
                ? "Edit Course"
                : "Create Course"}
            </h1>

          </div>

          {/* CREATE */}

          {!isEdit && (

            <form
              className="course-form"
              onSubmit={
                handleCreateCourse
              }
            >

              <div className="course-grid">

                <div className="course-box">

                  <h2>
                    <FaBook />
                    Course Details
                  </h2>

                  <input
                    type="text"
                    placeholder="Course Title"
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        courseTitle:
                          e.target.value,
                      })
                    }
                  />

                  <textarea
                    placeholder="Course Description"
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        courseDescription:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div className="course-box">

                  <h2>
                    <FaLayerGroup />
                    First Module
                  </h2>

                  <input
                    type="text"
                    placeholder="Module Title"
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        moduleTitle:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Order Index"
                    onChange={(e) =>
                      setCourseForm({
                        ...courseForm,
                        moduleOrder:
                          e.target.value,
                      })
                    }
                  />

                </div>

                <div className="course-box full-width">

                  <h2>
                    <FaUpload />
                    First Content
                  </h2>

                  <div className="content-grid">

                    <input
                      type="text"
                      placeholder="Content Title"
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          contentTitle:
                            e.target.value,
                        })
                      }
                    />

                    <select
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
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
                      placeholder="Order Index"
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          contentOrder:
                            e.target.value,
                        })
                      }
                    />

                    <input
                      type="file"
                      onChange={(e) =>
                        setCourseForm({
                          ...courseForm,
                          file:
                            e.target.files[0],
                        })
                      }
                    />

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

              </div>

            </form>
          )}

          {/* EDIT */}

          {isEdit && (

            <div className="course-grid">

              {/* MODULES */}

              <div className="course-box">

                <h2>
                  <FaLayerGroup />
                  Modules
                </h2>

                <div className="module-list">

                  {existingCourse?.modules?.map(
                    (module) => (

                      <div
                        key={module.id}
                        className={`module-card ${
                          selectedModule?.id ===
                          module.id
                            ? "active-module"
                            : ""
                        }`}
                        onClick={() => {

                          setSelectedModule(
                            module
                          );

                          setModuleForm({

                            title:
                              module.title,

                            orderIndex:
                              module.orderIndex,
                          });

                          if (
                            module.contents
                              ?.length > 0
                          ) {

                            const first =
                              module.contents[0];

                            setSelectedContent(
                              first
                            );

                            setContentForm({

                              title:
                                first.title,

                              orderIndex:
                                first.orderIndex,

                              file: null,
                            });
                          }
                        }}
                      >

                        <h3>
                          {module.title}
                        </h3>

                        <p>
                          Order:
                          {" "}
                          {module.orderIndex}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* UPDATE MODULE */}

              {selectedModule && (

                <div className="course-box">

                  <h2>
                    <FaLayerGroup />
                    Update Module
                  </h2>

                  <input
                    type="text"
                    value={
                      moduleForm.title
                    }
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        title:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    value={
                      moduleForm.orderIndex
                    }
                    onChange={(e) =>
                      setModuleForm({
                        ...moduleForm,
                        orderIndex:
                          e.target.value,
                      })
                    }
                  />

                  <button
                    type="button"
                    className="submit-course-btn"
                    onClick={
                      handleUpdateModule
                    }
                  >

                    Update Module

                  </button>

                </div>
              )}

              {/* CONTENTS */}

              <div className="course-box full-width">

                <h2>
                  <FaUpload />
                  Contents
                </h2>

                <div className="content-list">

                  {selectedModule?.contents?.map(
                    (content) => (

                      <div
                        key={content.id}
                        className={`content-card ${
                          selectedContent?.id ===
                          content.id
                            ? "active-content"
                            : ""
                        }`}
                        onClick={() => {

                          setSelectedContent(
                            content
                          );

                          setContentForm({

                            title:
                              content.title,

                            orderIndex:
                              content.orderIndex,

                            file: null,
                          });
                        }}
                      >

                        <h3>
                          {content.title}
                        </h3>

                        <p>
                          {content.type}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* UPDATE CONTENT */}

              {selectedContent && (

                <div className="course-box">

                  <h2>
                    <FaUpload />
                    Update Content
                  </h2>

                  <input
                    type="text"
                    value={
                      contentForm.title
                    }
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        title:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    value={
                      contentForm.orderIndex
                    }
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        orderIndex:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    type="file"
                    onChange={(e) =>
                      setContentForm({
                        ...contentForm,
                        file:
                          e.target.files[0],
                      })
                    }
                  />

                  <button
                    type="button"
                    className="submit-course-btn"
                    onClick={
                      handleUpdateContent
                    }
                  >

                    Update Content

                  </button>

                </div>
              )}

              {/* ADD CONTENT */}

              <div className="course-box">

                <h2>
                  <FaPlus />
                  Add Content
                </h2>

                <select
                  value={
                    newContent.moduleId
                  }
                  onChange={(e) =>
                    setNewContent({
                      ...newContent,
                      moduleId:
                        e.target.value,
                    })
                  }
                >

                  <option value="">
                    Select Module
                  </option>

                  {existingCourse?.modules?.map(
                    (module) => (

                      <option
                        key={module.id}
                        value={module.id}
                      >

                        {module.title}

                      </option>
                    )
                  )}

                </select>

                <input
                  type="text"
                  placeholder="Content Title"
                  onChange={(e) =>
                    setNewContent({
                      ...newContent,
                      title:
                        e.target.value,
                    })
                  }
                />

                <select
                  onChange={(e) =>
                    setNewContent({
                      ...newContent,
                      type:
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
                  placeholder="Order Index"
                  onChange={(e) =>
                    setNewContent({
                      ...newContent,
                      orderIndex:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="file"
                  onChange={(e) =>
                    setNewContent({
                      ...newContent,
                      file:
                        e.target.files[0],
                    })
                  }
                />

                <button
                  type="button"
                  className="submit-course-btn"
                  onClick={
                    handleAddContent
                  }
                >

                  Add Content

                </button>

              </div>

              {/* ADD MODULE */}

              <div className="course-box">

                <h2>
                  <FaPlus />
                  Add Module
                </h2>

                <input
                  type="text"
                  placeholder="Module Title"
                  value={moduleTitle}
                  onChange={(e) =>
                    setModuleTitle(
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Order Index"
                  value={moduleOrder}
                  onChange={(e) =>
                    setModuleOrder(
                      e.target.value
                    )
                  }
                />

                <button
                  type="button"
                  className="submit-course-btn"
                  onClick={
                    handleAddModule
                  }
                >

                  Add Module

                </button>

              </div>

            </div>
          )}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default CreateCourse;