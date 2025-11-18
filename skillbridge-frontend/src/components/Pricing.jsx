import { useState, useEffect } from "react";
import axios from "axios";
import "./Pricing.css"; // Add CSS for styling
const api = import.meta.env.VITE_BASE_URL;

const Pricing = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios.get(`${api}/api/pricing`)
      .then(response => setPlans(response.data))
      .catch(error => console.error("Error fetching pricing:", error));
  }, []);
  console.log("here is API", api);

  return (
    <section id="pricing" className="pricing-section">
      <h2 className="pricing-title">Choose Your Plan</h2>
      <div className="pricing-container">
        {plans.map((plan) => (
          <div key={plan.id} className={`pricing-card ${plan.title.toLowerCase()}`}>
            <h3>{plan.title}</h3>
            <p className="price">
              {plan.price === 0 ? "Free" : `$${plan.price}`} / {plan.duration}
            </p>
            <ul>
              {JSON.parse(plan.features).map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button className="pricing-btn">
              {plan.price === 0 ? "Get Started" : "Buy Now"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
