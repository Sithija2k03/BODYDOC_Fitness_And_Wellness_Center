import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './Login/Header';
import { PrivateRoute as RouteGuard } from './PrivateRoute'; // Keep this as your main route guard
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
import BookingForm from "./Booking/BookingForm";
import BookingList from "./Booking/BookingList";
import EditBooking from "./Booking/EditBooking";
import EditSupplier from "./Components/Form/EditSupplier";
import Pharmacy from "./Components/pharmacy/Pharmacy";
import GymEquipment from "./Components/GymEquipment/GymEquipment";
import Navigation from "./Components/Navigation/Navigation";
import { GlobalProvider } from './context/globalContext';
import navItems from "./utils/navItems";
import Nutrition from './Components/Nutrition/Nutrition';
import WorkOut from './Components/Workout/Workout';
import ResultDisplay from './Components/ResultDisplay';
import AppointmentForm from "./Components/Appoinment/AppoinmentForm";
import AppoinmentLayout from "./Components/AppoinmentLayout/AppoinmentLayout";
import AppoinmentList from './Components/Appoinment/Appoinment';

const App = () => {
  const [workoutResult, setWorkoutResult] = React.useState(null);
  const [nutritionResult, setNutritionResult] = React.useState(null);

  const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (!token || user?.role !== "admin") {
      return <Navigate to="/login" />;
    }

    return children;
  };

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
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/booking-list" element={<BookingList />} />
            <Route path="/edit-booking/:id" element={<EditBooking />} />

            {/* E-Pharmacy Routes */}
            <Route path="/addAppointment" element={<AppointmentForm />} />
            <Route path="/appointment-layout" element={<AppoinmentLayout />} />
            <Route path="/appointment-display" element={<AppoinmentList />} />

            {/* Supplier & Inventory */}
            <Route path="/edit-supplier/:supplierId" element={<EditSupplier />} />
            <Route path="/pharmacy-items" element={<Pharmacy />} />
            <Route path="/gymEquipment" element={<GymEquipment />} />

            {/* Fitness & Nutrition Routes */}
            <Route 
              path="/nutrition-plan" 
              element={<Nutrition setResult={setNutritionResult} />} 
            />
            <Route 
              path="/workout-plan" 
              element={<WorkOut setResult={setWorkoutResult} />} 
            />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={
              <RouteGuard>
                <AdminLayout />
              </RouteGuard>
            }>
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
