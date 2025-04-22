import './App.css';
import styled from 'styled-components';
import bg from './img/bg.jpg';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import React, { useState } from 'react';
import Dashboard from './Components/Dashboard/Dashboard';
import Incomes from './Components/Incomes/Incomes';
import Expenses from './Components/Expenses/Expenses';
import Salary from './Components/Salaries/salaries';
import Inventory from './Components/Inventory/Inventory';
import { GlobalProvider } from './context/globalContext'; // Import GlobalProvider
import Supplier from './Components/Suppliers/Supplier';
import Login from './Login/Login'; // Import Login component

function App() {
  const [active, setActive] = React.useState(1);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Dashboard />;
      case 3:
        return <Incomes />;
      case 4:
        return <Expenses />;
      case 5:
        return <Salary />;
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
