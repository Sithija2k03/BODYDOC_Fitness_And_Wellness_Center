import './App.css';
import styled from 'styled-components';
import bg from './img/bg.jpg';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import React, { useState } from 'react';
import Dashboard from './Components/Dashboard/Dashboard';
import Bookings from './Components/Booking/Bookings';
import AppoinmentList from './Components/Appoinment/Appoinment';
import Incomes from './Components/Incomes/Incomes';
import Expenses from './Components/Expenses/Expenses';
import Salary from './Components/Salaries/salaries';
import Inventory from './Components/Inventory/Inventory';
import { GlobalProvider } from './context/globalContext'; // Import GlobalProvider
import Supplier from './Components/Suppliers/Supplier';
import Login from './Login/Login'; // Import Login component
import AdminAppointments from './Components/Appoinment/AdminAppointments';
import PettyCash from './Components/pettyCashBook/PettyCashBook';
import BankBook from './Components/BankBook/BankBook';
import AllUsers from './Components/AllUsers/DisplayAllUsers';

function App() {
  const [active, setActive] = React.useState(1);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <AllUsers />;
      case 9:
        return <Bookings />;
      case 10:
        return <AdminAppointments />;
      case 3:
        return <Incomes />;
      case 4:
        return <Expenses />;
        case 11:
        return <PettyCash />;
      case 5:
        return <Salary />;
      case 12:
        return <BankBook />;
      case 6:
        return <Inventory />;
      case 7:
        return <Supplier />;
      default:
        return <Login />;
    }
  };

  const orbMemo = React.useMemo(() => {
    return <Orb />;
  }, []);

  return (
    <GlobalProvider> {/* Wrap your app with GlobalProvider */}
      <AppStyled bg={bg} className="App">
        {orbMemo}
        <MainLayout>
          <Navigation active={active} setActive={setActive} />
          <main>
            {displayData()}
          </main>
        </MainLayout>
      </AppStyled>
    </GlobalProvider>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(5px);
    border-radius: 30px;
    overflow: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
