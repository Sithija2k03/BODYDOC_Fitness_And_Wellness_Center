import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Membership from "./Pages/Membership";
import Register from "./Register/Register";
import Login from "./Login/Login";
import UserProfile from "./Login/UserProfile";
import EditProfile from "./Login/EditProfile";
import AdminLayout from "./AdminLayout"; // Uses <Outlet />
import Dashboard from "./Components/Dashboard/Dashboard";
import Incomes from "./Components/Incomes/Incomes";
import Expenses from "./Components/Expenses/Expenses";
import Salary from "./Components/Salaries/salaries";
import Inventory from "./Components/Inventory/Inventory";
import Supplier from "./Components/Suppliers/Supplier";
import EditSupplier from "./Components/Form/EditSupplier";
import Pharmacy from "./Components/pharmacy/Pharmacy"; // Added Pharmacy Items Page
import GymEquipment from "./Components/GymEquipment/GymEquipment"; // Added Gym Equipment Page
//import GymEquipment from "./pages/GymEquipment"; // Added Gym Equipment Page
import Navigation from "./Components/Navigation/Navigation"; // Added Navigation
import { GlobalProvider } from './context/globalContext';
import navItems from "./utils/navItems";

// PrivateRoute to protect admin routes
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!token || user?.role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <GlobalProvider>
      <Router>
       
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/edit-supplier/:supplierId" element={<EditSupplier />} />
          <Route path="/pharmacy-items" element={<Pharmacy />} />
          <Route path="/GymEquipment" element={<GymEquipment />} />

          {/* Pharmacy and Gym Equipment Pages */}
         
          {/* <Route path="/gym-equipment" element={<GymEquipment />} /> */}

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="incomes" element={<Incomes />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="salaries" element={<Salary />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="suppliers" element={<Supplier />} />
            <Route path="supplier" element={<Supplier />} />
          </Route>

          {/* Redirect unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </GlobalProvider>
  );
};

export default App;
