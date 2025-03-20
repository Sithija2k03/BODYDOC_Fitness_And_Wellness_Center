import React, { useRef } from 'react';
import {
    Chart as ChartJs,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { dateFormat } from '../../utils/dateFormat';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';

ChartJs.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

function Chart() {
    const { incomes = [], expenses = [] } = useGlobalContext() || {};


    // Sort data by date to avoid display issues
    const sortedIncomes = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date));
    const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

    const data = {
        labels: sortedIncomes.map((inc) => dateFormat(inc.date)),
        datasets: [
            {
                label: 'Income',
                data: sortedIncomes.map((income) => income.amount),
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
                borderColor: 'rgba(0, 255, 0, 1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Expenses',
                data: sortedExpenses.map((expense) => expense.amount),
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                borderColor: 'rgba(255, 0, 0, 1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            tooltip: { mode: 'index', intersect: false }
        },
        scales: {
            x: { grid: { display: false } },
            y: { beginAtZero: true }
        }
    };

    return (
        <ChartStyled>
            <Line data={data} options={options} />
        </ChartStyled>
    );
}

const ChartStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    border-radius: 20px;
    padding: 1rem;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    height: 400px; /* Adjusted height for better visibility */
    width: 100%;
`;

export default Chart;
