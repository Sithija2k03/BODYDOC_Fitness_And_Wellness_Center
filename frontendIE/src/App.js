import './App.css';
import styled from 'styled-components';
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Navigation from './components/Navigation/Navigation';
import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Incomes from './components/Incomes/Incomes';
import Expenses from './components/Expenses/Expenses';
import Salary from './components/Salaries/salaries';
import Inventory from './components/Inventory/Inventory';
import Suppliers from './components/Suppliers/Supplier';
import PharmacyForm from './components/Form/PharmacyForm';
import Supplier from './components/Suppliers/Supplier';
import { useGlobalContext } from './context/globalContext';

function App() {
  const [active, setActive] = React.useState(1);
  const { error } = useGlobalContext();

  const displayData = () => {
    switch (active) {
      case 1: return <Dashboard />;
      case 2: return <Dashboard />;
      case 3: return <Incomes />;
      case 4: return <Expenses />;
      case 5: return <Salary />;
      case 6: return <Inventory />;
      case 61: return <PharmacyForm />;
      case 62: return <Inventory />;
      case 7: return <Supplier />; // Displays the supplier form
      default: return <Dashboard />;
    }
  };

  return (
    <AppStyled bg={bg} className="App">
      <MainLayout>
        <Navigation active={active} setActive={setActive} />
        <main>{displayData()}</main>
      </MainLayout>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${props => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
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