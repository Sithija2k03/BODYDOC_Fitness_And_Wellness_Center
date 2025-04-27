import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './Login/Header';
import { PrivateRoute as RouteGuard } from './PrivateRoute';
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Membership from "./Pages/Membership";
import Register from "./Register/Register";
import Login from "./Login/Login";
import UserProfile from "./Login/UserProfile";
import EditProfile from "./Login/EditProfile";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Components/Dashboard/Dashboard";
import Incomes from "./Components/Incomes/Incomes";
import Expenses from "./Components/Expenses/Expenses";
import Salary from "./Components/Salaries/salaries";
import Inventory from "./Components/Inventory/Inventory";
import Supplier from "./Components/Suppliers/Supplier";
import EditSupplier from "./Components/Form/EditSupplier";
import Pharmacy from "./Components/pharmacy/Pharmacy";
import GymEquipment from "./Components/GymEquipment/GymEquipment";
import Nutrition from "./Components/Nutrition/Nutrition";
import Workout from "./Components/Workout/Workout";
import AppointmentForm from "./Components/Appoinment/AppoinmentForm";
import AppoinmentLayout from "./Components/AppoinmentLayout/AppoinmentLayout";
import AppoinmentList from './Components/Appoinment/Appoinment';
import AppointmentEdit from './Components/Appoinment/AppoinmentEdit';
import BookingForm from "./Components/Booking/BookingForm";
import BookingList from "./Components/Booking/BookingList";
import EditBooking from "./Components/Booking/EditBooking";
import Bookings from "./Components/Booking/Bookings";
import OrderForm from './Components/Order/OrderForm';
import Order from "./Components/Order/Order";
import OrderEdit from "./Components/Order/OrderEdit";
import BMI from "./Components/BMI Calculator/BMI";
import UserDashboard from './Pages/userDashboard';
import { GlobalProvider } from './context/globalContext';

// Private Route Component
const PrivateRoute = ({ children }) => {
  let user = null;
  const token = localStorage.getItem('token');

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return <Navigate to="/login" />;
  }

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return children;
};


const App = () => {
  return (
    <GlobalProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/edit-booking/:id" element={<EditBooking />} />
            <Route path="/gymEquipment" element={<GymEquipment />} />
            <Route path="/edit-supplier/:supplierId" element={<EditSupplier />} />
            <Route path="/pharmacy-items" element={<Pharmacy />} />
           

            {/* E-Pharmacy Routes */}
            <Route path="/addAppointment" element={<AppointmentForm />} />
            <Route path="/appointment-layout" element={<AppoinmentLayout />} />
            <Route path="/appointment-display" element={<AppoinmentList />} />

            {/* Fitness & Nutrition Routes */}
            <Route path="/nutrition-plan" element={<Nutrition />} />
            <Route path="/workout-plan" element={<Workout />} />
            <Route path="/addOrder" element={<OrderForm />} />
            <Route path="/order-display" element={<Order />} />
            <Route path="/order-edit" element={<OrderEdit />} />
            <Route path="/BMI" element={<BMI />} />

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
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
};

export default App;