import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from "styled-components";
import imgCover from './img/imgCover.jpg';
import { MainLayout } from './styles/Layouts';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Appoinment from './components/Appoinment/Appoinment';
import AppoinmentForm from "./components/Appoinment/AppoinmentForm"; // Import Appointment Form

function App() {
  return (
    <AppStyled $imgCover={imgCover} className="App">
      <MainLayout>
        <Header />
        <Routes>
          {/* <Route path="/add" element={<Appoinment />} /> Medicare & Clinic Page */}
          <Route path="/add" element={<AppoinmentForm/>} /> {/* Add Appoinment Form Page */}
        </Routes>
       
      </MainLayout>
      <Footer />
    </AppStyled>
  );
}

const AppStyled = styled.div`
  min-height: 100vh;
  width: 100%;
  background-image: url(${(props) => props.imgCover});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default App;
