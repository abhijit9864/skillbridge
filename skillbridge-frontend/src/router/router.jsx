import React from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../landingPage/landingPage';
import Login from '../components/login';
import SignupPage from '../components/SignupPage';
import Course from '../components/course';
import Courses from '../landingPage/Courses';
import OrganizationAdmin from '../components/Oraganization-admini';
import GraphAndTable from '../components/GraphAndTable';
import UserActivity from '../layout/UserActivity';
import StudentDashboard from '../layout/StudentDashboard';
import CourseDetail from '../components/CourseDetail'; 
import AllUsers from '../components/AllUsers';
import CourseList from '../components/CourseList';
import AddCourse from '../components/AddCourse';
import AddChapter from '../components/AddChapter';
import ManageTeam from '../components/ManageTeam';
import LectureMode from '../components/LectureMode'; // Import LectureMode Component
import ChapterDetail from "../components/ChapterDetail";
import About from '../landingPage/About';
import Pricing from '../components/Pricing';
import  AdminTest  from '../components/AdminTest';
import StudentTest from "../components/StudentTest";
export default function Router({ theme, toggleTheme }) {
  const userType = localStorage.getItem('userType'); // Fetch userType from localStorage

  return (
    <React.Fragment>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/SignupPage" element={<SignupPage theme={theme} toggleTheme={toggleTheme} />} />

        {/* Conditional Rendering for Login */}
        <Route
          path="/login"
          element={
            userType === 'student' ? (
              <Navigate to="/StudentDashboard" replace />
            ) : userType === 'admin' ? (
              <Navigate to="/OrganizationAdmin" replace />
            ) : (
              <Login theme={theme} toggleTheme={toggleTheme} />
            )
          }
        />

        {/* Protected Routes */}
        <Route path="/course" element={<Course theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/OrganizationAdmin" element={<OrganizationAdmin theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/Courses" element={<Courses theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/GraphAndTable" element={<GraphAndTable theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/UserActivity" element={<UserActivity theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/StudentDashboard" element={<StudentDashboard theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/course/add-chapter/:course_id" element={<AddChapter />} />
        <Route path="/courselist" element={<CourseList theme={theme} toggleTheme={toggleTheme} />} />
        <Route path='/addcourse' element={<AddCourse theme={theme} toggleTheme={toggleTheme} />} />
        <Route path='/manage-team' element={<ManageTeam theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/courses/:courseId/chapters/:chapterId" element={<ChapterDetail />} />
        <Route path='/about' element={<About theme={theme} toggleTheme={toggleTheme} />} />
        <Route path='/pricing' element={<Pricing theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/admin/test/:courseId" element={<AdminTest />} />
        <Route path="/courses/:courseId/test" element={<StudentTest />} />
        {/* Lecture Mode Route */}
        <Route path="/lecturemode/:course_id" element={<LectureMode />} />
      </Routes>
    </React.Fragment>
  );
}

Router.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};
