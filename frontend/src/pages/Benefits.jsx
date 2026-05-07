import "../styles/benefits.css";
import { FaLaptopCode, FaInfinity, FaChalkboardTeacher } from "react-icons/fa";

function Benefits() {
  return (
    <section className="benefits" id="benefits">
      <p className="benefits-tag">Our Benefits</p>

      <h2 className="benefits-heading">
        Master the Skills to Drive Your Career
      </h2>

      <p className="benefits-desc">
        The right course, guided by expert mentors, provides practical skills
        and real-world insights to help you grow faster.
      </p>

      {/* CARDS */}
      <div className="benefits-cards">
        <div className="benefit-card card-purple">
          <div className="card-title">
            <FaLaptopCode className="card-icon" />
            <h3>Flexible Learning</h3>
          </div>
          <p>
            Learn at your own pace with structured modules designed for
            accessibility and flexibility across organizations.
          </p>
        </div>

        <div className="benefit-card card-pink">
          <div className="card-title">
            <FaInfinity className="card-icon" />
            <h3>Lifetime Access</h3>
          </div>
          <p>
            Once enrolled, you get continuous access to course materials and
            updates anytime, anywhere.
          </p>
        </div>

        <div className="benefit-card card-blue">
          <div className="card-title">
            <FaChalkboardTeacher className="card-icon" />
            <h3>Expert Instruction</h3>
          </div>
          <p>
            Learn from industry professionals with real-world experience and
            gain insights that matter.
          </p>
        </div>
      </div>

      <p className="benefits-footer">
        Trusted By 20+ Institutions Around the World
      </p>
    </section>
  );
}

export default Benefits;
