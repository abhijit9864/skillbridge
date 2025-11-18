import { useState } from "react";
import PropTypes from "prop-types";
import "./HeroSection.css";
import heroImage from "../assets/_0038.png";

const HeroSection = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm); // Pass search term to parent
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Automatically show all courses when search input is cleared
    if (value.trim() === "") {
      onSearch(""); 
    }
  };

  return (
    <section className="hero-section light-theme">
      <div className="left-side">
        <div className="eclipse-container">
          <div className="eclipse">
            <img src={heroImage} alt="Hero" className="hero-image" />
          </div>
        </div>
      </div>
      <div className="right-side">
        <h1 className="hero-title">
          Improve Your Online Learning Experience Better Instantly
        </h1>
        <p className="hero-description">
          We Have 20k+ Online Courses & 500k+ Online registered students. Find your desired Courses From them.
        </p>
        <div className="hero-search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search for courses"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button className="hero-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

HeroSection.propTypes = {
  onSearch: PropTypes.func.isRequired, // Function to update search term
};

export default HeroSection;
