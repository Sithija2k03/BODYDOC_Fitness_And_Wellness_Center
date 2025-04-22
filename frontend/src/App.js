// import './App.css';
// import styled from 'styled-components';
// import bg from './img/bg.jpg';
// import {MainLayout} from './styles/Layouts';
// import Orb from './Components/Orb/Orb';
// import Navigation from './Components/Navigation/Navigation';
// import React, { useState } from 'react';
// import Dashboard from './Components/Dashboard/Dashboard';
// import Incomes from './Components/Incomes/Incomes';
// import Expenses from './Components/Expenses/Expenses';
// import Salary from './Components/Salaries/salaries';
// import Inventory from './Components/Inventory/Inventory';
// import { useGlobalContext } from './context/globalContext';
// import Supplier from './Components/Suppliers/Supplier';

// function App() {

//   const [active, setActive] = React.useState(1)

//   const global = useGlobalContext();
//   console.log(global);

//   const displayData = () => {
//     switch (active) {
//       case 1:
//         return <Dashboard />
//       case 2:
//         return <Dashboard />
//       case 3:
//         return <Incomes />
//       case 4:
//         return <Expenses />
//       case 5:
//         return <Salary /> 
//       case 6:
//         return <Inventory/>
//       case 7:
//         return <Supplier/>
//       default:
//         return <Dashboard />
//     }
//   }

//   const orbMemo = React.useMemo(() => {
//     return <Orb />;
//   }, []);

//   return (
//     <AppStyled bg={bg} className="App">
//      {orbMemo}
//       <MainLayout>
//          <Navigation active={active} setActive={setActive} />
//          <main>
//              {displayData()}
//          </main>
//       </MainLayout>
//     </AppStyled>
//   );
// }

// const AppStyled = styled.div` 
// height: 100vh;
// background-image: url(${props => props.bg});
// position: relative;
// main{
//   flex: 1;
//   background: rgba(252, 246, 249, 0.78);
//   border: 3px solid #FFFFFF;
//   backdrop-filter: blur(5px);
//   border-radius: 30px;
//   overflow: auto;
//   overflow-x: hidden;
//   &::-webkit-scrollbar{
//     width: 0;
//   }
// `;







// // export default App;
// import React from "react";
// import styled from 'styled-components';
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate for redirects
// import Home from "./Pages/Home";
// import About from "./Pages/About";
// import Contact from "./Pages/Contact";
// import Membership from "./Pages/Membership";
// import Register from "./Register/Register";
// import Login from "./Login/Login";
// import UserProfile from "./Login/UserProfile";
// import EditProfile from "./Login/EditProfile";
// import AdminLayout from "./AdminLayout"; // Import AdminLayout
// import Dashboard from "./Components/Dashboard/Dashboard";
// import Incomes from "./Components/Incomes/Incomes";
// import Expenses from "./Components/Expenses/Expenses";
// import Salary from "./Components/Salaries/salaries";
// import Inventory from "./Components/Inventory/Inventory";
// import Supplier from "./Components/Suppliers/Supplier";

// // PrivateRoute to protect admin routes
// const PrivateRoute = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem('user'));  // Get user data from localStorage
//   const token = localStorage.getItem('token');  // Get token from localStorage

//   if (!token || user?.role !== 'admin') {
//     return <Navigate to="/login" />;  // Redirect to login if not logged in or not admin
//   }

//   return children;  // Render the children if user is authenticated and an admin
// };

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/membership" element={<Membership />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/user-profile" element={<UserProfile />} />
//         <Route path="/edit-profile" element={<EditProfile />} />

//         {/* Admin Routes - Protected by PrivateRoute */}
//         <Route path="/admin/*" element={
//           <PrivateRoute>
//             <AdminLayout />  {/* Admin layout wrapper */}
//           </PrivateRoute>
//         }>
//           <Route index element={<Dashboard />} /> {/* Default admin page */}
//           <Route path="dashboard" element={<Dashboard />} />
//           <Route path="incomes" element={<Incomes />} />
//           <Route path="expenses" element={<Expenses />} />
//           <Route path="salaries" element={<Salary />} />
//           <Route path="inventory" element={<Inventory />} />
//           <Route path="suppliers" element={<Supplier />} />
//         </Route>

//         {/* Redirect if no route matches */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;




//after merged AI


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

const App = () => {
  const [workoutResult, setWorkoutResult] = React.useState(null);
  const [nutritionResult, setNutritionResult] = React.useState(null);

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

        {/* Display results below the routed components */}
        <div className="results-container">
          {workoutResult && <ResultDisplay title="Workout Plan" data={workoutResult} />}
          {nutritionResult && <ResultDisplay title="Nutrition Plan" data={nutritionResult} />}
        </div>
      </div>
    </Router>
  );
};

export default App;


