import React from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";
import Button from '../Button/Button'
import {plus} from '../../utils/icons' 

function Form() {
    const { addIncome, getIncomes } = useGlobalContext();  

    const [inputState, setInputState] = React.useState({
        title: "",
        amount: "",
        date: null,
        category: "",
        description: "",
    });

    const { title, amount, date, category, description } = inputState;

    const handleInput = (name) => (e) => {
        setInputState({
            ...inputState,
            [name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title || !amount || !date || !category || !description) {
            alert("Please fill all fields before submitting.");
            return;
        }

        addIncome(inputState); 
        getIncomes(); // after adding income, fetch all incomes again
        setInputState({
            title: "",
            amount: "",
            date: null,
            category: "",
            description: "",
        })
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            <div className="input-control">
                <input 
                    type="text" 
                    value={title}
                    name="title"
                    placeholder="Income Title"
                    onChange={handleInput("title")}
                />
            </div>

            <div className="input-control">
                <input 
                    type="number" 
                    value={amount}
                    name="amount"
                    placeholder="Income amount"
                    onChange={handleInput("amount")}
                />
            </div>

            <div className="input-control">
                <DatePicker
                    selected={date}
                    dateFormat={"dd/MM/yyyy"}
                    placeholderText="Select Date"
                    onChange={(date) => setInputState({ ...inputState, date })}
                />
            </div>

            <div className="selects">
                <select value={category} name="category" onChange={handleInput("category")}>
                    <option value="" disabled>--Select Category--</option>
                    <option value="Memberships">Memberships</option>
                    <option value="Gym/Yoga">Gym/Yoga Session Booking</option>
                    <option value="Swimming Pool">Swimming Pool Booking</option>
                    <option value="Badminton Court Booking">Badminton Court Booking</option>
                    <option value="Pool Lounge Booking">Pool Lounge Booking</option>
                    <option value="Medicare & E-Pharmacy">Medicare & E-Pharmacy</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="input-control">
                <textarea 
                    value={description}
                    name="description"
                    cols={30}
                    rows={4}
                    placeholder="Income description"
                    onChange={handleInput("description")}
                ></textarea>
            </div>

            <div className="submit-btn">
                <Button 
                    name={'Add Income'}
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

    .selects {
        display: flex;
        justify-content: flex-start;
        width: 100%;
        
        select {
            width: 100%;
            color: rgba(34, 34, 96, 0.4);
            
            &:focus, &:active {
                color: rgba(34, 34, 96, 1);
            }
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
    }
`;



export default Form;