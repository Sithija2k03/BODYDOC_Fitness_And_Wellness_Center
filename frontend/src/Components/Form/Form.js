import React from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGlobalContext } from "../../context/globalContext";

function Form() {

    const addIncome = useGlobalContext();

    const [inputState, setInputState] = React.useState({
        title: "",
        amount: "",
        date: "",
        category:"",
        description:"",
    })

    const {title, amount, date, category, description} = inputState;
   
    const hanleInput = name => e => {
        setInputState({
            ...inputState,
            [name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        addIncome(inputState);
    }
    return (
        <FormStyled onSubmit = {handleSubmit} >
            <div className="input-control">
                <input type="text" 
                value = {title}
                name = {title}
                placeholder="Income Title"
                onChange={hanleInput('title')}
                />
            </div>

            <div className="input-control">
                <input type="text" 
                value = {amount}
                name = {amount}
                id={amount}
                placeholder="Income amount"
                onChange={hanleInput('amount')}
                />
            </div>

            <div className="input-control">
                <DatePicker
                id="date"
                placeholderText="Select Date" 
                selected={date}
                dateFormat={"dd/MM/yyyy"}
                onChange={(date) => setInputState({...inputState, date: date})}
                />
            </div>

            <div className="selects input-control">
                <select required value={category} name="category" id="category" onChange={hanleInput('category')}>
                    <option value="" disabled >--Select Category--</option>
                    <option value="Memberships">Memberships</option>
                    <option value="Gym/Yoga Session Booking">Gym/Yoga Session Booking</option>
                    <option value="Swimming Pool Booking">Swimming Pool Booking</option>
                    <option value="Badminton Court Booking">Badminton Court Booking</option>
                    <option value="Pool Lounge Booking">Pool Lounge Booking</option>
                    <option value="Medicare & E-Pharmacy">Medicare & E-Pharmacy</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="input-control">
                <input type="text" 
                value = {description}
                name = {description}
                id={description}
                placeholder="Income description"
                onChange={hanleInput('description')}
                />
            </div>

            <div className="submit-btn">
                <button type="submit">Add Income</button>
            </div>
        </FormStyled>
    )
}

const FormStyled = styled.form`


`;

export default Form