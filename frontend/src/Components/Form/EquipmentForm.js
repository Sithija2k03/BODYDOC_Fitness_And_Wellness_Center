import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import Button from '../Button/Button';
import { plus } from '../../utils/icons';

function EquipmentForm({ onClose }) {
    const { addGymEquipment, error, setError } = useGlobalContext();

    const [inputState, setInputState] = useState({
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

    const handleInput = (name) => (e) => {
        const value = e.target.value;
        setInputState(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        } catch (err) {
            setError("Failed to add gym equipment");
        }
    };

    return (
        <FormStyled onSubmit={handleSubmit}>
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

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    gap: 1rem;
    margin-left: 5px;
    padding: 1rem;
    align-items: flex-start;

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