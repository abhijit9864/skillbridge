import "../styles/navbar.css";

import ThemeToggle from "./ThemeToggle";

// import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaSignInAlt,
  FaGraduationCap,
} from "react-icons/fa";

function Navbar() {

  // const navigate = useNavigate();

  const scrollToSection = (id) => {

    const section = document.getElementById(id);

    if (section) {

      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

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

      {/* RIGHT */}
      <div className="nav-actions">

        <ThemeToggle />

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

      </div>

    </nav>
  );
}

export default Navbar;