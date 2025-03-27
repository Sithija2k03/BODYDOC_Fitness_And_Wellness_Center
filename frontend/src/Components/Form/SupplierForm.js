import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import Button from '../Button/Button'; // Adjust path if needed
import { plus } from '../../utils/icons';

function SupplierForm() {
    const { addSupplier, getSuppliers, error, setError } = useGlobalContext();

    const [inputState, setInputState] = useState({
        supplier_id: "",
        supplier_name: "",
        contact: "",
        credits: "",
        supplyCategory: "",
    });

    const { supplier_id, supplier_name, contact, credits, supplyCategory } = inputState;

    const handleInput = (name) => (e) => {
        setInputState({ ...inputState, [name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!supplier_id || !supplier_name || !contact || !credits || !supplyCategory) {
            alert("Please fill all fields before submitting.");
            return;
        }

        if (parseFloat(supplier_id) <= 0 || parseFloat(credits) < 0) {
            alert("Supplier ID must be a positive number, and Credits must be non-negative.");
            return;
        }

        const payload = {
            supplier_id: parseFloat(supplier_id),
            supplier_name,
            contact,
            credits: parseFloat(credits),
            supplyCategory,
        };

        try {
            await addSupplier(payload);
            await getSuppliers(); // Fetch suppliers only after successful addition
            setInputState({ supplier_id: "", supplier_name: "", contact: "", credits: "", supplyCategory: "" });
        } catch (error) {
            setError("Failed to add supplier");
        }
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <div className="input-control">
                <input type="number" value={supplier_id} name="supplier_id" placeholder="Supplier ID" onChange={handleInput("supplier_id")} />
            </div>
            <div className="input-control">
                <input type="text" value={supplier_name} name="supplier_name" placeholder="Supplier Name" onChange={handleInput("supplier_name")} />
            </div>
            <div className="input-control">
                <input type="text" value={contact} name="contact" placeholder="Contact (e.g., phone or email)" onChange={handleInput("contact")} />
            </div>
            <div className="input-control">
                <input type="number" value={credits} name="credits" placeholder="Credits" step="0.01" onChange={handleInput("credits")} />
            </div>
            <div className="selects">
                <select value={supplyCategory} name="supplyCategory" onChange={handleInput("supplyCategory")}>
                    <option value="" disabled>--Select Supply Category--</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="gym">Gym</option>
                    <option value="both">Both</option>
                </select>
            </div>
            <div className="submit-btn">
                <Button name={'Add Supplier'} icon={plus} bPad={'.8rem 1.6rem'} bRad={'30px'} bg={'var(--color-accent)'} color={'#fff'} />
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

    .error {
        color: red;
        font-size: 0.85rem;
        margin: 0;
    }
`;

export default SupplierForm;
