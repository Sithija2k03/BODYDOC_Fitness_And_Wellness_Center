import React, { useEffect } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { useGlobalContext } from "../../context/globalContext";
import IncomeItem from "../IncomeItem/IncomeItem";
import ExpenseForm from "./ExpenseForm";

function Expenses() {
    const { addExpense, expenses, getExpenses, deleteExpense, totalExpenses } = useGlobalContext();

    useEffect(() => {
        getExpenses();
    }, []);
    
    return (
        <ExpenseStyled>
            <InnerLayout>
                <h1>Expenses</h1>
                <h2 className="total-income">Total Expense: <span>Rs. {totalExpenses()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <ExpenseForm />
                    </div>
                    
                    <div className="incomes">
                        {expenses && expenses.length > 0 ? (
                            expenses.map((income) => {
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
                                                type="expense"
                                                deleteItem={deleteExpense}
                                            />
                                         );
                                     })
                                ) : (
                                    <p>No incomes found.</p> 
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

export default Expenses;
