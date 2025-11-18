//import React from "react";
import { FaClock, FaBookOpen, FaClipboardList } from "react-icons/fa";
import Navbar from "../landingPage/navbar";
import "./StudentDashboard.css";
import UserImage from "../assets/user.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const barData = [
  { name: "Sun", value: 60 },
  { name: "Mon", value: 180 },
  { name: "Tue", value: 120 },
  { name: "Wed", value: 180 },
  { name: "Thu", value: 300 },
  { name: "Fri", value: 240 },
  { name: "Sat", value: 60 },
];

const StudentDashboard = ({ theme, toggleTheme }) => {
  const completedPercentage = 40; // Can be dynamically fetched from an API or localStorage
  const hoursSpent = 10.5; // Example static value
  const coursesCompleted = 2; // Example static value
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.clear(); // Clear all items in localStorage
      navigate("/"); // Redirect to the landing page
    }
  };
  const userName = localStorage.getItem("name") || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className={`dashboard-container ${theme}`}>
      {/* Navbar */}
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className={`sidebar ${theme}`}>
          <div className="profile-section">
            <div className="user-avatar">
              {userInitial}
            </div>
            <h3>{userName}</h3>
            <p className="role">Student</p>
          </div>
          <ul className="sidebar-menu">
            <li
              className="active"
              onClick={() => navigate("/student-dashboard")}
            >
              📊 Dashboard
            </li>
            <li onClick={() => navigate("/todo")}>📋 ToDo</li>
            <li onClick={() => navigate("/courses")}>📚 Courses</li>
            <li onClick={() => navigate("/grades")}>📝 Grades</li>
            <li onClick={() => navigate("/feedback")}>💬 Feedback</li>
            <li onClick={() => navigate("/help")}>❓ Help</li>
            <li onClick={handleLogout} className="logout-btn">
              🚪 Logout
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className={`main-content ${theme}`}>
          <header className="main-header">
            <h2>Dashboard Overview</h2>
          </header>
          <div className="grid-container">
            {/* Progress Summary */}
            <div className={`card progress-summary ${theme}`}>
              <h4>Progress Summary</h4>
              <div className="summary-line">
                <div className="summary-item">
                  <FaClock />
                 {/**/} <div>
                    <strong>{hoursSpent}</strong>
                    <p>Hours Spent</p>
                  </div>
                </div>
                <div className="summary-item">
                  <FaClipboardList />
                  <div>
                    <strong>{coursesCompleted}</strong>
                    <p>Courses Completed</p>
                  </div>
                </div>
                <div className="summary-item todo-completed">
                  <FaBookOpen />
                  <div>
                    <strong>ToDo</strong>
                    <p>Completed</p>
                  </div>
                </div>
              </div>

              {/* <div className="progress-container">
                
                <div className="progress-bar-wrapper">
                  <p className="progress-title">Progress</p>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${completedPercentage}%` }}
                    ></div>
                  </div>
                  <p className="percentage-text">
                    {completedPercentage}% Completed
                  </p>
                </div>
              </div> */}
            </div>

            {/* Completed Work */}
            <div className={`card complete-work ${theme}`}>
              <h4>Completed Work</h4>
              <p>4 Subjects</p>
              <p>36 Assessments</p>
              <p>13 Quizzes</p>
            </div>

            {/* Learning Chart */}
            <div className={`card learning-chart ${theme}`}>
              <h4>Learning Overview</h4>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="value" fill="#1D4ED8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className={`card recent-activity ${theme}`}>
              <h4>Recent Activity</h4>
              <ul>
                <li>Completed 2 courses in the last 7 days</li>
                <li>Reviewed 5 quizzes this week</li>
                <li>Started a new course on Web Development</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
