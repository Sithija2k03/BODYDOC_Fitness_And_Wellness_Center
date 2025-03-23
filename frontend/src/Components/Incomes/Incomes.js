import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { useGlobalContext } from "../../context/globalContext";
import Form from "../Form/Form";
import IncomeItem from "../IncomeItem/IncomeItem";
import { search } from "../../utils/icons"; 

function Incomes() {
    const { addIncome, incomes, getIncomes, deleteIncome, totalIncome } = useGlobalContext();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getIncomes();
    }, []);

    // Filter incomes based on search input
    const filteredIncomes = incomes
    ? incomes.filter((income) => income?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];


    return (
        <IncomeStyled>
            <InnerLayout>
                <h1>Incomes</h1>
                <h2 className="total-income">Total Income: <span>Rs. {totalIncome()}</span></h2>
                
                <SearchBarContainer>
                    <input
                        type="text"
                        placeholder="Search income by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="search-icon">{search}</div>
                </SearchBarContainer>

                <div className="income-content">
                    <div className="form-container">
                        <Form />
                    </div>
                    
                    <div className="incomes">
                        {filteredIncomes.length > 0 ? (
                            filteredIncomes.map((income) => {
                                const { _id, title, amount, date, category, description } = income;
                                return (
                                    <IncomeItem 
                                        key={_id} 
                                        id={_id}
                                        title={title}
                                        amount={amount}
                                        date={date}
                                        category={category}
                                        description={description}
                                        indicatorColor="var(--color-green)"
                                        type="income"
                                        deleteItem={deleteIncome}
                                    />
                                );
                            })
                        ) : (
                            <p>No incomes found.</p> 
                        )}
                    </div>
                </div>
            </InnerLayout>
        </IncomeStyled>
    );
}

// Styled Components
const IncomeStyled = styled.div`
  display: flex;
  overflow: auto;

  .total-income {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    font-size: 2rem;
    gap: .5rem;

    span {
       font-size: 2.5rem;
       font-weight: 800;
       color: var(--color-green);
    }
  }

  .income-content {
    display: flex;
    gap: 2rem;
  }

  .incomes {
    flex: 1;
  }
`;


const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-left: 15px;

  input {
    background: var(--color-white);
    width: 100%;
    max-width: 400px;
    padding: 10px 40px 10px 10px; 
    border: 2px solid var(--color-green);
    border-radius: 20px;
    font-size: 1rem;
    outline: none;
    transition: 0.3s ease-in-out;

    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 5px var(--color-primary);
    }
  }

  .search-icon {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 500px;
    top: 250px;
    color: var(--color-primary);
    cursor: pointer;
  }
`;

export default Incomes;
