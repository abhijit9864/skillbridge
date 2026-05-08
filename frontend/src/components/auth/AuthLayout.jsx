// src/components/auth/AuthLayout.jsx

import "../../styles/auth.css";
import { NavLink } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";

import illustration from "../../assets/Illustration Container.png";

function AuthLayout({ children }) {

  return (
    <div className="auth-page">

      {/* AUTH CARD */}
      <div className="auth-card">

        {/* LEFT */}
        <div className="auth-left">

          <img
            src={illustration}
            alt="illustration"
            className="auth-illustration"
          />

          <h1>
            Welcome to <span>SkillBridge LMS</span>
          </h1>

          <p>
            Platform designed to help organizations,
            educators, and learners manage, deliver,
            and track learning experiences.
          </p>

        </div>

        {/* RIGHT */}
        <div className="auth-right">

          <div className="auth-header">
            <div className="auth-brand">
              {/* <FaGraduationCap className="auth-brand-icon" /> */}
              <h2>Welcome Back</h2>
              <p> Access your learning platform account</p>
            </div>

            <div className="auth-tabs">
              <NavLink
                to="/login"
                end
                className={({ isActive }) =>
                  `auth-tab ${isActive ? "active" : ""}`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `auth-tab ${isActive ? "active" : ""}`
                }
              >
                Sign Up
              </NavLink>
            </div>
          </div>

          {children}

        </div>

      </div>

    </div>
  );
}

export default AuthLayout;