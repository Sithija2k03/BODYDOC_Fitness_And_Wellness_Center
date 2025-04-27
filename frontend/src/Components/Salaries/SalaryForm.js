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
        role: "",
        allowances: "",
        deductions: "",
        otHours: "",
        otRate: "1.5",   // Default OT Rate
        epfRate: "8",     // Default EPF Rate
        etfRate: "3",     // Default ETF Rate
        paymentDate: null,
        status: "Pending",
    });

    // State for employee data (fetched from the database)
    const [employeeData, setEmployeeData] = useState({
        employeeId: "",
        basicSalary: 0,
        netSalary: 0,
    });

    // State for tracking error messages
    const [error, setError] = useState("");

    const { role, allowances, deductions, otHours, otRate, epfRate, etfRate, paymentDate, status } = inputState;

    useEffect(() => {
        if (role) {
            const fetchEmployeeData = async () => {
                try {
                    const employee = await getEmployeeByRole(role);
                    if (employee) {
                        setEmployeeData({
                            employeeId: employee._id,
                            basicSalary: employee.basicSalary,
                            netSalary: calculateNetSalary(employee.basicSalary, allowances, deductions, otHours, otRate, epfRate, etfRate),
                        });
                    }
                } catch (error) {
                    console.error("Error fetching employee data:", error);
                }
            };

            fetchEmployeeData();
        }
    }, [role, allowances, deductions, otHours, otRate, epfRate, etfRate]);

    const calculateNetSalary = (basicSalary, allowances, deductions, otHours, otRate, epfRate, etfRate) => {
        const otPay = parseFloat(otHours || 0) * parseFloat(otRate || 1.5) * (basicSalary / 240);
        const epf = (parseFloat(epfRate) / 100) * basicSalary;
        const etf = (parseFloat(etfRate) / 100) * basicSalary;
        return basicSalary + parseFloat(allowances || 0) + otPay - (parseFloat(deductions || 0) + epf + etf);
    };

    const handleInput = (name) => (e) => {
        setInputState({
            ...inputState,
            [name]: e.target.value,
        });
    };

    const validatePaymentDate = (date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Remove time to compare only dates

        const maxPastDate = new Date();
        maxPastDate.setDate(today.getDate() - 7); // Get the date 7 days ago

        if (new Date(date) > today) {
            setError("Payment date cannot be in the future.");
            return false;
        }

        if (new Date(date) < maxPastDate) {
            setError("Payment date cannot be older than 7 days.");
            return false;
        }

        setError(""); // Clear error if the date is valid
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields before submitting
        if (!role || !allowances || !deductions || !paymentDate || !otHours || !otRate || !epfRate || !etfRate) {
            alert("Please fill all fields before submitting.");
            return;
        }

        // Ensure numerical fields are positive
        if (parseFloat(allowances) < 0 || parseFloat(deductions) < 0 || parseFloat(otHours) < 0 || parseFloat(otRate) <= 0 || parseFloat(epfRate) < 0 || parseFloat(etfRate) < 0) {
            alert("Please ensure all numerical values are positive.");
            return;
        }

        // Ensure paymentDate is not in the future and within the past week
        if (error) {
            alert(error); // If there's an error message, alert it
            return;
        }

        const newSalary = {
            role,
            allowances: parseFloat(allowances),
            deductions: parseFloat(deductions),
            otHours: parseFloat(otHours),
            otRate: parseFloat(otRate),
            epfRate: parseFloat(epfRate),
            etfRate: parseFloat(etfRate),
            paymentDate,
            status,
        };

        try {
            await addSalary(newSalary);
            getSalaries();
            alert("Salary added successfully!");

            setInputState({
                role: "",
                allowances: "",
                deductions: "",
                otHours: "",
                otRate: "1.5",
                epfRate: "8",
                etfRate: "3",
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
                <select value={role} name="role" onChange={handleInput("role")}>
                    <option value="" disabled>Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="trainer">Trainer</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="receiptionist">Receptionist</option>
                    <option value="member">Member</option>
                </select>
            </div>

            <div className="input-control">
                <input type="number" value={allowances} name="allowances" placeholder="Allowances" onChange={handleInput("allowances")} />
            </div>

            <div className="input-control">
                <input type="number" value={deductions} name="deductions" placeholder="Deductions" onChange={handleInput("deductions")} />
            </div>

            {/* OT Hours & OT Rate */}
            <div className="input-control">
                <input type="number" value={otHours} name="otHours" placeholder="OT Hours" onChange={handleInput("otHours")} />
            </div>

            <div className="input-control">
                <input type="number" value={otRate} name="otRate" placeholder="OT Rate (default 1.5)" onChange={handleInput("otRate")} />
            </div>

            {/* EPF & ETF Rates */}
            <div className="input-control">
                <input type="number" value={epfRate} name="epfRate" placeholder="EPF Rate (%)" onChange={handleInput("epfRate")} />
            </div>

            <div className="input-control">
                <input type="number" value={etfRate} name="etfRate" placeholder="ETF Rate (%)" onChange={handleInput("etfRate")} />
            </div>

            <div className="input-control">
                <DatePicker 
                    selected={paymentDate} 
                    dateFormat={"dd/MM/yyyy"} 
                    placeholderText="Select Payment Date" 
                    onChange={(date) => {
                        setInputState({ ...inputState, paymentDate: date });
                        validatePaymentDate(date);  // Validate the date whenever it's changed
                    }} 
                />
                {error && <ErrorMessage>{error}</ErrorMessage>} {/* Show error message if any */}
            </div>

            <div className="submit-btn">
                <Button name={'Add Salary'} icon={plus} bPad={'.8rem 1.6rem'} bRad={'30px'} bg={'#F56692'} color={'#fff'} />
            </div>
        </FormStyled>
    );
}

const FormStyled = styled.form`
     display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 350px;
    gap: 1rem;
    margin-left: 5px;
    padding: 1rem;
    align-items: flex-start;

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
        width: 100%;
        
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
        justify-content: center;

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
    }
`;

const ErrorMessage = styled.p`
    color: #FF4C4C;
    font-size: 0.8rem;
    margin-top: 0.5rem;
`;

export default SalaryForm;
