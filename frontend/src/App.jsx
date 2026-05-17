import { BrowserRouter, Route, Routes } from "react-router-dom";

import Landingpage from "./pages/Landingpage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Courses from "./pages/dashboard/Courses";
import MainLayout from "./layout/MainLayout";
import CreateCourse from "./pages/dashboard/CreateCourse";
import ProtectedRoute from "./components/ProtectedRoute";
import LearnCourse from "./pages/LearnCourse";
import StudentInfo from "./pages/studentinfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GLOBAL LAYOUT */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landingpage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/create-course"
            element={
              <ProtectedRoute>
                <CreateCourse />
              </ProtectedRoute>
            }
          />

          <Route
            path="/courses/:courseId/learn"
            element={
              <ProtectedRoute>
                <LearnCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/create-course/:courseId"
            element={
              <ProtectedRoute>
                <CreateCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/students"
            element={
              <ProtectedRoute>
                <StudentInfo />
              </ProtectedRoute>
            }
            />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
