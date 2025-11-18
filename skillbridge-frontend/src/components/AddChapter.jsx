import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import RichTextEditor from "./RichTextEditor";
import Navbar from "../landingPage/navbar";
import './addChapter.css'
const api = import.meta.env.VITE_BASE_URL;

const AddChapter = () => {
  const { course_id } = useParams(); // Extract course_id from URL
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Extracted Course ID:", course_id); // Debugging course_id
  }, [course_id]);

  const [chapterData, setChapterData] = useState({
    title: "",
    description: "",
    access_setting: "public",
    video: null,
    notes: null, // Notes file state
  });

  const handleChange = (e) => {
    setChapterData({ ...chapterData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "video") {
      setChapterData({ ...chapterData, video: e.target.files[0] });
    } else if (e.target.name === "notes") {
      setChapterData({ ...chapterData, notes: e.target.files[0] });
    }
  };

  const submitChapter = async () => {
    if (!course_id) {
      alert("Error: Course ID is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("course_id", course_id);
    formData.append("title", chapterData.title);
    formData.append("description", chapterData.description);
    formData.append("access_setting", chapterData.access_setting);
    formData.append("video", chapterData.video);
    if (chapterData.notes) formData.append("notes", chapterData.notes); // Append notes if present

    try {
      const response = await fetch(`${api}/api/chapters`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Chapter added successfully!");
        navigate(`/lecturemode/${course_id}`);
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        alert("Failed to add chapter.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding chapter.");
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="d-flex">
        <Sidebar />
        <div className="container mt-5" style={{ marginLeft: "260px", flex: 1 }}>
          <div className="card shadow-lg">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2 className="mb-0 text-center fw-bold">Add Chapter</h2>
            </div>
            <div className="card-body">
              {/* Chapter Title */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Chapter Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter Chapter Title"
                  value={chapterData.title}
                  onChange={handleChange}
                />
              </div>

              {/* Chapter Description (RichTextEditor) */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Chapter Description</label>
                <RichTextEditor input={chapterData} setInput={setChapterData} />
              </div>


              {/* Access Setting */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Access Setting</label>
                <select
                  className="form-select"
                  name="access_setting"
                  value={chapterData.access_setting}
                  onChange={handleChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {/* Video Upload */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Video Upload</label>
                <input
                  type="file"
                  name="video"
                  className="form-control"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-center align-items-center">
                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={submitChapter}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddChapter;
