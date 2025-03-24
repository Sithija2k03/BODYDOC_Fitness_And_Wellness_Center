import React from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import Chart from "../Chart/Chart";
import { rupees, } from "../../utils/icons";
import { useGlobalContext } from "../../context/globalContext";
import { useEffect } from "react";
import History from "../../History/History";

function Dashboard() {

    const {totalIncome, totalExpenses, getIncomes, getExpenses,getSalaries, salaries, expenses,incomes} = useGlobalContext();

    useEffect(() => {
        getIncomes();
        getExpenses();
        getSalaries();
    }, [])
    return (

        <DashboardStyled>
            <InnerLayout>
                <h1>All Transactions</h1>
                <div className="stats-con">
                    <div className="chart-container">
                        <Chart />
                        <div className="amount-container">
                            <div className="income">
                                <h3>Total Income</h3>
                                <p>
                                    {rupees} {totalIncome()}
                                </p>
                            </div>
                            <div className="expense">
                                <h3>Total Expense</h3>
                                <p>
                                    {rupees} {totalExpenses()}
                                </p>
                            </div>
                            <div className="balance">
                                <h3>Balance</h3>
                                <p>
                                    {rupees} {totalIncome() - totalExpenses()}
                                </p>
                            </div>
                        </div>  
                    </div>
                    <div className="transaction-container">
                           <History />
                           {/* salary section */}
                           <h2 className="salary-title">Min <span>Salary</span>Max</h2>
                           <div className="salary-item">
                           <p>Rs. 
                               {salaries.length > 0 
                               ? Math.min(...salaries.map(item => item.netSalary)) 
                               : "No Salary Data"}
                            </p>
                            <p>Rs. 
                               {salaries.length > 0 
                               ? Math.max(...salaries.map(item => item.netSalary)) 
                               : "No Salary Data"}
                            </p>
                           </div>
                           {/* income section */}
                           <h2 className="salary-title">Min <span>Income</span>Max</h2>
                           <div className="salary-item">
                           <p>Rs. 
                               {incomes.length > 0 
                               ? Math.min(...incomes.map(item => item.amount)) 
                               : "No Income Data"}
                            </p>
                            <p>Rs. 
                               {incomes.length > 0 
                               ? Math.max(...incomes.map(item => item.amount)) 
                               : "No Income Data"}
                            </p>
                           </div>
                           {/* expense section */}
                           <h2 className="salary-title">Min <span>Expense</span>Max</h2>
                           <div className="salary-item">
                           <p>Rs. 
                               {expenses.length > 0 
                               ? Math.min(...expenses.map(item => item.amount)) 
                               : "No Salary Data"}
                            </p>
                            <p>Rs. 
                               {expenses.length > 0 
                               ? Math.max(...expenses.map(item => item.amount)) 
                               : "No Salary Data"}
                            </p>
                           </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    )
}

const DashboardStyled = styled.div`
    .stats-con {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 2rem;
      margin-left: -0.5rem;

      .chart-container {
        grid-column: 1 / 4;
        height: 100%;
        width: 100%; 
        max-width: 700px; /* Limit the maximum width */
        overflow: auto;
        background-color: #FCF6F9;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        padding: 0;
      }

      .amount-container {
        display: grid;
        grid-template-rows: repeat(3, 1fr);
        gap: 1rem;
        margin-top: 1rem;

        .income, .expense, .balance {
          background: #FCF6F9;
          border: 2px solid #FFFFFF;
          box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
          padding: 1rem;
          border-radius: 10px;
          text-align: center;
          transition: all 0.3s ease-in-out;

          h3 {
            font-size: 1.1rem; /* Smaller heading font */
            margin-bottom: 0.5rem;
            color: #333;
          }

          p {
            font-size: 2rem; /* Smaller text size */
            font-weight: 600;
            color: #444;
          }

          &:hover {
            transform: scale(1.05);
            background-color: #F0E5FF;
          }
        }

        .balance {
          grid-column: span 2;
          background: #e3f2fd;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
          padding: 1rem;

          p {
            font-size: 2.3rem; /* Smaller balance text */
            font-weight: 700;
            color: #0d47a1;
          }
        }
      }
    }

    .transaction-container {
      grid-column: 4 / 6;
      padding: 1.5rem;
      background-color: #FCF6F9;
      border-radius: 10px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      margin-right: 2.5rem;
      margin-left: -2rem;

    .salary-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: transparent; /* Removes background to distinguish it from salary items */
    padding: 0.5rem;
    border-radius: 0; /* Removes border radius */
    font-size: 1.3rem;
    font-weight: 700;
    color: #222; /* Darker text for contrast */
    letter-spacing: 0.8px; /* Slightly spaced text */
    text-transform: uppercase;
    }


   .salary-title span {
    flex: 1;
    text-align: center;
    margin-right: 6.8rem;
   }

/* Left-align "Min" */
.salary-title span:first-child {
    text-align: left;
}

/* Right-align "Max" */
.salary-title span:last-child {
    text-align: right;
}

/* Salary Item (Highlighted Appearance) */
.salary-item {
    display: flex;
    justify-content: space-between;
    background-color: #f3f3f3; /* Lighter background for contrast */
    padding: 1rem; /* More padding for better spacing */
    border-radius: 10px;
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1); /* More prominent shadow */
    margin-bottom: 1rem;
    border-left: 5px solid #4CAF50; /* Green left border for emphasis */
}

/* Salary Item Text */
.salary-item p {
    font-size: 1.2rem;
    color: #222;
    font-weight: 600;
}

    }
`;


export default Dashboard;