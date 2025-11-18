import  { useState, useEffect } from 'react';
import { FiClock, FiUsers, FiStar, FiEdit, FiTrash2 } from 'react-icons/fi';
import { Button, Table, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import './CourseList.css';
const api = import.meta.env.VITE_BASE_URL;

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${api}/api/courses`);
      const data = await response.json();

      if (response.ok) {
        const sortedCourses = data.sort((a, b) => b.course_id - a.course_id);
        setCourses(sortedCourses);
      } else {
        setError("Failed to fetch courses: " + data.message);
      }
    } catch (error) {
      setError("Error fetching courses: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;

    try {
      const response = await fetch(`${api}/api/courses/${courseToDelete.course_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove the course from the local state
        setCourses(courses.filter(course => course.course_id !== courseToDelete.course_id));
        setShowDeleteModal(false);
        setCourseToDelete(null);
      } else {
        const data = await response.json();
        setError("Failed to delete course: " + data.message);
      }
    } catch (error) {
      setError("Error deleting course: " + error.message);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setCourseToDelete(null);
  };

  if (loading) {
    return (
      <div className="course-list-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-list-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <div className="course-header">
        <h2>Course Management</h2>
        <Button 
          onClick={() => navigate("/addcourse")} 
          className="create-course-btn"
        >
          Create New Course
        </Button>
      </div>

      <div className="table-responsive">
        <Table hover className="course-table">
          <thead>
            <tr>
              <th>Course Image</th>
              <th>Title</th>
              <th>Instructor</th>
              <th>Duration</th>
              <th>Students</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.course_id} className="course-row">
                <td className="course-image-cell">
                  <div className="table-image-container">
                    <img
                      src={`${api}${course.course_image}`}
                      alt={course.title}
                      className="table-course-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('no-image');
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className="course-title-cell">
                    <span className="course-title">{course.title}</span>
                    <span className="course-description">{course.description}</span>
                  </div>
                </td>
                <td>{course.instructor_name || 'Unknown Instructor'}</td>
                <td>
                  <div className="meta-cell">
                    <FiClock className="meta-icon" />
                    <span>{course.duration || 'N/A'}</span>
                  </div>
                </td>
                <td>
                  <div className="meta-cell">
                    <FiUsers className="meta-icon" />
                    <span>{course.enrolled_students || 0}</span>
                  </div>
                </td>
                <td>
                  <div className="meta-cell">
                    <FiStar className="meta-icon" />
                    <span>{course.rating || '0.0'}</span>
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${course.is_published ? 'published' : 'draft'}`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="action-btn edit-btn"
                      onClick={() => navigate(`/lecturemode/${course.course_id}`)}
                    >
                      <FiEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteClick(course)}
                    >
                      <FiTrash2 />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the course &quot;{courseToDelete?.title}&quot;? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete Course
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseList;
