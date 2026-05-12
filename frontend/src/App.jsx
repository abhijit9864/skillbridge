import { BrowserRouter, Route, Routes } from "react-router-dom";

import Landingpage from "./pages/Landingpage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Courses from "./pages/dashboard/Courses";
import MainLayout from "./layout/MainLayout";
import CreateCourse from "./pages/dashboard/CreateCourse";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* GLOBAL LAYOUT */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landingpage />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<DashboardHome />} />

          <Route path="/dashboard/courses" element={<Courses />} />

          <Route path="/dashboard/create-course" element={<CreateCourse />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
