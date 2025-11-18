import React from "react";
import "./about.css";
import aboutImage from "../assets/_0020.png"; // Your About Page Image
import { FaBook, FaUsers, FaChartBar } from "react-icons/fa"; // Icons for Features

const About = () => {
  return (
    <>

      {/* About Section */}
      <div className="about-content">
        <div className="about-text">
          <h2>About SkillBridge</h2>
          <p>
            SkillBridge is an innovative Learning Management System (LMS) designed
            to make education seamless, interactive, and accessible for all.
          </p>
          <p>
            Whether you're a student looking for top-quality courses, an instructor
            managing online classes, or an organization training employees—
            SkillBridge provides the tools to elevate learning.
          </p>
        </div>
        <img src={aboutImage} alt="About SkillBridge" className="about-image" />
      </div>

      {/* Key Features */}
      <div className="features-section">
        <h2>Why Choose SkillBridge?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaBook className="feature-icon" />
            <h3>Comprehensive Course Management</h3>
            <p>Organize, track, and enhance learning with ease.</p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Role-Based Access</h3>
            <p>Secure and structured access for different users.</p>
          </div>
          <div className="feature-card">
            <FaChartBar className="feature-icon" />
            <h3>Analytics & Progress Tracking</h3>
            <p>Gain insights into student performance.</p>
          </div>
        </div>
      </div>

      {/* Who We Serve */}
      <div className="who-we-serve">
        <h2>Who We Serve</h2>
        <div className="serve-grid">
          <div className="serve-card">
            <h3>👨‍🎓 Students</h3>
            <p>Access structured, flexible, and interactive courses.</p>
          </div>
          <div className="serve-card">
            <h3>👩‍🏫 Instructors</h3>
            <p>Create and manage engaging learning content.</p>
          </div>
          <div className="serve-card">
            <h3>🏢 Organizations</h3>
            <p>Train employees with scalable learning tools.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
 

    </>
  );
};

export default About;
