import { useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Navbar from "../landingPage/navbar";
import HeroSection from "../landingPage/heroSection";
import "./SignupPage.css";
const api = import.meta.env.VITE_BASE_URL;

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required.";
    if (!formData.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch(`${api}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role_id: 1,
          organization_id: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowModal(false);
        Swal.fire({
          icon: "success",
          title: "Account Created Successfully!",
          text: "Welcome to S-Bridge. Your account has been created.",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/Login");
        });
      } else {
        setShowModal(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message || "An error occurred during registration.",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setShowModal(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "An error occurred during registration. Please try again.",
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="hero-section-background light-theme">
        <HeroSection />
      </div>
      {showModal && (
        <div className="signup-wrapper light-mode">
          <div className="modal-overlay modal-overlay-light" />
          <div className="signup-container modal-content-light">
            <button className="close-btn" onClick={() => navigate(-1)}>
              &times;
            </button>
            <div className="container-set">
              <h2 className="s-bridge-title mb-5">
                Sign Up with <span className="highlight">S-Bridge</span>
              </h2>
              <form onSubmit={handleSubmit}>
                {[
                  { name: "fullName", placeholder: "Full Name" },
                  { name: "email", placeholder: "Email", type: "email" },
                  { name: "password", placeholder: "Password", type: showPassword ? "text" : "password" },
                  { name: "confirmPassword", placeholder: "Confirm Password", type: "password" },
                ].map(({ name, placeholder, type = "text" }) => (
                  <div className="input-field" key={name}>
                    <input
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="form-control text-dark border-dark placeholder-grey"
                      placeholder={placeholder}
                    />
                    {name === "password" && (
                      <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>
                    )}
                    {errors[name] && <p className="error-message">{errors[name]}</p>}
                  </div>
                ))}
                <button className="btn btn-primary signin-button" type="submit">
                  Register
                </button>
              </form>
              <div>
                <p className="mt-3">
                  If you have an account then <a href="/login" className="text-primary">Login</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignupPage;
