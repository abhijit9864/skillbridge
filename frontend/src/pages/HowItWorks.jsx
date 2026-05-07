import "../styles/howitworks.css";
import {
  FaUserPlus,
  FaBuilding,
  FaBookOpen,
  FaChartLine,
} from "react-icons/fa";

function HowItWorks() {
  return (
    <section className="how-it-works" id="workflow">

      {/* TOP CONTENT */}
      <div className="how-header">

        <p className="how-tag">
          How It Works
        </p>

        <h2 className="how-heading">
          Start Your Learning Journey Today!
        </h2>

        <p className="how-desc">
          Unlock growth opportunities for organizations, instructors, and learners through a centralized and scalable learning management experience.
        </p>

      </div>

      {/* STEPS */}
      <div className="how-cards">

        {/* CARD 1 */}
        <div className="how-card purple-card">

          <div className="how-icon">
            <FaUserPlus />
          </div>

          <h3>Register & Join</h3>

          <p>
            Organizations, instructors, and learners can create accounts to access training programs, learning resources, and collaboration tools.
          </p>

        </div>

        {/* CARD 2 */}
        <div className="how-card pink-card">

          <div className="how-icon">
            <FaBuilding />
          </div>

          <h3>Setup Organization Profile</h3>

          <p>
            Organizations can customize branding, manage teams, configure courses, and organize learning environments for employees or students.
          </p>

        </div>

        {/* CARD 3 */}
        <div className="how-card blue-card">

          <div className="how-icon">
            <FaBookOpen />
          </div>

          <h3>Enroll in Courses</h3>

          <p>
            Learners can explore structured learning paths, enroll in courses, access resources, and participate in interactive learning activities.
          </p>

        </div>

        {/* CARD 4 */}
        <div className="how-card gradient-card">

          <div className="how-icon">
            <FaChartLine />
          </div>

          <h3>Track Progress & Growth</h3>

          <p>
            Monitor course completion, learning performance, certifications, and engagement analytics through real-time dashboards.
          </p>

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;