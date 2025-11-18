import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./FAQPage.css";

const FAQPage = () => {
  const faqs = [
    {
      question: "What is SkillBridge?",
      answer:
        "SkillBridge is a Learning Management System (LMS) that helps organizations and individuals manage courses, students, and instructors efficiently.",
    },
    {
      question: "How do I register on SkillBridge?",
      answer:
        "Click on the 'Sign Up' button, fill in your details, and submit the form. Your request will be reviewed by the System Administrator before approval.",
    },
    {
      question: "Can I create my own courses?",
      answer:
        "Only users with the 'Instructor' role can create and manage courses. Contact your administrator to get instructor access.",
    },
    {
      question: "How do I track my course progress?",
      answer:
        "Your progress is displayed on your Student Dashboard, showing completed chapters and overall progress percentage.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const reviews = [
    {
      name: "Abhijit Sharma",
      comment: "Great platform for learning and managing courses!",
      rating: 5,
    },
    {
      name: "Priya Verma",
      comment: "User-friendly interface and excellent support!",
      rating: 4,
    },
    {
      name: "Rahul Mehta",
      comment: "Helped me improve my skills. Highly recommended!",
      rating: 5,
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {/* FAQ Section */}
      <div className="faq-container">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
              </div>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* User Reviews Section */}
      <div className="custom-reviews-container">
  <h2 className="custom-reviews-title">What Our Users Think</h2>
  <div className="custom-reviews-list">
    {reviews.map((review, index) => (
      <div key={index} className="custom-review-card">
        <h4>{review.name}</h4>
        <p>{review.comment}</p>
        <div className="custom-stars">
          {"★".repeat(review.rating)}
          {"☆".repeat(5 - review.rating)}
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default FAQPage;
