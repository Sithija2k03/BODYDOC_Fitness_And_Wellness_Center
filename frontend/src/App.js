import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { GlobalProvider } from './context/globalContext';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import Membership from './Pages/Membership';
import Register from './Register/Register';
import Login from './Login/Login';
import UserProfile from './Login/UserProfile';
import EditProfile from './Login/EditProfile';
import AdminLayout from './AdminLayout';
import Dashboard from './Components/Dashboard/Dashboard';
import Incomes from './Components/Incomes/Incomes';
import Expenses from './Components/Expenses/Expenses';
import Salary from './Components/Salaries/salaries';
import Inventory from './Components/Inventory/Inventory';
import Supplier from './Components/Suppliers/Supplier';
import EditSupplier from './Components/Form/EditSupplier';
import Pharmacy from './Components/pharmacy/Pharmacy';
import GymEquipment from './Components/GymEquipment/GymEquipment';
import Nutrition from './Components/Nutrition/Nutrition';
import WorkOut from './Components/Workout/Workout';
import WorkoutResult from './Components/Workout/WorkoutResult';
import NutritionResults from './Components/Nutrition/NutritionResults';
import BMI from './Components/BMI Calculator/BMI';
import AppointmentForm from './Components/Appoinment/AppoinmentForm';
import AppointmentLayout from './Components/AppoinmentLayout/AppoinmentLayout';
import AppointmentList from './Components/Appoinment/Appoinment';

// Public Layout Component
const PublicLayout = () => (
  <div>
    {/* Add Header or Navigation here if needed */}
    <Outlet />
  </div>
);

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
  const [workoutResult, setWorkoutResult] = useState(null);
  const [nutritionResult, setNutritionResult] = useState(null);

  return (
    <GlobalProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
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
              <Route path="/appointment-layout" element={<AppointmentLayout />} />
              <Route path="/appointment-display" element={<AppointmentList />} />
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
              <Route path="/BMI" element={<BMI />} />
              <Route path="/result" element={<WorkoutResult result={workoutResult} />} />
              <Route
                path="/nutrition-result"
                element={<NutritionResults result={nutritionResult} />}
              />
            </Route>

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