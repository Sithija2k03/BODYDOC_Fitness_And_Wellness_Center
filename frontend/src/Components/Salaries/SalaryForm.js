import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from '../Button/Button';
import { plus } from '../../utils/icons';

function SalaryForm() {
    const { addSalary, getSalaries, getEmployeeByRole } = useGlobalContext();  

    // State for salary form inputs
    const [inputState, setInputState] = useState({
        role: "",  // New state for role selection
        allowances: "",
        deductions: "",
        paymentDate: null,
        status: "Pending",  // Default status
    });

    // State for employee data (fetched from the database)
    const [employeeData, setEmployeeData] = useState({
        employeeId: "",
        basicSalary: 0,
        netSalary: 0,
    });

    const { role, allowances, deductions, paymentDate, status } = inputState;

    // Fetch employee data based on the selected role
    useEffect(() => {
        if (role) {
            const fetchEmployeeData = async () => {
                try {
                    const employee = await getEmployeeByRole(role); // Fetch employee by role
                    if (employee) {
                        setEmployeeData({
                            employeeId: employee._id,
                            basicSalary: employee.basicSalary,
                            netSalary: calculateNetSalary(employee.basicSalary, allowances, deductions),
                        });
                    }
                } catch (error) {
                    console.error("Error fetching employee data:", error);
                }
            };

            fetchEmployeeData();
        }
    }, [role, allowances, deductions]); // Re-run when role, allowances, or deductions change

    const calculateNetSalary = (basicSalary, allowances, deductions) => {
        return basicSalary + parseFloat(allowances || 0) - parseFloat(deductions || 0);
    };

    const handleInput = (name) => (e) => {
        setInputState({
            ...inputState,
            [name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!role || !allowances || !deductions || !paymentDate) {
            alert("Please fill all fields before submitting.");
            return;
        }

        const newSalary = {
            role,
            allowances: parseFloat(allowances),
            deductions: parseFloat(deductions),
            paymentDate,
            status,
        };

        try {
            await addSalary(newSalary); // Add salary to the database
            getSalaries(); // Fetch all salaries again
            alert("Salary added successfully!");

            // Reset form
            setInputState({
                role: "",
                allowances: "",
                deductions: "",
                paymentDate: null,
                status: "Pending",
            });
        } catch (error) {
            console.error("Error adding salary:", error);
            alert("Failed to add salary. Please try again.");
        }
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            <div className="input-control">
                <select 
                    value={role} 
                    name="role" 
                    onChange={handleInput("role")}
                >
                    <option value="" disabled>Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="trainer">Trainer</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="member">Member</option>
                </select>
            </div>

            <div className="input-control">
                <input 
                    type="number" 
                    value={allowances}
                    name="allowances"
                    placeholder="Allowances"
                    onChange={handleInput("allowances")}
                />
            </div>

            <div className="input-control">
                <input 
                    type="number" 
                    value={deductions}
                    name="deductions"
                    placeholder="Deductions"
                    onChange={handleInput("deductions")}
                />
            </div>

            <div className="input-control">
                <DatePicker
                    selected={paymentDate}
                    dateFormat={"dd/MM/yyyy"}
                    placeholderText="Select Payment Date"
                    onChange={(date) => setInputState({ ...inputState, paymentDate: date })}
                />
            </div>

            <div className="submit-btn">
                <Button 
                    name={'Add Salary'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'#fff'}
                />
            </div>
        </FormStyled>
    );
}

const FormStyled = styled.form`
     display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 350px; /* Keep form compact */
    gap: 1rem;
    margin-left: 5px;
    padding: 1rem;
    align-items: flex-start; /* Align everything to the left */

    input, textarea, select {
        font-family: inherit;
        font-size: 0.85rem;
        outline: none;
        padding: 0.6rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        background: #fff;
        resize: none;
        color: rgba(34, 34, 96, 0.9);
        width: 100%; /* Ensure consistent size */
        
        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }
    }

    .input-control {
        width: 100%;
        input {
            width: 100%;
        }
    }

    .submit-btn {
        width: 100%;
        display: flex;
        justify-content: center; /* Center the button */

        button {
            width: 200px; 
            padding: 0.6rem;
            font-size: 0.9rem;
            transition: all 0.3s ease-in-out;
            box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.06);
            border-radius: 8px;
              gap: 1.6rem;
            &:hover {
                background: var(--color-green) !important;
            }
    }
`;

export default SalaryForm;