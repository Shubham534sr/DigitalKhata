import React, { useState } from "react";
import "./Order.css";

const initialOrders = [
  {
    id: 1,
    customer: "Amit Sharma",
    phone: "9876543210",
    address: "Wagholi, Pune",
    time: "10:30 AM",
    total: 1850,
    payment: "Cash",
    status: "Pending",
    products: [
      { name: "Rice 5kg", qty: 2 },
      { name: "Sugar 1kg", qty: 1 },
      { name: "Oil 1L", qty: 3 },
    ],
  },
  {
    id: 2,
    customer: "Ramesh Gupta",
    phone: "9988776655",
    address: "Kharadi, Pune",
    time: "11:15 AM",
    total: 950,
    payment: "UPI",
    status: "Accepted",
    products: [
      { name: "Milk", qty: 2 },
      { name: "Bread", qty: 4 },
      { name: "Butter", qty: 1 },
    ],
  },
  {
    id: 3,
    customer: "Suresh Patil",
    phone: "9012345678",
    address: "Viman Nagar",
    time: "12:05 PM",
    total: 1420,
    payment: "Online",
    status: "Ready",
    products: [
      { name: "Cold Drink", qty: 6 },
      { name: "Biscuits", qty: 5 },
      { name: "Chips", qty: 8 },
    ],
  },
];

function Orders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");

  const updateStatus = (id, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const filteredOrders = orders.filter((order) =>
    order.customer.toLowerCase().includes(search.toLowerCase())
  );

  const pendingOrders = filteredOrders.filter(
    (order) => order.status === "Pending"
  );

  const acceptedOrders = filteredOrders.filter(
    (order) => order.status === "Accepted"
  );

  const readyOrders = filteredOrders.filter(
    (order) => order.status === "Ready"
  );

  const deliveredOrders = filteredOrders.filter(
    (order) => order.status === "Delivered"
  );

  const totalOrders = orders.length;
  const pending = pendingOrders.length;
  const accepted = acceptedOrders.length;
  const ready = readyOrders.length;
  const delivered = deliveredOrders.length;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="orders-page">

      <div className="orders-header">
        <div>
          <span>Today's Orders</span>
          <h1>Orders Dashboard</h1>
          <p>Manage customer order requests and parcel status.</p>
        </div>

        <input
          type="text"
          placeholder="🔍 Search Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="order-summary">

        

        <div className="summary-card">
          <h4>Pending</h4>
          <h2>{pending}</h2>
        </div>

        <div className="summary-card">
          <h4>Accepted</h4>
          <h2>{accepted}</h2>
        </div>

        <div className="summary-card">
          <h4>Ready</h4>
          <h2>{ready}</h2>
        </div>

        <div className="summary-card">
          <h4>Delivered</h4>
          <h2>{delivered}</h2>
        </div>

      </div>

      {/* Pending Orders */}
      
<div className="section-card pending-card">
    <div className="section-header">
        <h2 className="section-title">
            🟠 Pending Orders ({pending})
        </h2>
    </div>
<div className="order-row">
    {pendingOrders.map((order) => (
  <div className="mini-order-card" key={order.id}>

    <div className="mini-top">
      <div>
        <h2>{order.customer}</h2>
        <p>📞 {order.phone}</p>
        <p>📍 {order.address}</p>
        <p>🕒 {order.time}</p>
      </div>

      <span className={`status ${order.status.toLowerCase()}`}>
        {order.status}
      </span>
    </div>

    <p>🛒 {order.products.length} Items</p>

        <div className="price-box">
          <strong>₹{order.total}</strong>
          <span>{order.payment}</span>
        </div>

    

    <div className="order-actions">
      <button
        className="accept-btn"
        onClick={() => updateStatus(order.id, "Accepted")}
      >
        Accept
      </button>

      <button
        className="reject-btn"
        onClick={() => updateStatus(order.id, "Rejected")}
      >
        Reject
      </button>
    </div>

  </div>
))}
</div>
</div>

{/* Accepted Orders */}

<h2 className="section-title"></h2>
<div className="section-card accepted-card">
    <div className="section-header">
        <h2 className="section-title">
            🟦 Accepted Orders ({accepted})
        </h2>
    </div>

<div className="order-row">
  {acceptedOrders.map((order) => (
    <div className="mini-order-card" key={order.id}>

      <div className="mini-top">
        <div>
          <h2>{order.customer}</h2>
          <p>📞 {order.phone}</p>
          <p>📍 {order.address}</p>
          <p>🕒 {order.time}</p>
        </div>

        <span className={`status ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>

      <p>🛒 {order.products.length} Items</p>

        <div className="price-box">
          <strong>₹{order.total}</strong>
          <span>{order.payment}</span>
        </div>

      

      <div className="order-actions">
        <button
          className="ready-btn"
          onClick={() => updateStatus(order.id, "Ready")}
        >
          Ready
        </button>
      </div>

    </div>
  ))}
  </div>
</div>

{/* Ready Orders */}

<div className="section-card ready-card">
  <div className="section-header">
        <h2 className="section-title">
            🟣 Ready Orders ({ready})
        </h2>
    </div>

<div className="order-row">
  {readyOrders.map((order) => (
    <div className="mini-order-card" key={order.id}>

      <div className="mini-top">
        <div>
          <h2>{order.customer}</h2>
          <p>📞 {order.phone}</p>
          <p>📍 {order.address}</p>
          <p>🕒 {order.time}</p>
        </div>

        <span className={`status ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>

      <p>🛒 {order.products.length} Items</p>

          <div className="price-box">
            <strong>₹{order.total}</strong>
            <span>{order.payment}</span>
          </div>

      

      <div className="order-actions">
        <button
          className="parcel-btn"
          onClick={() => updateStatus(order.id, "Delivered")}
        >
          Parcel Delivered
        </button>
      </div>

    </div>
  ))}
  </div>
</div>


{/* Delivered Orders */}


<div className="section-card ready-card">
<div className="section-header">
        <h2 className="section-title">
            🟢 Delivered Orders ({delivered})
        </h2>
    </div>

<div className="order-row">
  {deliveredOrders.map((order) => (
    <div className="mini-order-card" key={order.id}>

      <div className="mini-top">
        <div>
          <h2>{order.customer}</h2>
          <p>📞 {order.phone}</p>
          <p>📍 {order.address}</p>
          <p>🕒 {order.time}</p>
        </div>

        <span className={`status ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>

     <p>🛒 {order.products.length} Items</p>

        <div className="price-box">
          <strong>₹{order.total}</strong>
          <span>{order.payment}</span>
        </div>

      

      <div className="order-actions">
        <button className="done-btn">
          Delivered
        </button>
      </div>

    </div>
  ))}
  </div>
</div>

</div>
);
}

export default Orders;