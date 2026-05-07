import "../styles/pricing.css";
import {
  FaCheckCircle,
} from "react-icons/fa";

function Pricing() {

  const plans = [
    {
      title: "Starter",
      price: "$19",
      desc: "Perfect for small teams and startups beginning their learning journey.",
      features: [
        "Up to 50 learners",
        "Course management",
        "Basic analytics",
        "Email support",
      ],
      color: "purple-plan",
    },

    {
      title: "Professional",
      price: "$49",
      desc: "Ideal for growing organizations managing scalable training programs.",
      features: [
        "Unlimited learners",
        "Advanced analytics",
        "Instructor dashboards",
        "Organization branding",
      ],
      color: "pink-plan",
      popular: true,
    },

    {
      title: "Enterprise",
      price: "Custom",
      desc: "Designed for enterprises requiring advanced integrations and control.",
      features: [
        "Multi-organization support",
        "SSO integration",
        "Dedicated support",
        "Custom workflows",
      ],
      color: "blue-plan",
    },
  ];

  return (
    <section className="pricing" id="pricing">

      {/* HEADER */}
      <div className="pricing-header">

        <p className="pricing-tag">
          Pricing Plans
        </p>

        <h2 className="pricing-heading">
          Flexible Plans for Organizations of All Sizes
        </h2>

        <p className="pricing-desc">
          Choose scalable learning solutions designed for teams, instructors, and enterprise organizations.
        </p>

      </div>

      {/* CARDS */}
      <div className="pricing-grid">

        {plans.map((plan, index) => (

          <div
            className={`pricing-card ${plan.color} ${
              plan.popular ? "popular-plan" : ""
            }`}
            key={index}
          >

            {/* POPULAR BADGE */}
            {plan.popular && (
              <div className="popular-badge">
                Most Popular
              </div>
            )}

            <h3>{plan.title}</h3>

            <div className="price">
              {plan.price}
              {plan.price !== "Custom" && (
                <span>/month</span>
              )}
            </div>

            <p className="plan-desc">
              {plan.desc}
            </p>

            {/* FEATURES */}
            <div className="features">

              {plan.features.map((feature, i) => (

                <div className="feature-item" key={i}>

                  <FaCheckCircle className="feature-icon" />

                  <span>{feature}</span>

                </div>

              ))}

            </div>

            <button className="plan-btn">
              Get Started
            </button>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Pricing;