import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Button, Card, Container, Modal, Form } from "react-bootstrap";
import "./lecturemode.css";
const api = import.meta.env.VITE_BASE_URL;

const LectureMode = () => {
  const { course_id } = useParams();
  const navigate = useNavigate();

  const [courseDetails, setCourseDetails] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editChapter, setEditChapter] = useState({ chapter_id: "", title: "", description: "" });

  const [editingChapterId, setEditingChapterId] = useState(null);

  const [isEditingCourseTitle, setIsEditingCourseTitle] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
    fetchChapters();
  }, [course_id]);

  // const renameCourse = () => {
  //   console.log("Renaming course:", newTitle);
  //   setShowRenameModal(false);
  // };

  // const updateChapter = () => {
  //   console.log("Updating chapter:", editChapter);
  //   setShowEditModal(false);
  // };

  const fetchCourseDetails = async () => {
    try {
        const response = await fetch(`${api}/api/courses/${course_id}`);
        if (!response.ok) throw new Error("Failed to fetch course details");

        const data = await response.json();

        if (data.course_id) {
            const nextCourseId = data.course_id + 1; // Fetch next course
            const nextResponse = await fetch(`${api}/api/courses/${nextCourseId}`);
            
            if (nextResponse.ok) {
                const nextCourse = await nextResponse.json();
                setCourseDetails(nextCourse); // Set next course as default
            } else {
                setCourseDetails(data); // Fallback to the original course
            }
        } else {
            setCourseDetails(data);
        }

        setNewTitle(data.title || ""); 
        setIsPublished(data.status === "published");

    } catch (error) {
        console.error("Error fetching course details:", error);
    }
};


  const fetchChapters = async () => {
    try {
      const response = await fetch(`${api}/api/courses/${course_id}/chapters`);
      if (!response.ok) throw new Error("Failed to fetch chapters");
      const data = await response.json();
  
      if (Array.isArray(data)) {
        setChapters(data);
      } else if (data && Array.isArray(data.chapters)) {
        setChapters(data.chapters);
      } else {
        console.error("Unexpected API response format:", data);
        setChapters([]); 
      }
    } catch (error) {
      console.error("Error fetching chapters:", error);
      setChapters([]);
    }
  };

  const renameCourse = async () => {
    try {
      const response = await fetch(`${api}/api/courses/${course_id}/rename`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename course");
      }

      const result = await response.json();
      console.log(result.message); // Log the success message

      // Update the course details locally
      setCourseDetails((prevDetails) => ({
        ...prevDetails,
        title: newTitle,
        description: newDescription,
      }));

      setIsEditingCourseTitle(false); // Exit edit mode
    } catch (error) {
      console.error("Error renaming course:", error);
    }
  };

  const updateChapter = async () => {
    try {
      await fetch(`${api}/api/chapters/chapters/${editChapter.chapter_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editChapter.title, description: editChapter.description }),
      });
      setShowEditModal(false);
      setEditingChapterId(null);
      fetchChapters();
    } catch (error) {
      console.error("Error updating chapter:", error);
    }
  };

  const deleteChapter = async (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    try {
      await fetch(`${api}/api/chapters/chapters/${chapterId}`, { method: "DELETE" });
      fetchChapters();
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };
 // ✅ Toggle Publish Status
 const togglePublishStatus = async () => {
  try {
    const newStatus = isPublished ? "draft" : "published";
    const response = await fetch(`${api}/api/courses/${course_id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) throw new Error("Failed to update course status");

    setIsPublished(newStatus === "published"); // Update UI
  } catch (error) {
    console.error("Error updating course status:", error);
  }
};

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Lecture Mode</h2>

      {courseDetails && (
        <Card className="p-3 g mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div className="flex-grow-1">
                {isEditingCourseTitle ? (
                  <>
                    <Form.Control
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="mb-2"
                    />
                    <Form.Control
                      as="textarea"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      rows={3}
                    />
                  </>
                ) : (
                  <>
                    <Card.Title>{courseDetails.title}</Card.Title>
                    <Card.Text>{courseDetails.description}</Card.Text>
                  </>
                )}
                <div className="d-flex justify-content-center mt-3">
                  {isEditingCourseTitle ? (
                    <>
                      <Button variant="primary" className="me-2" onClick={renameCourse}>
                        Save
                      </Button>
                      <Button variant="secondary" onClick={() => setIsEditingCourseTitle(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="warning" className="me-2" onClick={() => {
                      setIsEditingCourseTitle(true);
                      setNewDescription(courseDetails.description || "");
                    }}>
                      Rename Course
                    </Button>
                  )}
                  <Button variant={isPublished ? "danger" : "success"} onClick={togglePublishStatus}>
                    {isPublished ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </div>

              {courseDetails?.course_image && (
                <img
                  src={`${api}${courseDetails.course_image}`}
                  alt="Course Thumbnail"
                  className="img-fluid rounded shadow"
                  style={{ width: "150px", height: "auto", marginLeft: "15px" }}
                />
              )}
            </div>
          </Card.Body>
        </Card>
      )}

      <h3 className="mb-3">Chapters</h3>

      {chapters.length > 0 ? (
        <Table bordered hover responsive>
          <thead className="bg-dark text-light">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Description</th>
              <th>Video</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chapters.map((chapter, index) => (
              <tr key={chapter.chapter_id}>
                <td>{index + 1}</td>
                <td>
                  {editingChapterId === chapter.chapter_id ? (
                    <Form.Control
                      type="text"
                      value={editChapter.title}
                      onChange={(e) => setEditChapter({ ...editChapter, title: e.target.value })}
                    />
                  ) : (
                    chapter.title
                  )}
                </td>
                <td>
                  {editingChapterId === chapter.chapter_id ? (
                    <Form.Control
                      as="textarea"
                      value={editChapter.description}
                      onChange={(e) => setEditChapter({ ...editChapter, description: e.target.value })}
                    />
                  ) : (
                    <span dangerouslySetInnerHTML={{ __html: chapter.description }}></span>
                  )}
                </td>
                <td>
                  <a href={chapter.video_url} target="_blank" rel="noopener noreferrer">
                    View Video
                  </a>
                </td>
                <td className="d-flex justify-content-center align-items-center gap-3">
                  {editingChapterId === chapter.chapter_id ? (
                    <>
                      <button className="editbutton" onClick={() => updateChapter()}>
                        Save
                      </button>
                      <button className="deletebutton" onClick={() => setEditingChapterId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="editbutton"
                        onClick={() => {
                          setEditChapter({ ...chapter });
                          setEditingChapterId(chapter.chapter_id);
                        }}
                      >
                        Edit
                      </button>
                      <button className="deletebutton" onClick={() => deleteChapter(chapter.chapter_id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center text-muted">No chapters added yet.</p>
      )}

      <div className="d-flex justify-content-center mt-4 gap-3">
        <Button size="sm" className="p-2" onClick={() => navigate(`/course/add-chapter/${course_id}`)}>
          Add Chapter
        </Button>
        <Button size="sm" className="p-2" variant="info" onClick={() => navigate(`/admin/test/${course_id}`)}>
          Add Question
        </Button>
      </div>
{/* <div className="custom-modal modal-content"> */}
{showRenameModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <span className="close-btn" onClick={() => setShowRenameModal(false)}>&times;</span>
            <h4>Rename Course</h4>
            <Form.Control
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowRenameModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={renameCourse}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Chapter Modal */}
      {showEditModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <span className="close-btn" onClick={() => setShowEditModal(false)}>&times;</span>
            <h4>Edit Chapter</h4>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editChapter.title}
                onChange={(e) => setEditChapter({ ...editChapter, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={editChapter.description}
                onChange={(e) => setEditChapter({ ...editChapter, description: e.target.value })}
              />
            </Form.Group>
            <div className="modal-actions">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button variant="primary" onClick={updateChapter}>Save</Button>
            </div>
          </div>
        </div>
      )}
      {/* </div> */}
    </Container>
  );
};

export default LectureMode;
