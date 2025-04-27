import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import Button from '../Button/Button';
import { plus } from '../../utils/icons';

function PharmacyForm({ onClose }) {
    const { addPharmacyItem, error: globalError, setError: setGlobalError } = useGlobalContext();

    const [inputState, setInputState] = useState({
        itemNumber: '',
        itemName: '',
        itemCategory: '',
        availableStockQty: '',
        reorderLevel: '',
        orderQty: '',
        unitPrice: '',
        supplierName: '',
        supplierId: ''
    });

    const [errors, setErrors] = useState({ ...inputState });

    const {
        itemNumber, itemName, itemCategory, availableStockQty,
        reorderLevel, orderQty, unitPrice, supplierName, supplierId
    } = inputState;

    // Validation functions
    const validatePositiveInteger = (value, fieldName, min = 0, max = Infinity) => {
        if (!value) return `${fieldName} is required`;
        if (!/^\d+$/.test(value)) return `${fieldName} must be a positive integer`;
        const numValue = Number(value);
        if (numValue < min) return `${fieldName} cannot be less than ${min}`;
        if (numValue > max) return `${fieldName} cannot exceed ${max}`;
        return "";
    };

    const validateNameOrCategory = (value, fieldName) => {
        if (!value) return `${fieldName} is required`;
        if (value.length > 50) return `${fieldName} cannot exceed 50 characters`;
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) return `${fieldName} can only contain letters, numbers, and spaces`;
        return "";
    };

    const validateUnitPrice = (value) => {
        if (!value) return "Unit Price is required";
        if (!/^\d+(\.\d{1,2})?$/.test(value)) return "Unit Price must be a positive number with up to 2 decimal places";
        const numValue = parseFloat(value);
        if (numValue < 0.01) return "Unit Price must be at least 0.01";
        if (numValue > 10000) return "Unit Price cannot exceed 10,000";
        return "";
    };

    const handleInput = (name) => (e) => {
        const value = e.target.value;
        setInputState(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate input on change
        let error = '';
        if (name === 'itemNumber') {
            error = validatePositiveInteger(value, "Item Number", 1);
        } else if (name === 'itemName') {
            error = validateNameOrCategory(value, "Item Name");
        } else if (name === 'itemCategory') {
            error = validateNameOrCategory(value, "Category");
        } else if (name === 'availableStockQty') {
            error = validatePositiveInteger(value, "Available Stock Quantity", 0, 100000);
        } else if (name === 'reorderLevel') {
            error = validatePositiveInteger(value, "Reorder Level", 0, 10000);
        } else if (name === 'orderQty') {
            error = validatePositiveInteger(value, "Order Quantity", 1, 10000);
        } else if (name === 'unitPrice') {
            error = validateUnitPrice(value);
        } else if (name === 'supplierName') {
            error = validateNameOrCategory(value, "Supplier Name");
        } else if (name === 'supplierId') {
            error = validatePositiveInteger(value, "Supplier ID", 1);
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
        setGlobalError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {
            itemNumber: validatePositiveInteger(itemNumber, "Item Number", 1),
            itemName: validateNameOrCategory(itemName, "Item Name"),
            itemCategory: validateNameOrCategory(itemCategory, "Category"),
            availableStockQty: validatePositiveInteger(availableStockQty, "Available Stock Quantity", 0, 100000),
            reorderLevel: validatePositiveInteger(reorderLevel, "Reorder Level", 0, 10000),
            orderQty: validatePositiveInteger(orderQty, "Order Quantity", 1, 10000),
            unitPrice: validateUnitPrice(unitPrice),
            supplierName: validateNameOrCategory(supplierName, "Supplier Name"),
            supplierId: validatePositiveInteger(supplierId, "Supplier ID", 1)
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            alert("Please fix the errors before submitting.");
            return;
        }

        for (let key in inputState) {
            if (inputState[key] === '') {
                alert("Please fill all fields before submitting.");
                return;
            }
        }

        const payload = {
            itemNumber: Number(itemNumber),
            itemName,
            itemCategory,
            availableStockQty: Number(availableStockQty),
            reorderLevel: Number(reorderLevel),
            orderQty: Number(orderQty),
            unitPrice: parseFloat(unitPrice),
            supplierName,
            supplierId: Number(supplierId)
        };

        try {
            await addPharmacyItem(payload);
            onClose && onClose();

            setInputState({
                itemNumber: '',
                itemName: '',
                itemCategory: '',
                availableStockQty: '',
                reorderLevel: '',
                orderQty: '',
                unitPrice: '',
                supplierName: '',
                supplierId: ''
            });

            setErrors({
                itemNumber: '',
                itemName: '',
                itemCategory: '',
                availableStockQty: '',
                reorderLevel: '',
                orderQty: '',
                unitPrice: '',
                supplierName: '',
                supplierId: ''
            });
        } catch (err) {
            setGlobalError(err.response?.data?.error || "Failed to add pharmacy item");
        }
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            {globalError && <p className="error global-error">{globalError}</p>}
            {Object.keys(inputState).map((field) => (
                <div className="input-group" key={field}>
                    <input
                        type={field === "unitPrice" ? "number" : field.toLowerCase().includes("id") || field.toLowerCase().includes("qty") || field.toLowerCase().includes("level") || field === "itemNumber" ? "number" : "text"}
                        step={field === "unitPrice" ? "0.01" : "1"}
                        value={inputState[field]}
                        placeholder={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        onChange={handleInput(field)}
                        min={field === "unitPrice" ? "0.01" : "0"}
                    />
                    {errors[field] && <p className="error">{errors[field]}</p>}
                </div>
            ))}

            <div className="submit-btn">
                <Button
                    name={'Add Item'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'#6C63FF'}
                    color={'#fff'}
                />
            </div>
        </FormStyled>
    );
}

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;

    .input-group {
        display: flex;
        flex-direction: column;
    }

    input {
        padding: 0.8rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        outline: none;
    }

    .error {
        color: red;
        font-size: 0.85rem;
        margin-top: 0.25rem;
    }

    .submit-btn {
        margin-top: 1rem;
    }
`;

export default PharmacyForm;
