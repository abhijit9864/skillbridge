
import { useEffect, useState } from "react";
// import api from "../api";
import axios from "axios";

import {
  FaUser,
  FaEnvelope,
  FaBuilding,
  FaVenusMars,
  FaLock,
} from "react-icons/fa";

import AuthLayout from "../components/auth/AuthLayout";

import maleImg from "../assets/login male.png";
import femaleImg from "../assets/login famale.png";
const API_URL = import.meta.env.VITE_API_URL;


function Register() {

  const [step, setStep] = useState(1);

  const [organizations, setOrganizations] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    organizationId: "",
    password: "",
  });
  useEffect(() => {

    fetchOrganizations();

  }, []);

  const fetchOrganizations = async () => {

    try {

      const response = await axios.get(
        `${API_URL}/api/organizations`
      );

      setOrganizations(response.data);

    } catch (error) {
      console.log("Error",error);
    }
  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {

    if (
      !formData.name ||
      !formData.email ||
      !formData.gender ||
      !formData.organizationId
    ) {
      alert("Please fill all fields");
      return;
    }

    setStep(2);
  };

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const body = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "STUDENT",
        status: "ACTIVE",
        organization: {
          id: Number(formData.organizationId),
        },
      };

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        body
      );

      console.log(response.data);

      alert("Registration Success");

      window.location.href = "/login";

    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  return (
    <AuthLayout>

      <div className="auth-form-container">

        {/* STEP 1 */}
        {step === 1 && (

          <>

            <h1 className="auth-title">
              Create Account
            </h1>

            <p className="auth-subtitle">
              Join SkillBridge learning ecosystem.
            </p>

            {/* NAME */}
            <div className="input-group">

              <label>Full Name</label>

              <div className="input-box">

                <FaUser className="input-icon" />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* EMAIL */}
            <div className="input-group">

              <label>Email</label>

              <div className="input-box">

                <FaEnvelope className="input-icon" />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* GENDER */}
            <div className="input-group">

              <label>Gender</label>

              <div className="input-box">

                <FaVenusMars className="input-icon" />

                <select
                  name="gender"
                  onChange={handleChange}
                >
                  <option value="">
                    Select Gender
                  </option>

                  <option value="MALE">
                    Male
                  </option>

                  <option value="FEMALE">
                    Female
                  </option>

                </select>

              </div>

            </div>

            {/* ORGANIZATION */}
            <div className="input-group">

              <label>Organization</label>

              <div className="input-box">

                <FaBuilding className="input-icon" />

                <select
                  name="organizationId"
                  onChange={handleChange}
                >

                  <option value="">
                    Select Organization
                  </option>

                  {organizations.map((org) => (

                    <option
                      key={org.id}
                      value={org.id}
                    >
                      {org.name}
                    </option>

                  ))}

                </select>

              </div>

            </div>

            <button
              className="auth-btn"
              onClick={handleNext}
            >
              Continue
            </button>

          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (

          <form onSubmit={handleRegister}>

            <div className="welcome-section">

              <img
                src={
                  formData.gender === "MALE"
                    ? maleImg
                    : femaleImg
                }
                alt="user"
                className="welcome-image"
              />

              <h2>
                Welcome, {formData.name}
              </h2>

              <p>
                Set your password to continue.
              </p>

            </div>

            {/* PASSWORD */}
            <div className="input-group">

              <label>Password</label>

              <div className="input-box">

                <FaLock className="input-icon" />

                <input
                  type="password"
                  name="password"
                  placeholder="Set password"
                  onChange={handleChange}
                />

              </div>

            </div>

            <button className="auth-btn">
              Create Account
            </button>

          </form>
        )}

      </div>

    </AuthLayout>
  );
}

export default Register;