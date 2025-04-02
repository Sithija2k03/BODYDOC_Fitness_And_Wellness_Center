import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { useGlobalContext } from "../../context/globalContext";
import IncomeItem from "../IncomeItem/IncomeItem";
import ExpenseForm from "./ExpenseForm";
import { search } from "../../utils/icons"; 

function Expenses() {
    const { addExpense, expenses, getExpenses, deleteExpense, totalExpenses } = useGlobalContext();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getExpenses();
    }, []);

    // Filter expenses based on search input
    const filteredExpenses = expenses
   ? expenses.filter((expense) => expense?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
   : [];

    
    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-income">Total Expense: <span>Rs. {totalExpenses()}</span></h2>

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
                        <ExpenseForm />
                    </div>
                    
                    <div className="incomes">
                    {filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => {
                    const { _id, title, amount, date, category, description } = expense;
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
                    type="expense"
                    deleteItem={deleteExpense}
                />
                );
            })
            ) : (
                <p>No Expenses found.</p> 
             )}
            </div>


                </div>
            </InnerLayout>
        </ExpenseStyled>
    );
}

const ExpenseStyled = styled.div`
  display: flex;
  overflow: auto;

//   h1 {
//   text-align: left;
// }

  .total-income{
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

    span{
       font-size: 2.5rem;
       font-weight: 800;
       color: #FF0000;
    }
  }
  .income-content{
    display: flex;
    gap: 2rem;
  }
    .incomes{
    flex:1;
    }
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-left: 15px;

  input {
    background: #FFFFFF;
    width: 100%;
    max-width: 400px;
    padding: 10px 40px 10px 10px; 
    border: 2px solid #FF0000;
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
    left: 420px;
    top: 235px;
    color: var(--color-primary);
    cursor: pointer;
  }
`;

export default Expenses;
