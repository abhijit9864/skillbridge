// src/components/auth/AuthLayout.jsx

import "../../styles/auth.css";

import illustration from "../../assets/Illustration Container.png";

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">

      {/* LEFT SIDE */}
      <div className="auth-left">

        <img
          src={illustration}
          alt="illustration"
          className="auth-illustration"
        />

        <h1>
          Welcome to <span>SkillBridge LMS</span> Courses.
        </h1>

        <p>
          Platform designed to help organizations, educators, and learners manage,
          deliver, and track learning and training activities.
        </p>

      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        {children}
      </div>

    </div>
  );
}

export default AuthLayout;