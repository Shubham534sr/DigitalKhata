import React, { useEffect, useState } from "react";
import { getCustomers } from "../services/customerService";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";



import "./Report.css";


function Report() {

  
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [reportData, setReportData] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  
  loadCustomers();
}, []);

const loadCustomers = async () => {
  try {
    const res = await getCustomers();

    console.log("API Response:", res.data);

    const data = res.data.map((customer) => ({
  id: customer.id,
  date: customer.created_at?.slice(0, 10),
  customer: customer.customer_name,
  mobile: customer.mobile,
  email: customer.email,
  credit: Number(customer.opening_balance || 0),
  debit:
    Number(customer.opening_balance || 0) -
    Number(customer.current_balance || 0),
  balance: Number(customer.current_balance || 0),
  status: customer.status,
}));

    console.log("Report Data:", data);

    setReportData(data);
  } catch (err) {
    console.log(err);
  }
};
  

const filteredData = reportData.filter((item) => {

  const searchMatch =
    item.customer.toLowerCase().includes(search.toLowerCase());

  const dateMatch =
    !selectedDate || item.date === selectedDate;

  const monthMatch =
    !selectedMonth || item.date.slice(5, 7) === selectedMonth;

  const yearMatch =
    !selectedYear || item.date.slice(0, 4) === selectedYear;

  return searchMatch && dateMatch && monthMatch && yearMatch;
});

const totalCustomers = filteredData.length;

const totalCredit = filteredData.reduce(
  (sum, item) => sum + item.credit,
  0
);

const totalDebit = filteredData.reduce(
  (sum, item) => sum + item.debit,
  0
);

const totalBalance = filteredData.reduce(
  (sum, item) => sum + item.balance,
  0
);



    const profitData = [
  { month: "Jan", credit: 10000, debit: 4000, balance: 6000 },
  { month: "Feb", credit: 15000, debit: 8000, balance: 7000 },
  { month: "Mar", credit: 18000, debit: 9000, balance: 9000 },
  { month: "Apr", credit: 22000, debit: 11000, balance: 11000 },
  { month: "May", credit: 26000, debit: 13000, balance: 13000 },
  { month: "Jun", credit: 30000, debit: 15000, balance: 15000 },
  { month: "Jul", credit: 35000, debit: 18000, balance: 17000 },
  { month: "Aug", credit: 32000, debit: 16000, balance: 16000 },
  { month: "Sep", credit: 28000, debit: 14000, balance: 14000 },
  { month: "Oct", credit: 30000, debit: 15000, balance: 15000 },
  { month: "Nov", credit: 33000, debit: 17000, balance: 16000 },
  { month: "Dec", credit: 38000, debit: 19000, balance: 19000 },
  

];
return ( <div className="report-page">

  
  <div className="filter-section">
    <input
  type="date"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
/>

<select
  value={selectedMonth}
  onChange={(e) => setSelectedMonth(e.target.value)}
>
  <option value="">All Months</option>
  <option value="01">Jan</option>
  <option value="02">Feb</option>
  <option value="03">Mar</option>
  <option value="04">Apr</option>
  <option value="05">May</option>
  <option value="06">Jun</option>
  <option value="07">Jul</option>
  <option value="08">Aug</option>
  <option value="09">Sep</option>
  <option value="10">Oct</option>
  <option value="11">Nov</option>
  <option value="12">Dec</option>
</select>

<select
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
>
  <option value="">All Years</option>
  <option value="2025">2025</option>
  <option value="2026">2026</option>
</select>

<input
  type="text"
  placeholder="🔍 Search Customer..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
  
  </div>




  <div className="report-header">
    <h1 className="text-4xl font-bold">Reports Dashboard</h1>
    <div className="graph-card">

  <h2 style={{ marginBottom: "20px" }}>
    Monthly Profit Analytics
  </h2>

  <ResponsiveContainer width="100%" height={320}>
  <LineChart data={profitData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#444" />

    <XAxis dataKey="month" stroke="#fff" />

    <YAxis
      stroke="#fff"
      tickFormatter={(value) => `₹${value / 1000}k`}
    />

    <Tooltip />
    <Legend />

    <Line
      type="monotone"
      dataKey="credit"
      stroke="#22c55e"
      strokeWidth={3}
      name="Credit"
    />

    <Line
      type="monotone"
      dataKey="debit"
     stroke="#2563eb"
      strokeWidth={3}
      name="Debit"
    />

    <Line
      type="monotone"
      dataKey="balance"
      stroke="#ef4444"
      
      strokeWidth={3}
      name="Balance"
    />
  </LineChart>
</ResponsiveContainer>




</div>
    
  </div>

  
  <div className="cards-grid">

    
    <div className="card customers">
      <h4>Total Customers</h4>
      <h2>{totalCustomers}</h2>
    </div>

    <div className="card credit">
      <h4>Total Credit</h4>
      <h2>₹{totalCredit.toLocaleString()}</h2>
    </div>

    <div className="card debit">
      <h4>Total Debit</h4>
      <h2>₹{totalDebit.toLocaleString()}</h2>
    </div>

    <div className="card balance">
      <h4>Current Balance</h4>
      <h2>₹{totalBalance.toLocaleString()}</h2>
    </div>

  </div>

  
  <div className="table-container">
    
    <h2>Customer report </h2>

    <table>

      
      <thead>
  <tr>
    <th>Date</th>
    <th>Customer</th>
    <th>Mobile</th>
    <th>Email</th>
    <th>Credit</th>
    <th>Debit</th>
    <th>Balance</th>
    <th>Status</th>
              </tr>
            </thead>
              
                  <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>
              <span
                className="customer-link"
                onClick={() => navigate(`/customers/${item.id}`)}
              >
                {item.customer}
              </span>
            </td>
      <td>{item.mobile}</td>
      <td>{item.email}</td>
      <td>₹{item.credit.toLocaleString()}</td>
      <td>₹{item.debit.toLocaleString()}</td>
      <td>₹{item.balance.toLocaleString()}</td>
      <td>{item.status}</td>
    </tr>
  ))}
</tbody>
    </table>
    

  </div>

  

</div>



);
}


export default Report;
