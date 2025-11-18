import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Form, Card, Alert, Spinner } from "react-bootstrap";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import "./ManageTeam.css"; // Import CSS file
import Navbar from "../landingPage/navbar";
const api = import.meta.env.VITE_BASE_URL;

const ManageTeam = () => {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Instructors
  useEffect(() => {
    axios
      .get(`${api}/api/users/users`)
      .then((response) => {
        const filteredInstructors = response.data.filter(
          (user) => user.role === "Instructor"
        );
        setInstructors(filteredInstructors);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch instructors.");
        setLoading(false);
      });
  }, []);

  // Fetch Courses
  useEffect(() => {
    axios
      .get(`${api}/api/courses`)
      .then((response) => setCourses(response.data))
      .catch(() => setError("Failed to fetch courses."));
  }, []);

  // Assign Instructor to Course
  const assignInstructorToCourse = async (instructorId) => {
    if (!selectedCourse[instructorId]) {
      alert("Please select a course first!");
      return;
    }

    try {
      await axios.post(`${api}/api/assign`, {
        instructor_id: instructorId,
        course_id: selectedCourse[instructorId],
      });

      alert("Instructor assigned successfully!");
    } catch {
      alert("Failed to assign instructor.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="dashboard-container">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Section */}
      <div className="main-content">
        <Container className="mt-4">
          <Card className="custom-card shadow-lg">
            <Card.Body>
              <h2 className="text-center mb-4">Manage Instructors</h2>

              {loading && (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <p>Loading instructors...</p>
                </div>
              )}
              {error && <Alert variant="danger">{error}</Alert>}

              {!loading && instructors.length === 0 && (
                <Alert variant="warning" className="text-center">
                  No instructors found.
                </Alert>
              )}

              <Table className="custom-table mt-3">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Select Course</th>
                    <th>Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((instructor) => (
                    <tr key={instructor.user_id}>
                      <td>{instructor.user_id}</td>
                      <td>{instructor.name}</td>
                      <td>{instructor.email}</td>
                      <td>
                        <Form.Select
                          onChange={(e) =>
                            setSelectedCourse({
                              ...selectedCourse,
                              [instructor.user_id]: e.target.value,
                            })
                          }
                          className="custom-dropdown"
                        >
                          <option value="">Select a course</option>
                          {courses.length > 0 ? (
                            courses.map((course) => (
                              <option key={course.course_id} value={course.course_id}>
                                {course.course_title || course.title}
                              </option>
                            ))
                          ) : (
                            <option disabled>No courses available</option>
                          )}
                        </Form.Select>
                      </td>
                      <td>
                        <button
                          className="assign-btn btn-sm"
                          size="sm"
                          onClick={() => assignInstructorToCourse(instructor.user_id)}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </div>
    </>
  );
};

export default ManageTeam;
