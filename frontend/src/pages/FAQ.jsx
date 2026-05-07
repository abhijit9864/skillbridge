import { useState } from "react";
import "../styles/faq.css";
import { FaPlus, FaMinus } from "react-icons/fa";

function FAQ() {
  const faqs = [
    {
      question: "Can organizations create their own learning environment?",
      answer:
        "Yes, organizations can customize branding, manage departments, create learning programs, and configure training environments for their teams.",
    },

    {
      question: "Does SkillBridge support instructor-led training?",
      answer:
        "Absolutely. Instructors can create courses, upload learning materials, manage assessments, and track learner progress through dedicated dashboards.",
    },

    {
      question: "Can learners access courses from anywhere?",
      answer:
        "Yes, SkillBridge provides a flexible cloud-based learning experience that allows learners to access training resources anytime and anywhere.",
    },

    {
      question: "Does the platform provide analytics and reporting?",
      answer:
        "Yes, organizations and instructors can monitor learner engagement, completion rates, assessments, and performance analytics in real time.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">

      {/* HEADER */}
      <div className="faq-header">

        <p className="faq-tag">
          Frequently Asked Questions
        </p>

        <h2 className="faq-heading">
          Everything You Need to Know About SkillBridge
        </h2>

        <p className="faq-desc">
          Find answers to common questions about organizations, learners, instructors, and the SkillBridge learning platform.
        </p>

      </div>

      {/* FAQ LIST */}
      <div className="faq-container">

        {faqs.map((faq, index) => (
          <div
            className={`faq-item ${
              activeIndex === index ? "active" : ""
            }`}
            key={index}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >

            {/* QUESTION */}
            <div className="faq-question">

              <h3>{faq.question}</h3>

              <span>
                {activeIndex === index ? (
                  <FaMinus />
                ) : (
                  <FaPlus />
                )}
              </span>

            </div>

            {/* ANSWER */}
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}

export default FAQ;