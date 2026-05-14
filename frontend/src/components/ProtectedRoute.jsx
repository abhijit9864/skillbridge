import React from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { isTokenExpired } from "../utils/auth";

const ProtectedRoute = ({ children }) => {

  const token = localStorage.getItem("token");

  // No token found
  if (!token) {

    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Your token is not generated. Please login again.",
      confirmButtonText: "OK",
    });

    return <Navigate to="/login" replace />;
  }

  // Token expired
  if (isTokenExpired(token)) {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    Swal.fire({
      icon: "error",
      title: "Session Expired",
      text: "Your token is expired. Please login again.",
      confirmButtonText: "Login",
    });

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;