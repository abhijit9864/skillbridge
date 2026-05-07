import "../styles/programs.css";
import workflowImg from "../assets/w.png";
import {
  FaUserPlus,
  FaBuilding,
  FaBookOpen,
  FaChartLine,
} from "react-icons/fa";

function Programs() {
  return (
    <section className="programs" id="programs">

  {/* LEFT IMAGE */}
  <div className="programs-image-section">

    <div className="programs-image-bg"></div>

    <img
      src={workflowImg}
      alt="workflow"
      className="programs-image"
    />

  </div>

  {/* RIGHT CONTENT */}
  <div className="timeline-wrapper">

    <p className="programs-tag">
      Learning Workflow
    </p>

    <h2 className="programs-heading">
      Simple Learning Process for Organizations & Learners
    </h2>

    <p className="programs-desc">
      SkillBridge streamlines onboarding, learning delivery, collaboration, and progress tracking within one scalable LMS ecosystem.
    </p>

    {/* TIMELINE */}
    <div className="timeline">

      {/* STEP 1 */}
      <div className="timeline-item">

        <div className="timeline-icon purple">
          <FaUserPlus />
        </div>

        <div className="timeline-content">
          <h3>Create & Manage Accounts</h3>

          <p>
            Organizations, instructors, and learners can securely access personalized learning environments.
          </p>
        </div>

      </div>

      {/* STEP 2 */}
      <div className="timeline-item">

        <div className="timeline-icon pink">
          <FaBuilding />
        </div>

        <div className="timeline-content">
          <h3>Setup Organization Training</h3>

          <p>
            Configure branding, departments, courses, and employee training programs efficiently.
          </p>
        </div>

      </div>

      {/* STEP 3 */}
      <div className="timeline-item">

        <div className="timeline-icon blue">
          <FaBookOpen />
        </div>

        <div className="timeline-content">
          <h3>Deliver Learning Programs</h3>

          <p>
            Provide assessments, certifications, course materials, and collaborative learning experiences.
          </p>
        </div>

      </div>

      {/* STEP 4 */}
      <div className="timeline-item">

        <div className="timeline-icon gradient">
          <FaChartLine />
        </div>

        <div className="timeline-content">
          <h3>Track Analytics & Growth</h3>

          <p>
            Monitor engagement, completion rates, learner progress, and organizational performance.
          </p>
        </div>

      </div>

    </div>

  </div>

</section>
  );
}

export default Programs;