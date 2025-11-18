import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ activePage, setActivePage, theme, toggleTheme }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInitial, setUserInitial] = useState("");
  const [userRole, setUserRole] = useState(""); // Fix: Correct useState destructuring
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn") === "true";
    const storedEmail = localStorage.getItem("email"); 
    const storedRole = localStorage.getItem("role");

    setIsLoggedIn(storedLoginStatus);
    if (storedRole) {
      setUserRole(storedRole);
    }

    if (storedEmail) {
      const extractedInitial = storedEmail.charAt(0).toUpperCase();
      setUserInitial(extractedInitial);
    } else {
      setUserInitial("U");
    }
  }, []);

  // Handle user click: redirect based on role
  const handleUserClick = () => {
    const storedRole = localStorage.getItem("role");

    if (storedRole === "1") {
      // Redirect to Student Dashboard for role 1 (Student)
      navigate("/StudentDashboard");
    } else if (storedRole === "2" || storedRole === "3") {
      // Redirect to Organization Admin page for roles 2 and 3 (Organization Admin or Instructor)
      navigate("/OrganizationAdmin");
    } else {
      // Default behavior (or if role is undefined)
      navigate("/StudentDashboard");
    }
  };

  // Handle courses click
  const handleCoursesClick = () => {
    if (isLoggedIn) {
      navigate("/course");
    } else {
      navigate("/courses");
    }
  };

  const handleNavCollapse = () => {
    setIsNavCollapsed(!isNavCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 py-2 fixed-top">
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to="/"
          style={{
            fontSize: "28px",
            fontFamily: "ABeeZee",
            color: "black",
            textShadow: "2px 2px 2px black",
          }}
        >
          S Bridge
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={handleNavCollapse}
          aria-expanded={!isNavCollapsed}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className={`nav-link px-3 ${activePage === "home" ? "active" : ""}`} to="/" onClick={() => setActivePage("home")}> Home </Link>
            </li>
            <li className="nav-item">
              <button className={`nav-link px-3 border-0 bg-transparent ${activePage === "courses" ? "active" : ""}`} onClick={handleCoursesClick}> Courses </button>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${activePage === "about" ? "active" : ""}`} to="/about" onClick={() => setActivePage("about")}> About </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${activePage === "pricing" ? "active" : ""}`} to="/pricing" onClick={() => setActivePage("pricing")}> Pricing </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link px-3 ${activePage === "faq" ? "active" : ""}`} to="/faq" onClick={() => setActivePage("faq")}> FAQ </Link>
            </li>

            <li className="nav-item">
              <button className="btn btn-light btn-sm mx-2">
                <FaBell className="fs-5" style={{ color: "black" }} />
              </button>
            </li>

            <li className="nav-item ms-2">
              {isLoggedIn ? (
                <div className="user-initial" onClick={handleUserClick}>{userInitial}</div>
              ) : (
                <Link className="login-btn btn-lg px-3 py-2 text-decoration-none text-white rounded" to="/login">Login</Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};


Navbar.propTypes = {
  activePage: PropTypes.string,
  setActivePage: PropTypes.func,
  theme: PropTypes.string,
  toggleTheme: PropTypes.func
};

Navbar.defaultProps = {
  activePage: 'home',
  setActivePage: () => {},
  theme: 'light',
  toggleTheme: () => {}
};

export default Navbar;
