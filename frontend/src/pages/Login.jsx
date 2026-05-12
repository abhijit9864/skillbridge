// src/pages/Login.jsx

import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

import {
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

import AuthLayout from "../components/auth/AuthLayout";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {

  /* FORM DATA */
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* ERRORS */
  const [errors, setErrors] = useState({});

  /* INPUT CHANGE */
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* LOGIN */
  // const handleLogin = async (e) => {

  //   e.preventDefault();

  //   let newErrors = {};

  //   /* EMAIL */
  //   if (!formData.email.trim()) {

  //     newErrors.email =
  //       "Email is required";

  //   } else if (
  //     !/\S+@\S+\.\S+/.test(formData.email)
  //   ) {

  //     newErrors.email =
  //       "Enter valid email";
  //   }

  //   /* PASSWORD */
  //   if (!formData.password) {

  //     newErrors.password =
  //       "Password is required";
  //   }

  //   setErrors(newErrors);

  //   if (Object.keys(newErrors).length > 0) {
  //     return;
  //   }

  //   try {

  //     /* LOGIN API */
  //     const response = await axios.post(
  //       `${API_URL}/api/auth/login`,
  //       formData
  //     );

  //     const token = response.data.token;

  //     /* SAVE TOKEN */
  //     localStorage.setItem(
  //       "token",
  //       token
  //     );

  //     /* FETCH USER */
  //     const userResponse = await axios.get(
  //       `${API_URL}/api/users/me`,
  //       {
  //         headers: {
  //           Authorization:
  //             `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     /* SAVE USER */
  //     localStorage.setItem(
  //       "user",
  //       JSON.stringify(userResponse.data)
  //     );

  //     alert("Login Success");

  //     /* REDIRECT */
  //     window.location.href =
  //       "/dashboard";

  //   } catch (error) {

  //     console.log(error);

  //     if (
  //       error.response?.status === 401
  //     ) {

  //       alert(
  //         "Invalid email or password"
  //       );

  //     } else {

  //       alert("Login Failed");
  //     }
  //   }
  // };

  const handleLogin = async (e) => {

  e.preventDefault();

  let newErrors = {};

  /* EMAIL */
  if (!formData.email.trim()) {

    newErrors.email =
      "Email is required";

  } else if (
    !/\S+@\S+\.\S+/.test(formData.email)
  ) {

    newErrors.email =
      "Enter valid email";
  }

  /* PASSWORD */
  if (!formData.password) {

    newErrors.password =
      "Password is required";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return;
  }

  try {

    /* LOGIN API */
    const response = await axios.post(
      `${API_URL}/api/auth/login`,
      formData
    );

    const token = response.data.token;

    /* SAVE TOKEN */
    localStorage.setItem(
      "token",
      token
    );

    /* FETCH USER */
    const userResponse = await axios.get(
      `${API_URL}/api/users/me`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    /* SAVE USER */
    localStorage.setItem(
      "user",
      JSON.stringify(userResponse.data)
    );

    /* SUCCESS ALERT */
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome back!",
      timer: 2000,
      showConfirmButton: false,
    });

    /* REDIRECT */
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 2000);

  } catch (error) {

    console.log(error);

    if (
      error.response?.status === 401
    ) {

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password",
      });

    } else {

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong",
      });
    }
  }
};

  return (

    <AuthLayout>

      <div className="auth-form-container">

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

            {errors.email && (

              <p className="error-text">
                {errors.email}
              </p>

            )}

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

            {errors.password && (

              <p className="error-text">
                {errors.password}
              </p>

            )}

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