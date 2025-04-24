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

    const [errors, setErrors] = useState({
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
        setGlobalError(''); // Clear global error
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

        // Check if any errors exist
        if (Object.values(newErrors).some(error => error)) {
            alert("Please fix the errors before submitting.");
            return;
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
            <div className="input-group">
                <input
                    type="number"
                    value={itemNumber}
                    placeholder="Item Number"
                    onChange={handleInput('itemNumber')}
                    min="1"
                />
                {errors.itemNumber && <p className="error">{errors.itemNumber}</p>}
            </div>
            <div className="input-group">
                <input
                    type="text"
                    value={itemName}
                    placeholder="Item Name"
                    onChange={handleInput('itemName')}
                />
                {errors.itemName && <p className="error">{errors.itemName}</p>}
            </div>
            <div className="input-group">
                <input
                    type="text"
                    value={itemCategory}
                    placeholder="Category"
                    onChange={handleInput('itemCategory')}
                />
                {errors.itemCategory && <p className="error">{errors.itemCategory}</p>}
            </div>
            <div className="input-group">
                <input
                    type="number"
                    value={availableStockQty}
                    placeholder="Available Stock Qty"
                    onChange={handleInput('availableStockQty')}
                    min="0"
                    max="100000"
                />
                {errors.availableStockQty && <p className="error">{errors.availableStockQty}</p>}
            </div>
            <div className="input-group">
                <input
                    type="number"
                    value={reorderLevel}
                    placeholder="Reorder Level"
                    onChange={handleInput('reorderLevel')}
                    min="0"
                    max="10000"
                />
                {errors.reorderLevel && <p className="error">{errors.reorderLevel}</p>}
            </div>
            <div className="input-group">
                <input
                    type="number"
                    value={orderQty}
                    placeholder="Order Quantity"
                    onChange={handleInput('orderQty')}
                    min="1"
                    max="10000"
                />
                {errors.orderQty && <p className="error">{errors.orderQty}</p>}
            </div>
            <div className="input-group">
                <input
                    type="number"
                    value={unitPrice}
                    placeholder="Unit Price"
                    step="0.01"
                    onChange={handleInput('unitPrice')}
                    min="0.01"
                    max="10000"
                />
                {errors.unitPrice && <p className="error">{errors.unitPrice}</p>}
            </div>
            <div className="input-group">
                <input
                    type="text"
                    value={supplierName}
                    placeholder="Supplier Name"
                    onChange={handleInput('supplierName')}
                />
                {errors.supplierName && <p className="error">{errors.supplierName}</p>}
            </div>
            <div className="input-group">
                <input
                    type="number"
                    value={supplierId}
                    placeholder="Supplier ID"
                    onChange={handleInput('supplierId')}
                    min="1"
                />
                {errors.supplierId && <p className="error">{errors.supplierId}</p>}
            </div>

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
    width: 100%;
    max-width: 400px;
    gap: 1rem;
    margin-left: 5px;
    padding: 1rem;
    align-items: flex-start;

    .input-group {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    input {
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

export default PharmacyForm;