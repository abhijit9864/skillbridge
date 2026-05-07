import "../styles/testimonials.css";
import {
  FaStar,
} from "react-icons/fa";

import user1 from "../assets/male.png";
import user2 from "../assets/female.png";
import user3 from "../assets/hero.png";

function Testimonials() {

  const testimonials = [
    {
      image: user1,
      name: "Rahul Sharma",
      role: "Organization Admin",
      review:
        "SkillBridge helped our organization streamline employee onboarding and internal learning programs efficiently.",
    },

    {
      image: user2,
      name: "Priya Verma",
      role: "Instructor",
      review:
        "The platform makes course management, assessments, and learner engagement incredibly simple and scalable.",
    },

    {
      image: user3,
      name: "Amit Das",
      role: "Learner",
      review:
        "I loved the structured learning experience and real-time progress tracking across all enrolled courses.",
    },
  ];

  return (
    <section className="testimonials" id="testimonials">

      {/* HEADER */}
      <div className="testimonials-header">

        <p className="testimonials-tag">
          Testimonials
        </p>

        <h2 className="testimonials-heading">
          What Organizations & Learners Say
        </h2>

        <p className="testimonials-desc">
          Trusted by organizations, instructors, and learners to deliver impactful learning experiences.
        </p>

      </div>

      {/* CARDS */}
      <div className="testimonials-grid">

        {testimonials.map((item, index) => (

          <div className="testimonial-card" key={index}>

            {/* STARS */}
            <div className="testimonial-stars">

              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />

            </div>

            {/* REVIEW */}
            <p className="testimonial-review">
              "{item.review}"
            </p>

            {/* USER */}
            <div className="testimonial-user">

              <img
                src={item.image}
                alt={item.name}
                className="testimonial-image"
              />

              <div>
                <h4>{item.name}</h4>
                <span>{item.role}</span>
              </div>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Testimonials;