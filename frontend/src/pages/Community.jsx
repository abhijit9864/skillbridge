import "../styles/community.css";
import femaleImg from "../assets/female.png";
import maleImg from "../assets/male.png";
import { FaCommentDots } from "react-icons/fa";
import { FaGlobe, FaUserTie, FaChartLine } from "react-icons/fa";

function Community() {
  return (
    <section className="community" id="community">
      {/* LEFT CONTENT */}
      <div className="community-left">
        <p className="community-tag">Building Smarter Learning Communities</p>

        <h2 className="community-heading">
          Creating a Collaborative Learning Experience for Organizations
        </h2>

        <p className="community-desc">
          We help organizations deliver engaging, scalable, and accessible
          learning experiences through powerful course management and expert-led
          education systems.
        </p>

        {/* POINTS */}
        <div className="community-points">
          <div className="community-point">
            <FaGlobe className="point-icon purple" />

            <div>
              <h4>Learn From Anywhere</h4>
              <p>
                Enable learners and teams to access educational resources
                anytime, anywhere with complete flexibility.
              </p>
            </div>
          </div>

          <div className="community-point">
            <FaUserTie className="point-icon pink" />

            <div>
              <h4>Expert Mentorship</h4>
              <p>
                Gain guidance from experienced mentors and industry
                professionals to accelerate growth and development.
              </p>
            </div>
          </div>

          <div className="community-point">
            <FaChartLine className="point-icon blue" />

            <div>
              <h4>In-Demand Skills</h4>
              <p>
                Equip learners with practical and industry-relevant skills
                designed for modern career opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="community-buttons">
          <button className="primary-btn">Explore Courses</button>

          <button className="secondary-btn">Learn More</button>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="community-right">

  {/* Decorative Shape */}
  <div className="shape-circle"></div>

  {/* Dot Pattern */}
  <div className="dot-pattern"></div>

  {/* Main Female Image */}
  <div className="female-card">
    <img
      src={femaleImg}
      alt="female"
      className="female-image"
    />
  </div>

  {/* Overlapping Male Image */}
  <div className="male-card">
    <img
      src={maleImg}
      alt="male"
      className="male-image"
    />
  </div>

</div>
    </section>
  );
}

export default Community;
