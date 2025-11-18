import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GraphAndTable.css';

Chart.register(...registerables, ChartDataLabels);

const GraphAndTable = () => {
  const userAnalyticsRef = useRef(null);
  const orderAnalyticsRef = useRef(null);
  const salesPieRef = useRef(null);
  const newUsersPieRef = useRef(null);

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

    const orderAnalyticsChart = new Chart(orderAnalyticsRef.current, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Orders',
            data: [50, 70, 90, 120, 150],
            borderColor: '#4caf50',
            borderWidth: 3,
            fill: true,
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { tooltip: { enabled: true } },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    const salesPieChart = new Chart(salesPieRef.current, {
      type: 'pie',
      data: {
        labels: ['Products', 'Services'],
        datasets: [
          {
            data: [65, 35],
            backgroundColor: ['#03a9f4', '#ff9800'],
          },
        ],
      },
      options: {
        plugins: { tooltip: { enabled: true } },
      },
    });

    const newUsersPieChart = new Chart(newUsersPieRef.current, {
      type: 'doughnut',
      data: {
        labels: ['New Signups', 'Returning Users'],
        datasets: [
          {
            data: [40, 60],
            backgroundColor: ['#9c27b0', '#e91e63'],
          },
        ],
      },
      options: {
        plugins: { tooltip: { enabled: true } },
      },
    });

    return () => {
      userAnalyticsChart.destroy();
      orderAnalyticsChart.destroy();
      salesPieChart.destroy();
      newUsersPieChart.destroy();
    };
  }, []);

  return (
    <div className="container my-4">
  <div className="row">
    {/* Left Side - Graphs */}
    <div className="col-lg-8 col-md-12">
      {/* User Analytics Graph */}
      <div className="graph-container mb-4">
        <canvas ref={userAnalyticsRef}></canvas>
      </div>

      {/* Order Analytics Graph */}
      <div className="graph-container mb-4">
        <canvas ref={orderAnalyticsRef}></canvas>
      </div>
    </div>

    {/* Right Side - Pie Charts and Table */}
    <div className="col-lg-4 col-md-12">
      {/* Pie Charts */}
      <div className="graph-container mb-4">
        <canvas ref={salesPieRef}></canvas>
      </div>
      <div className="graph-container mb-4">
        <canvas ref={newUsersPieRef}></canvas>
      </div>

      {/* Transactions Table */}
      <div className="transaction-table table-responsive">
        <h5>Recent Transactions</h5>
        <table className="table table-hover">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Abhijit Pradhan</td>
              <td>TX12345</td>
            </tr>
            <tr>
              <td>2</td>
              <td>John Doe</td>
              <td>TX12346</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

  );
};

export default GraphAndTable;
