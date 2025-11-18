import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css"; // Import CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container text-center">
        <p>© {new Date().getFullYear()} SkillBridge. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
