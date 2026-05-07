import "../styles/footer.css";

import {
  FaGraduationCap,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer" id="footer">

      {/* TOP */}
      <div className="footer-top">

        {/* BRAND */}
        <div className="footer-brand">

          <div className="footer-logo">

            <FaGraduationCap className="footer-logo-icon" />

            <div>
              <h2>SkillBridge</h2>
              <span>LMS PLATFORM</span>
            </div>

          </div>

          <p>
            Empowering organizations, instructors, and learners through scalable
            and collaborative learning experiences.
          </p>

          {/* SOCIALS */}
          <div className="footer-socials">

            <div className="social-icon">
              <FaFacebookF />
            </div>

            <div className="social-icon">
              <FaTwitter />
            </div>

            <div className="social-icon">
              <FaLinkedinIn />
            </div>

            <div className="social-icon">
              <FaInstagram />
            </div>

          </div>

        </div>

        {/* LINKS */}
        <div className="footer-links">

          {/* COLUMN 1 */}
          <div className="footer-column">
            <h3>Platform</h3>

            <a href="#">Courses</a>
            <a href="#">Organizations</a>
            <a href="#">Analytics</a>
            <a href="#">Certifications</a>
          </div>

          {/* COLUMN 2 */}
          <div className="footer-column">
            <h3>Company</h3>

            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
            <a href="#">Blog</a>
          </div>

          {/* COLUMN 3 */}
          <div className="footer-column">
            <h3>Support</h3>

            <a href="#">Help Center</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms & Conditions</a>
            <a href="#">Documentation</a>
          </div>

        </div>

        {/* NEWSLETTER */}
        <div className="footer-newsletter">

          <h3>Subscribe Newsletter</h3>

          <p>
            Get updates about new courses, learning programs, and organization features.
          </p>

          <div className="newsletter-box">

            <input
              type="email"
              placeholder="Enter your email"
            />

            <button>
              Subscribe
            </button>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>
          © 2026 SkillBridge LMS Platform. All rights reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;