import { useRef, useEffect } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'bootstrap/dist/css/bootstrap.min.css';
import './UserActivity.css';  // We'll create this for styling
import Navbar from '../landingPage/navbar';
import Sidebar from '../components/Sidebar';

Chart.register(...registerables, ChartDataLabels);

import { useState } from 'react';

const UserActivity = () => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  const userAnalyticsRef = useRef(null);

  useEffect(() => {
    const userAnalyticsChart = new Chart(userAnalyticsRef.current, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'User Activity',
            data: [120, 150, 180, 130, 170, 190, 200],
            backgroundColor: ['#6a67ce', '#ff6b6b', '#2196f3', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4'],
          },
        ],
      },
      options: {
        plugins: {
          tooltip: { enabled: true },
          datalabels: {
            color: '#fff',
            anchor: 'end',
            align: 'top',
          },
        },
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      userAnalyticsChart.destroy();
    };
  }, []);

  return (
    <div className="full-page">
      {/* Navbar */}
      <div className={`organization-admin ${theme ? 'dark-theme' : 'light-theme'}`}>
            <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div className='d-flex'>
      <Sidebar theme={theme} toggleTheme={toggleTheme} />
      <div className="container my-4">
        <div className="row justify-content-center">
          {/* Centered User Analytics Graph */}
          <div className="col-md-12">
            <div className="graph-container">
              <canvas ref={userAnalyticsRef}></canvas>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default UserActivity;
