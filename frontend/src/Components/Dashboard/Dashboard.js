import React, { useEffect } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import Chart from "../Chart/Chart";
import { rupees } from "../../utils/icons";
import { useGlobalContext } from "../../context/globalContext";
import History from "../../History/History";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

function Dashboard() {
    const { totalIncome, totalExpenses, getIncomes, getExpenses, getSalaries, salaries, expenses, incomes } = useGlobalContext();

    useEffect(() => {
        getIncomes();
        getExpenses();
        getSalaries();
    }, []);
    
    const generatePDF = () => {
    
        const doc = new jsPDF();
    
        if (typeof autoTable !== "function") {
            console.error("autoTable is not a function");
            return;
        }
    
        // Define columns
        const columns = ["Incomes", "Expenses", "Salary", "Balance"];
    
        let totalSalary = salaries.reduce((total, salary) => total + salary.netSalary, 0);
        let totalIncomeValue = totalIncome();
        let totalExpensesValue = totalExpenses();
        
        let balance = totalIncomeValue - (totalExpensesValue + totalSalary);
    
        const rows = [];
    
        const maxLength = Math.max(incomes.length, expenses.length, salaries.length);
    
        for (let i = 0; i < maxLength; i++) {
            const incomeEntry = incomes[i]?.amount ? `$${incomes[i].amount}` : "-";
            const expenseEntry = expenses[i]?.amount ? `$${expenses[i].amount}` : "-";
            const salaryEntry = salaries[i]?.netSalary ? `$${salaries[i].netSalary}` : "-";
    
            rows.push([incomeEntry, expenseEntry, salaryEntry]);
        }
    
        // Add total row
        rows.push([
            `Total: $${totalIncomeValue}`,
            `Total: $${totalExpensesValue}`,
            `Total: $${totalSalary}`,
            `Final Balance: $${balance}`
        ]);
    
        // Generate the PDF table
        autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 30,
        });
    
        doc.save("financial_report.pdf");
    };

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
                                <p>{rupees} {totalIncome()}</p>
                            </div>
                            <div className="expense">
                                <h3>Total Expense</h3>
                                <p>{rupees} {totalExpenses()}</p>
                            </div>
                            <div className="balance">
                                <h3>Balance</h3>
                                <p>{rupees} {totalIncome() - totalExpenses()}</p>
                            </div>
                            {/* PDF Button */}
                        <button onClick={generatePDF} className="pdf-button">
                            Generate PDF Report
                        </button>
                        </div>  
                    </div>
                    <div className="transaction-container">
                        <History />
                        {/* salary section */}
                        <h2 className="salary-title">Min <span>Salary</span> Max</h2>
                        <div className="salary-item">
                            <p>Rs. {salaries.length > 0 ? Math.min(...salaries.map(item => item.netSalary)) : "No Salary Data"}</p>
                            <p>Rs. {salaries.length > 0 ? Math.max(...salaries.map(item => item.netSalary)) : "No Salary Data"}</p>
                        </div>
                        {/* income section */}
                        <h2 className="salary-title">Min <span>Income</span> Max</h2>
                        <div className="salary-item">
                            <p>Rs. {incomes.length > 0 ? Math.min(...incomes.map(item => item.amount)) : "No Income Data"}</p>
                            <p>Rs. {incomes.length > 0 ? Math.max(...incomes.map(item => item.amount)) : "No Income Data"}</p>
                        </div>
                        {/* expense section */}
                        <h2 className="salary-title">Min <span>Expense</span> Max</h2>
                        <div className="salary-item">
                            <p>Rs. {expenses.length > 0 ? Math.min(...expenses.map(item => item.amount)) : "No Expense Data"}</p>
                            <p>Rs. {expenses.length > 0 ? Math.max(...expenses.map(item => item.amount)) : "No Expense Data"}</p>
                        </div>
                    </div>
                </div>
            </InnerLayout>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    .stats-con {
        display: grid;
        grid-template-columns: 3fr 1fr; /* 3 parts for chart container and 1 part for transaction container */
        gap: 2rem; /* Ensure there is a gap between the items */
    }

    .chart-container {
        grid-column: 1; /* Occupy 1 full column */
        height: 100%;
        width: 100%;
        max-width: 700px;
        overflow: auto;
        background-color: #FCF6F9;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        padding: 0;
        position: relative; /* Make sure the button is positioned relative to this container */
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
            padding: .5rem;
            border-radius: 10px;
            text-align: center;
            transition: all 0.3s ease-in-out;

            h3 {
                font-size: 1.1rem;
                margin-bottom: 0.5rem;
                color: #333;
            }

            p {
                font-size: 2rem;
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
                font-size: 2.3rem;
                font-weight: 700;
                color: #0d47a1;
            }
        }
    }

    .pdf-button {
        background: #4CAF50;
        color: white;
        padding: 12px 20px; /* Reduced padding for a smaller button */
        font-size: 1.2rem; /* Adjusted font size for better compactness */
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: 0.3s;
        margin-top: 10px;
        position: absolute; /* Position the button absolutely */
        bottom: 60px; /* Adjust button's distance from the bottom of the container */
        left: 50%; /* Position it in the center horizontally */
        transform: translateX(-50%); /* Adjust for exact centering */
        width: auto; /* Ensures button width is adjusted according to content */
    }

    .pdf-button:hover {
        background: #388E3C;
    }

    .transaction-container {
        grid-column: 2; /* Occupy the second column */
        padding: 1rem;
        background-color: #FCF6F9;
        border-radius: 10px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        margin-right: 2.5rem;
        margin-left: 0; /* Removed negative margin */

        .salary-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: transparent;
            padding: 0.5rem;
            border-radius: 0;
            font-size: 1.3rem;
            font-weight: 700;
            color: #222;
            letter-spacing: 0.8px;
            text-transform: uppercase;
        }

        .salary-title span {
            flex: 1;
            text-align: center;
            margin-right: 6.8rem;
        }

        .salary-item {
            display: flex;
            justify-content: space-between;
            background-color: #f3f3f3;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.1);
            margin-bottom: 1rem;
            border-left: 5px solid #4CAF50;
        }
    }
`;


export default Dashboard;