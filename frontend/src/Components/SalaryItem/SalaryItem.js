import React from 'react';
import styled from 'styled-components';
import { dateFormat } from '../../utils/dateFormat';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import {trash, employee} from '../../utils/icons';

function SalaryItem({
    id,
    employeeId,
    basicSalary,
    allowances,
    deductions,
    netSalary,
    paymentDate,
    status,
    indicatorColor,
    deleteItem,
}) {
    const { updateSalaryStatus } = useGlobalContext();  

    const handleUpdateStatus = () => {
        const newStatus = status === "Pending" ? "Paid" : "Pending"; // Toggle status
        updateSalaryStatus(id, newStatus); 
    };

    return (
        <SalaryItemStyled>
            <div className="indicator" style={{ backgroundColor: indicatorColor }}></div>
            <div className="content">
            <h5>
              <span className="employee-icon">{employee}</span> 
              {employeeId ? employeeId.fullName : "No Name Available"} {/* Add check here */}
            </h5>

                <p>Basic Salary: {basicSalary}</p>
                <p>Allowances: {allowances}</p>
                <p>Deductions: {deductions}</p>
                <p>Net Salary: {netSalary}</p>
                <p>Payment Date: {dateFormat(paymentDate)}</p>
                <p>Status: <span className={status === "Paid" ? "paid" : "pending"}>{status}</span></p>

                <div className="buttons">
                    <button onClick={handleUpdateStatus} className={status === "Paid" ? "paid-btn" : "pending-btn"}>
                        {status === "Pending" ? "Mark as Paid" : "Mark as Pending"}
                    </button>
                    <div className='actions'>
                        <Button
                            icon={trash}
                            bPad={'1rem'}
                            bRad={'50%'}
                            bg={'var(--color-delete)'}
                            color={'#fff'}
                            iColor={'#fff'}
                            hColor={'var(--color-green)'}
                            onClick={() => deleteItem(id)}
                            />
                    </div>
                </div>
            </div>
        </SalaryItemStyled>
    );
}

const SalaryItemStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem;
    max-width: 93%;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    overflow: hidden;

    .indicator {
        width: 10px;
        height: 100%;
        border-radius: 5px;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: rows;
        gap: 0.3rem; 

        h5 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;

            .employee-icon {
            font-size: 1.5rem; /* Adjust the size as needed */
             margin-right: 0.5rem; /* Add spacing between the icon and text */
            }
        }

        p {
            margin: 0.2rem 0;
        }

        .paid {
            color: green;
            font-weight: bold;
        }

        .pending {
            color: red;
            font-weight: bold;
        }

       .buttons {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        button {
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            font-size: 0.8rem;
            padding: 10px 25px;
            white-space: nowrap;
            transition: all 0.3s ease-in-out;

            &:hover {
                opacity: 0.8;
            }
        }

        .paid-btn {
            background: green;
            color: white;
            width: 150px;
            text-align: center;
        }

        .pending-btn {
            background: orange;
            color: white;
            width: 130px;
            text-align: center;
        }

        .delete-btn {
            background: #FF6B6B;
            color: white;
            width: 70px; /* Make delete button smaller */
            height: 70px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem; /* Slightly bigger icon */
        }
     }
    }
`;

export default SalaryItem;
