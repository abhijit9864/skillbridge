import "../styles/navbar.css";
import ThemeToggle from "./ThemeToggle";
import { FaUser, FaSignInAlt, FaGraduationCap } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">
      
      {/* LEFT: Logo */}
      <div className="logo-section">
        <FaGraduationCap className="logo-icon" />
        <div className="logo-text">
          <span className="brand">SkillBridge</span>
          <span className="sub">LMS</span>
        </div>
      </div>

      {/* CENTER: Menu */}
      <ul className="nav-links">
        <li>Home</li>
        <li>Courses</li>
        <li>Contact Us</li>
      </ul>

      {/* RIGHT: Buttons */}
      <div className="nav-actions">
         <ThemeToggle />
        <button className="login-btn">
          <FaSignInAlt /> Login
        </button>
        <button className="signup-btn">
          <FaUser /> Sign Up
        </button>
      </div>

    </nav>
  );
}

export default Navbar;