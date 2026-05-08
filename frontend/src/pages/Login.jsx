// src/pages/Login.jsx

import { useState } from "react";
import axios from "axios";
// import api from "../api";


import {
  FaEnvelope,
  FaLock,
  FaGraduationCap,
} from "react-icons/fa";

import AuthLayout from "../components/auth/AuthLayout";
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        formData
      );

      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      alert("Login Success");

    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  };

  return (
    <AuthLayout>

      <div className="auth-form-container">

        {/* LOGO */}
        {/* <div className="auth-logo">

          <FaGraduationCap className="auth-logo-icon" />

          <div>
            <h2>SkillBridge</h2>
            <span>LMS PLATFORM</span>
          </div>

        </div> */}

        <h1 className="auth-title">
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Login to continue your learning journey.
        </p>

        <form onSubmit={handleLogin}>

          {/* EMAIL */}
          <div className="input-group">

            <label>Email</label>

            <div className="input-box">

              <FaEnvelope className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div className="input-group">

            <label>Password</label>

            <div className="input-box">

              <FaLock className="input-icon" />

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
              />

            </div>

          </div>

          <button className="auth-btn">
            Login
          </button>

        </form>

      </div>

    </AuthLayout>
  );
}

export default Login;