// src/App.js
import './App.css';
import React from "react";
import Header from './components/Nav/Header';
import { Route, Routes } from "react-router-dom";
import Nutrition from './components/Nutrition/Nutrition';
import WorkOut from './components/Workout/Workout';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [workoutResult, setWorkoutResult] = React.useState(null);
  const [nutritionResult, setNutritionResult] = React.useState(null);

  return (
    <div className="app">
      <Header />

      <React.Fragment>
        <Routes>
          <Route 
            path="/nutrition-plan" 
            element={<Nutrition setResult={setNutritionResult} />} 
          />
          <Route 
            path="/workout-plan" 
            element={<WorkOut setResult={setWorkoutResult} />} 
          />
          {/* Optional: Add a home route or redirect if needed */}
          <Route 
            path="/" 
            element={<div><h2>Welcome to Fitness Planner</h2></div>} 
          />
        </Routes>

        {/* Display results below the routed components */}
        <div className="results-container">
          {workoutResult && <ResultDisplay title="Workout Plan" data={workoutResult} />}
          {nutritionResult && <ResultDisplay title="Nutrition Plan" data={nutritionResult} />}
        </div>
      </React.Fragment>
    </div>
  );
}

export default App;