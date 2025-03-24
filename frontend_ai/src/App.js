import './App.css';
import React from "react";
import Header from './components/Nav/Header';
import { Route, Routes  } from "react-router-dom";
import Nutrition from './components/Nutrition/Nutrition';
import WorkOut from './components/Workout/Workout';


function App() {
  return (
    <div>
      <Header/>

      <React.Fragment>
        <Routes>
          {/* Other routes */}

          <Route path="/nutrition-plan" element={<Nutrition/>}/>
          <Route path="/workout-plan" element={<WorkOut/>}/>

        </Routes>
      </React.Fragment>

    </div>
  );
}

export default App;
