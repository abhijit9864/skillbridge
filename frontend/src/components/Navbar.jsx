import "../styles/navbar.css";

import { useNavigate } from "react-router-dom";

import ThemeToggle from "./ThemeToggle";

import Swal from "sweetalert2";

import {
  FaUser,
  FaSignInAlt,
  FaGraduationCap,
  FaBell,
} from "react-icons/fa";

function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const token = localStorage.getItem("token");

  const role = user?.role;

  const scrollToSection = (id) => {

    const section = document.getElementById(id);

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  // LOGOUT FUNCTION
  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    Swal.fire({
      icon: "success",
      title: "Logout Successful",
      text: "You have been logged out",
      timer: 1500,
      showConfirmButton: false,
    });

    navigate("/login");
  };

  // FIRST LETTER
  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  return (
    <nav className="navbar">

      {/* LEFT */}
      <div className="logo-section">

        <FaGraduationCap className="logo-icon" />

        <div className="logo-text">

          <span className="brand">
            SkillBridge
          </span>

          <span className="sub">
            LMS
          </span>

        </div>

      </div>

      {/* CENTER */}
      {!token && (
        <ul className="nav-links">

          <li onClick={() => scrollToSection("hero")}>
            Home
          </li>

          <li onClick={() => scrollToSection("benefits")}>
            Benefits
          </li>

          <li onClick={() => scrollToSection("community")}>
            Community
          </li>

          <li onClick={() => scrollToSection("workflow")}>
            Workflow
          </li>

          <li onClick={() => scrollToSection("pricing")}>
            Pricing
          </li>

          <li onClick={() => scrollToSection("faq")}>
            FAQ
          </li>

        </ul>
      )}

      {/* RIGHT */}
      <div className="nav-actions">

        <ThemeToggle />

        {!token ? (
          <>
            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >

              <FaSignInAlt />

              Login

            </button>

            <button
              className="signup-btn"
              onClick={() => navigate("/register")}
            >

              <FaUser />

              Sign Up

            </button>
          </>
        ) : (
          <div className="user-section">

            {(role === "ADMIN" ||
              role === "SUPERADMIN" ||
              role === "INSTRUCTOR") && (

              <div
                className="notification-icon"
                onClick={() =>
                  navigate("/dashboard/notifications")
                }
              >

                <FaBell />

                <span className="notification-badge">
                  3
                </span>

              </div>
            )}

            {/* USER NAME */}
            <span className="user-name">
              {user?.name}
            </span>

            {/* USER AVATAR */}
            <div
              className="user-avatar"
              onClick={() => navigate("/dashboard")}
            >
              {firstLetter}
            </div>

          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;