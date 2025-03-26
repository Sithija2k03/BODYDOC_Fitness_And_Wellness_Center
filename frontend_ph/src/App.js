import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from "styled-components";
import imgCover from './img/imgCover.jpg';
import { MainLayout } from './styles/Layouts';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AppointmentForm from "./components/Appoinment/AppoinmentForm"; // Corrected name
import Appoinment from './components/Appoinment/Appoinment'; // Corrected name
import { GlobalProvider } from './context/globalContext'; // Import GlobalProvider
import OrderForm from './components/order/OrderForm';

function App() {
  return (
    <GlobalProvider> {/* Wrap the entire app with GlobalProvider */}
      <AppStyled $imgCover={imgCover} className="App">
        <MainLayout>
          <Header />
          <Routes>
            <Route path="/add" element={<AppointmentForm />} /> {/* Appointment Form Page */}
            <Route path="/appointment" element={<Appoinment />} /> {/* Appointment List Page */}
            <Route path="/order" element={<OrderForm />} /> {/* Appointment List Page */}
          </Routes>
        </MainLayout>
        <Footer />
      </AppStyled>
    </GlobalProvider>
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
