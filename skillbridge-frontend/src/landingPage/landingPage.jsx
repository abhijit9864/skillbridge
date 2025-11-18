import React, { useState } from "react";
import PropTypes from "prop-types";
import Navbar from "./navbar";
import Hero from "./heroSection";
import Courses from "./Courses"; // Ensure Courses is correctly imported
import About from "./About";
import Pricing from "../components/Pricing";
import FAQPage from "./FAQPage";
import Footer from "./Footer";

const LandingPage = ({ theme, toggleTheme }) => {
  const [activePage, setActivePage] = useState("home");

  const handlePageChange = (page) => {
    setActivePage(page);
  };
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <React.Fragment>
      <Navbar
        activePage={activePage}
        onPageChange={handlePageChange}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      {/* Hero Section */}
      <Hero onSearch={setSearchTerm} /> {/* Pass setSearchTerm as onSearch prop */}   
      {/* Courses Section */}
      <div id="courses" className="courses-section">
        <Courses searchTerm={searchTerm} />
      </div>
      {/*About page*/}
      <div id="about" className="about-section">
        <About />
      </div>
      {/*Pricing */}
      <div id="pricing" className="pricing-section">
        <Pricing />
      </div>
      <div id="Faq" className="faq-section">
        <FAQPage/>
      </div>

      <div id="Footer" className="footer-section">
        <Footer/>
      </div>
    </React.Fragment>
  );
};

LandingPage.propTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default LandingPage;
