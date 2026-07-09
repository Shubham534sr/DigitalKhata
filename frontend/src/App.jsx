import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Credit from "./pages/Credit";
import Payment from "./pages/Payment";
import Shopping from "./pages/Shopping";
import Collections from "./pages/Collections";
import Transactions from "./pages/Transactions";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import AddCustomer from "./pages/AddCustomer";
import Sidebar from "./components/Sidebar";
import Order from "./pages/Order";

const withSidebar = (page) => <Sidebar>{page}</Sidebar>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
              path="/customers/:id"
              element={withSidebar(<Customers />)}
            />
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={withSidebar(<Dashboard />)} />
        <Route path="/customers" element={withSidebar(<Customers />)} />
        <Route path="/credit" element={withSidebar(<Credit />)} />
        <Route path="/payment" element={withSidebar(<Payment />)} />
        <Route path="/shopping" element={withSidebar(<Shopping />)} />
        <Route path="/collections" element={withSidebar(<Collections />)} />
        <Route path="/transactions" element={withSidebar(<Transactions />)} />
        <Route path="/report" element={withSidebar(<Report />)} />
        <Route path="/settings" element={withSidebar(<Settings />)} />
        <Route path="/add-customer" element={withSidebar(<AddCustomer />)} />
        <Route path="/orders" element={withSidebar(<Order />)} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
