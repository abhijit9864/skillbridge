import "../styles/hero.css";
import heroImg from "../assets/hero.png";
import bookIcon from "../assets/book icon.png";

function Hero() {
  return (
    <section className="hero">
      
      {/* 🔥 Blob */}
      <div className="hero-blob"></div>

      {/* LEFT CONTENT */}
      <div className="hero-left">

        <div className="hero-top">
          <img src={bookIcon} alt="book" className="book-icon" />
          <p className="hero-top-text">The Leader in Online Learning</p>
        </div>

        <h1 className="hero-heading">
          Engaging & Accessible{" "}
          <span className="highlight">Online Courses</span> For Every Organization
        </h1>

        <button className="hero-btn">Learn More</button>

        <p className="hero-sub">
          Trusted by multiple organizations to deliver scalable, flexible learning platforms since 2024
        </p>
      </div>

      {/* RIGHT CONTENT */}
      <div className="hero-right">
        <img src={heroImg} alt="hero" className="hero-image" />
      </div>

    </section>
  );
}

export default Hero;