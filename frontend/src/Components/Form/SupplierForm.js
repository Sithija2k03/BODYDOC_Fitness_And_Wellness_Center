import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import Button from '../Button/Button';
import { plus } from '../../utils/icons';

function SupplierForm() {
    const { addSupplier, getSuppliers, error: globalError, setError: setGlobalError } = useGlobalContext();

    const [inputState, setInputState] = useState({
        supplier_id: "",
        supplier_name: "",
        contact: "",
        credits: "",
        supplyCategory: ""
    });

    const [errors, setErrors] = useState({
        supplier_id: "",
        supplier_name: "",
        contact: "",
        credits: "",
        supplyCategory: ""
    });

    const { supplier_id, supplier_name, contact, credits, supplyCategory } = inputState;

    // Validation functions
    const validatePositiveInteger = (value, fieldName) => {
        if (!value) return `${fieldName} is required`;
        if (!/^\d+$/.test(value)) return `${fieldName} must be a positive integer`;
        return "";
    };

    const validateName = (value, fieldName) => {
        if (!value) return `${fieldName} is required`;
        if (value.length > 50) return `${fieldName} cannot exceed 50 characters`;
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) return `${fieldName} can only contain letters, numbers, and spaces`;
        return "";
    };

    const validateContact = (value) => {
        if (!value) return "Contact is required";
        if (value.length > 100) return "Contact cannot exceed 100 characters";
        const phoneRegex = /^\+?[\d\s-]{10,15}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!phoneRegex.test(value) && !emailRegex.test(value)) {
            return "Contact must be a valid phone number or email";
        }
        return "";
    };

    const validateCredits = (value) => {
        if (!value) return "Credits is required";
        if (!/^\d+(\.\d{1,2})?$/.test(value)) return "Credits must be a positive number with up to 2 decimal places";
        const numValue = parseFloat(value);
        if (numValue < 0) return "Credits cannot be negative";
        if (numValue > 1000000) return "Credits cannot exceed 1,000,000";
        return "";
    };

    const validateSupplyCategory = (value) => {
        if (!value) return "Supply Category is required";
        if (!["pharmacy", "gym", "both"].includes(value)) return "Invalid Supply Category";
        return "";
    };

    const handleInput = (name) => (e) => {
        const value = e.target.value;
        setInputState({ ...inputState, [name]: value });

        // Validate input on change
        let error = "";
        if (name === "supplier_id") {
            error = validatePositiveInteger(value, "Supplier ID");
        } else if (name === "supplier_name") {
            error = validateName(value, "Supplier Name");
        } else if (name === "contact") {
            error = validateContact(value);
        } else if (name === "credits") {
            error = validateCredits(value);
        } else if (name === "supplyCategory") {
            error = validateSupplyCategory(value);
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
        setGlobalError(""); // Clear global error
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {
            supplier_id: validatePositiveInteger(supplier_id, "Supplier ID"),
            supplier_name: validateName(supplier_name, "Supplier Name"),
            contact: validateContact(contact),
            credits: validateCredits(credits),
            supplyCategory: validateSupplyCategory(supplyCategory)
        };

        setErrors(newErrors);

        // Check if any errors exist
        if (Object.values(newErrors).some(error => error)) {
            alert("Please fix the errors before submitting.");
            return;
        }

        const payload = {
            supplier_id: Number(supplier_id),
            supplier_name,
            contact,
            credits: parseFloat(credits),
            supplyCategory
        };

        try {
            await addSupplier(payload);
            await getSuppliers();
            setInputState({
                supplier_id: "",
                supplier_name: "",
                contact: "",
                credits: "",
                supplyCategory: ""
            });
            setErrors({
                supplier_id: "",
                supplier_name: "",
                contact: "",
                credits: "",
                supplyCategory: ""
            });
        } catch (err) {
            setGlobalError(err.response?.data?.error || "Failed to add supplier");
        }
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            {globalError && <p className="error global-error">{globalError}</p>}
            <div className="input-control">
                <input
                    type="number"
                    value={supplier_id}
                    name="supplier_id"
                    placeholder="Supplier ID"
                    onChange={handleInput("supplier_id")}
                    min="1"
                />
                {errors.supplier_id && <p className="error">{errors.supplier_id}</p>}
            </div>
            <div className="input-control">
                <input
                    type="text"
                    value={supplier_name}
                    name="supplier_name"
                    placeholder="Supplier Name"
                    onChange={handleInput("supplier_name")}
                />
                {errors.supplier_name && <p className="error">{errors.supplier_name}</p>}
            </div>
            <div className="input-control">
                <input
                    type="text"
                    value={contact}
                    name="contact"
                    placeholder="Contact (e.g., phone or email)"
                    onChange={handleInput("contact")}
                />
                {errors.contact && <p className="error">{errors.contact}</p>}
            </div>
            <div className="input-control">
                <input
                    type="number"
                    value={credits}
                    name="credits"
                    placeholder="Credits"
                    step="0.01"
                    onChange={handleInput("credits")}
                    min="0"
                    max="1000000"
                />
                {errors.credits && <p className="error">{errors.credits}</p>}
            </div>
            <div className="selects">
                <select
                    value={supplyCategory}
                    name="supplyCategory"
                    onChange={handleInput("supplyCategory")}
                >
                    <option value="" disabled>--Select Supply Category--</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="gym">Gym</option>
                    <option value="both">Both</option>
                </select>
                {errors.supplyCategory && <p className="error">{errors.supplyCategory}</p>}
            </div>
            <div className="submit-btn">
                <Button
                    name={'Add Supplier'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'#F56692'}
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
    max-width: 350px;
    gap: 1rem;
    margin-left: 5px;
    padding: 1rem;
    align-items: flex-start;

    .input-control, .selects {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    input, select {
        font-family: inherit;
        font-size: 0.85rem;
        outline: none;
        padding: 0.6rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        background: #fff;
        color: rgba(34, 34, 96, 0.9);
        width: 100%;

        &::placeholder {
            color: rgba(34, 34, 96, 0.4);
        }

        &[type="number"]::-webkit-inner-spin-button,
        &[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        &[type="number"] {
            -moz-appearance: textfield;
        }
    }

    select {
        color: rgba(34, 34, 96, 0.4);

        &:focus, &:active, option:checked {
            color: rgba(34, 34, 96, 1);
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

export default SupplierForm;