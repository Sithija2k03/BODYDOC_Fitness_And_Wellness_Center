import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import Button from '../Button/Button';
import { plus } from '../../utils/icons';

function EquipmentForm({ onClose }) {
    const { addGymEquipment, error: globalError, setError: setGlobalError } = useGlobalContext();
    

    const [inputState, setInputState] = useState({
        equipmentId: '',
        equipmentName: '',
        equipmentCategory: '',
        lastMaintenanceDate: ''
    });


    const [errors, setErrors] = useState({
        equipmentId: '',
        equipmentName: '',
        equipmentCategory: '',
        lastMaintenanceDate: ''
    });

    const {
        equipmentId,
        equipmentName,
        equipmentCategory,
        lastMaintenanceDate
    } = inputState;


    // Validation functions
    const validateEquipmentId = (value) => {
        if (!value) return "Equipment ID is required";
        if (!/^\d+$/.test(value)) return "Equipment ID must be a positive integer";
        return "";
    };

    const validateNameOrCategory = (value, fieldName) => {
        if (!value) return `${fieldName} is required`;
        if (value.length > 50) return `${fieldName} cannot exceed 50 characters`;
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) return `${fieldName} can only contain letters, numbers, and spaces`;
        return "";
    };

    const validateDate = (value) => {
        if (!value) return "Last Maintenance Date is required";
        const selectedDate = new Date(value);
        const currentDate = new Date('2025-04-24'); // Current date: April 24, 2025
        const minDate = new Date('2020-04-24'); // 5 years ago
        if (isNaN(selectedDate.getTime())) return "Invalid date format";
        if (selectedDate > currentDate) return "Date cannot be in the future";
        if (selectedDate < minDate) return "Date must be within the last 5 years";
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
        if (name === 'equipmentId') {
            error = validateEquipmentId(value);
        } else if (name === 'equipmentName') {
            error = validateNameOrCategory(value, "Equipment Name");
        } else if (name === 'equipmentCategory') {
            error = validateNameOrCategory(value, "Category");
        } else if (name === 'lastMaintenanceDate') {
            error = validateDate(value);
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
        setGlobalError(''); // Clear global error on input change
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {
            equipmentId: validateEquipmentId(equipmentId),
            equipmentName: validateNameOrCategory(equipmentName, "Equipment Name"),
            equipmentCategory: validateNameOrCategory(equipmentCategory, "Category"),
            lastMaintenanceDate: validateDate(lastMaintenanceDate)
        };

        setErrors(newErrors);

        // Check if any errors exist
        if (Object.values(newErrors).some(error => error)) {
            alert("Please fix the errors before submitting.");
            return;
        // Validate that all fields are filled
        for (let key in inputState) {
            if (inputState[key] === '') {
                alert("Please fill all fields before submitting.");
                return;
            }
        }

        const payload = {
            equipmentId: Number(equipmentId),
            equipmentName,
            equipmentCategory,
            lastMaintenanceDate: new Date(lastMaintenanceDate).toISOString()
        };

        try {
            await addGymEquipment(payload);
            onClose && onClose();
            setInputState({
                equipmentId: '',
                equipmentName: '',
                equipmentCategory: '',
                lastMaintenanceDate: ''
            });
            setErrors({
                equipmentId: '',
                equipmentName: '',
                equipmentCategory: '',
                lastMaintenanceDate: ''
            });
        } catch (err) {
            setGlobalError(err.response?.data?.error || "Failed to add gym equipment");
        } 
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
            {globalError && <p className="error">{globalError}</p>}
            <div className="input-group">
                <input
                    type="number"
                    value={equipmentId}
                    placeholder="Equipment ID"
                    onChange={handleInput('equipmentId')}
                />
                {errors.equipmentId && <p className="error">{errors.equipmentId}</p>}
            </div>
            <div className="input-group">
                <input
                    type="text"
                    value={equipmentName}
                    placeholder="Equipment Name"
                    onChange={handleInput('equipmentName')}
                />
                {errors.equipmentName && <p className="error">{errors.equipmentName}</p>}
            </div>
            <div className="input-group">
                <input
                    type="text"
                    value={equipmentCategory}
                    placeholder="Category"
                    onChange={handleInput('equipmentCategory')}
                />
                {errors.equipmentCategory && <p className="error">{errors.equipmentCategory}</p>}
            </div>
            <div className="input-group">
                <input
                    type="date"
                    value={lastMaintenanceDate}
                    placeholder="Last Maintenance Date"
                    onChange={handleInput('lastMaintenanceDate')}
                    min="2020-04-24"
                    max="2025-04-24"
                />
                {errors.lastMaintenanceDate && <p className="error">{errors.lastMaintenanceDate}</p>}
            </div>
            {error && <p className="error">{error}</p>}
            <input
                type="number"
                value={equipmentId}
                placeholder="Equipment ID"
                onChange={handleInput('equipmentId')}
            />
            <input
                type="text"
                value={equipmentName}
                placeholder="Equipment Name"
                onChange={handleInput('equipmentName')}
            />
            <input
                type="text"
                value={equipmentCategory}
                placeholder="Category"
                onChange={handleInput('equipmentCategory')}
            />
            <input
                type="date"
                value={lastMaintenanceDate}
                placeholder="Last Maintenance Date"
                onChange={handleInput('lastMaintenanceDate')}
            />

            <div className="submit-btn">
                <Button
                    name={'Add Equipment'}
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

    .error {
        color: red;
        font-size: 0.85rem;
        margin: 0;
    }
`;

export default EquipmentForm;