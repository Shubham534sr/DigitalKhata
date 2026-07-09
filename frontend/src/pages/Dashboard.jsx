import { Link } from "react-router-dom";
import "./Dashboard.css";

const monthlyData = [
  { day: 1, amount: 5000 },
  { day: 2, amount: 7000 },
  { day: 3, amount: 7000 },
  { day: 4, amount: 9000 },
  { day: 5, amount: 12000 },
  { day: 10, amount: 18000 },
  { day: 15, amount: 10000 },
  { day: 20, amount: 25000 },
  { day: 25, amount: 15000 },
  { day: 30, amount: 30000 },
];

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-title">
        <div>
          <span>Overview</span>
          <h1>Dashboard</h1>
          <p>Track customers, credit, payments, and pending balances.</p>
        </div>
      </div>

      <div className="cards">
        <div className="card">
          <span>125</span>
          <h3>Total Customers</h3>
          <h1>125</h1>
        </div>

        <div className="card">
          <span>₹</span>
          <h3>Total Credit</h3>
          <h1>₹2,45,000</h1>
        </div>

        <div className="card">
          <span>₹</span>
          <h3>Total Payment</h3>
          <h1>₹1,75,000</h1>
        </div>

        <div className="card">
          <span>₹</span>
          <h3>Pending Balance</h3>
          <h1>₹70,000</h1>
        </div>
      </div>

      <div className="middle-section">
        <div className="table-section">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <button type="button">View All</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Amit Sharma</td>
                <td>Credit</td>
                <td className="green">₹5,000</td>
                <td>13 May</td>
              </tr>

              <tr>
                <td>Ramesh Gupta</td>
                <td>Payment</td>
                <td className="red">₹3,000</td>
                <td>12 May</td>
              </tr>

              <tr>
                <td>Suresh Yadav</td>
                <td>Credit</td>
                <td className="green">₹2,500</td>
                <td>11 May</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pending-customers">
          <h2>Top Pending Customers</h2>

          <div className="pending-item">
            <span>Amit Sharma</span>
            <b>₹18,000</b>
          </div>

          <div className="pending-item">
            <span>Ramesh Gupta</span>
            <b>₹15,000</b>
          </div>

          <div className="pending-item">
            <span>Suresh Yadav</span>
            <b>₹10,000</b>
          </div>

          <div className="pending-item">
            <span>Vikas Kumar</span>
            <b>₹8,000</b>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>

          <Link to="/add-customer" className="action-btn">
            Add Customer
          </Link>

          <Link to="/credit" className="action-btn">
            Add Credit
          </Link>

          <Link to="/payment" className="action-btn">
            Add Payment
          </Link>

          <Link to="/transactions" className="action-btn">
            History
          </Link>
        </div>
      </div>

      <div className="bottom-section">
        <div className="dashboard-summary-card">
          <div className="summary-header">
            <h2>Monthly Summary</h2>

            <select className="month-select">
              <option>June 2026</option>
              <option>May 2026</option>
              <option>April 2026</option>
            </select>
          </div>

          <div className="monthly-chart">
            {monthlyData.map((item) => (
              <div key={item.day} className="chart-item">
                <div
                  className="chart-bar"
                  style={{
                    height: `${item.amount / 150}px`,
                  }}
                />

                <span>{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-summary-card">
          <h2>Outstanding Overview</h2>

          <div className="outstanding-list">
            <div className="outstanding-item">
              <span className="dot red-dot" />
              <p>0 - 30 Days</p>
              <b>₹20,000</b>
            </div>

            <div className="outstanding-item">
              <span className="dot orange-dot" />
              <p>31 - 60 Days</p>
              <b>₹18,000</b>
            </div>

            <div className="outstanding-item">
              <span className="dot yellow-dot" />
              <p>61 - 90 Days</p>
              <b>₹15,000</b>
            </div>

            <div className="outstanding-item">
              <span className="dot green-dot" />
              <p>90+ Days</p>
              <b>₹17,000</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
