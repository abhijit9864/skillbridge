import { useEffect, useState } from "react";

import axios from "axios";

import DashboardLayout from "../../layout/DashboardLayout";

import {
  FaBook,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Bar,
} from "recharts";

import "../../styles/dashboard-home.css";

const API_URL = import.meta.env.VITE_API_URL;

const COLORS = ["#2563eb", "#f59e0b", "#10b981", "#ef4444"];

function DashboardHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  const token = localStorage.getItem("token");

  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      let endpoint = "";

      /* ROLE API */

      if (user.role === "STUDENT") {
        endpoint = "/api/courses/student/dashboard";
      } else if (user.role === "INSTRUCTOR") {
        endpoint = "/api/courses/instructor/dashboard";
      } else if (user.role === "ADMIN") {
        endpoint = "/api/courses/admin/dashboard";
      } else if (user.role === "SUPER_ADMIN") {
        endpoint = "/api/courses/super-admin/dashboard";
      }

      const response = await axios.get(`${API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboardData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="dashboard-loading">Loading Dashboard...</div>
      </DashboardLayout>
    );
  }

  /* PIE DATA */

  const pieData = [
    {
      name: "Approved",
      value: dashboardData.approvedCourses || 0,
    },

    {
      name: "Pending",
      value: dashboardData.pendingCourses || 0,
    },

    {
      name: "Draft",
      value: dashboardData.draftCourses || 0,
    },

    {
      name: "Rejected",
      value: dashboardData.rejectedCourses || 0,
    },
  ];

  /* BAR DATA */

  const barData = [
    {
      name: "Users",
      total: dashboardData.totalUsers || 0,
    },

    {
      name: "Students",
      total: dashboardData.totalStudents || 0,
    },

    {
      name: "Instructors",
      total: dashboardData.totalInstructors || 0,
    },

    {
      name: "Courses",
      total: dashboardData.totalCourses || 0,
    },
  ];

  return (
    <DashboardLayout>
      <div className="dashboard-home">
        {/* TOP */}

        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.name}</h1>
          </div>
        </div>

        {/* ========================= */}
        {/* STUDENT */}
        {/* ========================= */}

        {user.role === "STUDENT" && (
          <>
            <div className="stats-grid">
              <div className="stats-card">
                <FaBook />

                <div>
                  <h2>{dashboardData.activeCourses}</h2>

                  <p>Active Courses</p>
                </div>
              </div>

              <div className="stats-card">
                <FaClock />

                <div>
                  <h2>{dashboardData.totalLearningMinutes}</h2>

                  <p>Learning Minutes</p>
                </div>
              </div>

              <div className="stats-card">
                <FaCheckCircle />

                <div>
                  <h2>{dashboardData.completionRate}%</h2>

                  <p>Completion Rate</p>
                </div>
              </div>
            </div>

            {/* CONTINUE */}

            <div className="dashboard-section">
              <h2>Continue Learning</h2>

              <div className="dashboard-list">
                {dashboardData.continueLearning?.map((course) => (
                  <div
                    className="dashboard-list-card"
                    key={course.lastContentTitle}
                  >
                    <img src={`${API_URL}/${course.thumbnailUrl}`} alt="" />

                    <div className="dashboard-list-body">
                      <h3>{course.courseTitle}</h3>

                      <p>Last Content: {course.lastContentTitle}</p>
                    </div>

                    <span className="status-badge approved">
                      {course.progressPercent}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ========================= */}
        {/* INSTRUCTOR */}
        {/* ========================= */}

        {user.role === "INSTRUCTOR" && (
          <>
            <div className="stats-grid">
              <div className="stats-card">
                <FaBook />

                <div>
                  <h2>{dashboardData.totalCourses}</h2>

                  <p>Total Courses</p>
                </div>
              </div>

              <div className="stats-card">
                <FaCheckCircle />

                <div>
                  <h2>{dashboardData.approvedCourses}</h2>

                  <p>Approved</p>
                </div>
              </div>

              <div className="stats-card">
                <FaClock />

                <div>
                  <h2>{dashboardData.pendingCourses}</h2>

                  <p>Pending</p>
                </div>
              </div>

              <div className="stats-card">
                <FaTimesCircle />

                <div>
                  <h2>{dashboardData.draftCourses}</h2>

                  <p>Draft</p>
                </div>
              </div>
            </div>

            {/* CHARTS */}

            <div className="chart-grid">
              <div className="chart-card">
                <h2>Course Status</h2>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={100}>
                      {pieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h2>Analytics</h2>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar dataKey="total" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* RECENT */}

            <div className="dashboard-section">
              <h2>Recent Courses</h2>

              <div className="dashboard-list">
                {dashboardData.recentCourses?.map((course) => (
                  <div className="dashboard-list-card" key={course.id}>
                    <img
                      src={
                        course.thumbnailUrl
                          ? `${API_URL}/${course.thumbnailUrl}`
                          : "https://placehold.co/400x250"
                      }
                      alt=""
                    />

                    <div className="dashboard-list-body">
                      <h3>{course.title}</h3>

                      <p>Course ID: {course.id}</p>
                    </div>

                    <span
                      className={`status-badge ${course.status.toLowerCase()}`}
                    >
                      {course.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ========================= */}
        {/* ADMIN */}
        {/* ========================= */}

        {user.role === "ADMIN" && (
          <>
            <div className="stats-grid">
              <div className="stats-card">
                <FaUsers />

                <div>
                  <h2>{dashboardData.totalUsers}</h2>

                  <p>Total Users</p>
                </div>
              </div>

              <div className="stats-card">
                <FaUserGraduate />

                <div>
                  <h2>{dashboardData.totalStudents}</h2>

                  <p>Students</p>
                </div>
              </div>

              <div className="stats-card">
                <FaChalkboardTeacher />

                <div>
                  <h2>{dashboardData.totalInstructors}</h2>

                  <p>Instructors</p>
                </div>
              </div>

              <div className="stats-card">
                <FaClock />

                <div>
                  <h2>{dashboardData.pendingCourses}</h2>

                  <p>Pending Courses</p>
                </div>
              </div>
            </div>

            {/* CHART */}

            <div className="chart-grid">
              <div className="chart-card">
                <h2>Course Approval</h2>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={100}>
                      {pieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PENDING COURSES */}

            <div className="dashboard-section">
              <h2>Pending Courses</h2>

              <div className="course-grid">
                {dashboardData.pendingCoursesList?.map((course) => (
                  <div className="course-card" key={course.id}>
                    <img src={`${API_URL}/${course.thumbnailUrl}`} alt="" />

                    <div className="course-card-body">
                      <h3>{course.title}</h3>

                      <p>Instructor: {course.instructorName}</p>

                      <div className="admin-actions">
                        <button className="approve-btn">Approve</button>

                        <button className="reject-btn">Reject</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ========================= */}
        {/* SUPER ADMIN */}
        {/* ========================= */}

        {user.role === "SUPER_ADMIN" && (
          <>
            <div className="stats-grid">
              <div className="stats-card">
                <FaUsers />

                <div>
                  <h2>{dashboardData.totalUsers}</h2>

                  <p>Total Users</p>
                </div>
              </div>

              <div className="stats-card">
                <FaUserGraduate />

                <div>
                  <h2>{dashboardData.totalStudents}</h2>

                  <p>Students</p>
                </div>
              </div>

              <div className="stats-card">
                <FaChalkboardTeacher />

                <div>
                  <h2>{dashboardData.totalInstructors}</h2>

                  <p>Instructors</p>
                </div>
              </div>

              <div className="stats-card">
                <FaBook />

                <div>
                  <h2>{dashboardData.totalOrganizations}</h2>

                  <p>Organizations</p>
                </div>
              </div>
            </div>

            {/* CHART */}

            <div className="chart-grid">
              <div className="chart-card">
                <h2>Platform Analytics</h2>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="name" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar dataKey="total" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ORGANIZATIONS */}

            <div className="dashboard-section">
              <h2>Organizations</h2>

              <div className="dashboard-list">
                {dashboardData.organizations?.map((org) => (
                  <div className="dashboard-list-card" key={org.id}>
                    <div className="organization-icon">
                      {org.name.charAt(0)}
                    </div>

                    <div className="dashboard-list-body">
                      <h3>{org.name}</h3>

                      <p>{org.domain}</p>
                    </div>

                    <span
                      className={`status-badge ${org.subscriptionPlan.toLowerCase()}`}
                    >
                      {org.subscriptionPlan}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DashboardHome;
