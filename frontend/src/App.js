import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from './Login/Header';
import { PrivateRoute } from './PrivateRoute'; // Create a separate file for PrivateRoute component to keep the code clean.
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
import Nutrition from './Components/Nutrition/Nutrition';
import WorkOut from './Components/Workout/Workout';
import ResultDisplay from './Components/ResultDisplay';
import AppointmentForm from "./Components/Appoinment/AppoinmentForm"; 
import AppoinmentLayout from "./Components/AppoinmentLayout/AppoinmentLayout";
import AppoinmentList from './Components/Appoinment/Appoinment'

const App = () => {
  const [workoutResult, setWorkoutResult] = React.useState(null);
  const [nutritionResult, setNutritionResult] = React.useState(null);

  const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));  // Get user data from localStorage
  const token = localStorage.getItem('token');  // Get token from localStorage

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/login" />;  // Redirect to login if not logged in or not admin
  }

  return children;  // Render the children if user is authenticated and an admin
};

  return (
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

          {/* E-Pharmacy Routes */}
          <Route path="/addAppointment" element={<AppointmentForm />} />
            {/* <Route path="/appointment" element={<Appoinment />} /> Appointment List Page */}
            {/* <Route path="/order" element={<GloabalOrders/>} /> Appointment List Page */}
            <Route path="/appointment-layout" element={<AppoinmentLayout />} />
            <Route path="/appointment-display" element={<AppoinmentList/>} />

          {/* Fitness & Nutrition Routes */}
          <Route 
            path="/nutrition-plan" 
            element={<Nutrition setResult={setNutritionResult} />} 
          />
          <Route 
            path="/workout-plan" 
            element={<WorkOut setResult={setWorkoutResult} />} 
          />

          {/* Admin Routes - Protected by PrivateRoute */}
          <Route path="/admin/*" element={
            <PrivateRoute>
              <AdminLayout /> {/* Admin layout wrapper */}
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} /> {/* Default admin page */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="incomes" element={<Incomes />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="salaries" element={<Salary />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="suppliers" element={<Supplier />} />
          </Route>

          {/* Redirect if no route matches */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </div>
    </Router>
  );
};

export default App;


