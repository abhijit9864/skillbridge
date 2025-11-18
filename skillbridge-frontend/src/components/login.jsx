import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub } from "react-icons/fa";
import PropTypes from "prop-types";
import Navbar from "../landingPage/navbar";
import "./login.css";
import Swal from "sweetalert2";
import HeroSection from "../landingPage/heroSection";
const api = import.meta.env.VITE_BASE_URL;

const Login = ({ theme, toggleTheme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
    navigate(-1); // Navigate back
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${api}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("Response Data:", data);
  
      if (response.status === 200) {
        const { token, user } = data;
  
        if (!user || !user.role_id) {
          console.error("Invalid user data:", user);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Invalid user data received!",
          });
          return;
        }
  
        // Store necessary details in localStorage
        localStorage.setItem("user_id", user.user_id);
        localStorage.setItem("token", token ?? ""); // Ensure token is not undefined
        localStorage.setItem("email", user.email ?? ""); // Ensure email is stored correctly
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", String(user.role_id)); // Convert role_id to string to avoid undefined issues
        localStorage.setItem("name", user.name ?? ""); // Save name to localStorage
  
        console.log("Stored User Role ID:", user.role_id);
        console.log("Stored User Name:", user.name);
  
        // Show success message
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          // Redirect based on role
          if (user.role_id === 1) {
            navigate("/course");
          } else if ([2, 3, 4].includes(user.role_id)) {
            navigate("/course");
          } else {
            console.error("Unrecognized role:", user.role_id);
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message || "Invalid email or password!",
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong! Please try again.",
      });
    }
  };
  
  
  return (
    <>
      <Navbar activePage="home" theme={theme} toggleTheme={toggleTheme} />
      <div className={`hero-section-background ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
        <HeroSection />
      </div>

      {showModal && (
        <div className={`login-wrapper ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
          <div className="modal-overlay" />
          <div className="modal-content login-container">
            <button className="close-btn" onClick={handleClose}>
              &times;
            </button>
            <h2 className="s-bridge-title">
              Login with <span className="highlight">S-Bridge</span>
            </h2>
            <div className="input-field">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Enter your Email"
              />
            </div>
            <div className="input-field">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Enter your Password"
              />
            </div>
            <button className="btn login-button mb-3" onClick={handleLogin}>
              Login
            </button>
            {/* <p>
              <a href="/organization-login" className="text-primary">
                Organization Login
              </a>
            </p> */}
            {/* <div className="icon-container">
              <FaGoogle className="auth-icon" />
              <FaGithub className="auth-icon" />
            </div> */}
            <p>
              Don't have an account?{" "}
              <a href="/SignupPage" className="text-primary">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

Login.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Login;
