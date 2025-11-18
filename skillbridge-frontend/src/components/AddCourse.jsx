import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Import Sidebar component
import Navbar from "../landingPage/navbar";
import "./AddCourse.css";
const api = import.meta.env.VITE_BASE_URL;

const AddCourse = () => {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    image: null,
    is_published: false,
  });

  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCourseData({ ...courseData, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitCourse = async () => {
    const formData = new FormData();
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("courseImage", courseData.image);
    formData.append("is_published", courseData.is_published ? 1 : 0);

    try {
      const response = await fetch(`${api}/api/courses`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Course created successfully!");
        navigate("/course"); // Redirect to the course list page
      } else {
        alert(`Failed to create course: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("Failed to create course.");
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="d-flex">
        {/* Sidebar with fixed width */}
        <div style={{ width: "250px", minHeight: "100vh", position: "fixed" }}>
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div
          className="container main mt-5"
          style={{ marginLeft: "260px", width: "calc(100% - 260px)" }}
        >
          <h2 className="mb-4 text-center fw-bold">Create Course</h2>

          <div className="card p-4 shadow-lg">
            <div className="mb-3">
              <label className="form-label fw-semibold">Course Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="Enter course title"
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Course Description
              </label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Enter course description"
                rows="3"
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Course Thumbnail</label>
              <input
                type="file"
                name="image"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Thumbnail Preview */}
            {preview && (
              <div className="mb-3 text-center">
                <img
                  src={preview}
                  alt="Thumbnail Preview"
                  className="img-fluid rounded border"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}

            <div
              className="d-flex justify-content-center align-items-center back"
              style={{ gap: "8px" }}
            >
              <button
                className="btn btn-sm btn-outline-secondary px-3"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
              <button
                className="btn btn-sm btn-primary px-3"
                onClick={submitCourse}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCourse;
