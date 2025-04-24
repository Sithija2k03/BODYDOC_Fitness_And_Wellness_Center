import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/globalContext';
import styled from 'styled-components';
import Button from '../Button/Button';

function EditSupplier() {
    const { supplierId } = useParams();
    const navigate = useNavigate();
    const { suppliers, updateSupplier, getSuppliers, loading, error: globalError, setError } = useGlobalContext();

    const [supplier, setSupplier] = useState({
        supplier_id: '',
        supplier_name: '',
        contact: '',
        credits: '',
        supplyCategory: ''
    });

    const [errors, setErrors] = useState({
        supplier_name: '',
        contact: '',
        credits: '',
        supplyCategory: ''
    });

    // Fetch suppliers if not loaded
    useEffect(() => {
        if (suppliers.length === 0) {
            getSuppliers();
        }
    }, [suppliers, getSuppliers]);

    // Update form when supplierId or suppliers change
    useEffect(() => {
        console.log('Suppliers:', suppliers);
        console.log('Supplier ID from URL:', supplierId);

        if (suppliers.length > 0 && supplierId) {
            const foundSupplier = suppliers.find(s =>
                s.supplier_id.toString() === supplierId.toString() ||
                s.manual_id?.toString() === supplierId.toString()
            );

            console.log('Found Supplier:', foundSupplier);

            if (foundSupplier) {
                setSupplier({
                    supplier_id: foundSupplier.supplier_id,
                    supplier_name: foundSupplier.supplier_name,
                    contact: foundSupplier.contact,
                    credits: foundSupplier.credits.toString(),
                    supplyCategory: foundSupplier.supplyCategory || 'both' // Default for backward compatibility
                });
            } else {
                console.error('Supplier not found for ID:', supplierId);
                setError('Supplier not found');
            }
        }
    }, [suppliers, supplierId, setError]);

    // Validation functions
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSupplier({ ...supplier, [name]: value });

        // Validate input on change
        let error = '';
        if (name === 'supplier_name') {
            error = validateName(value, "Supplier Name");
        } else if (name === 'contact') {
            error = validateContact(value);
        } else if (name === 'credits') {
            error = validateCredits(value);
        } else if (name === 'supplyCategory') {
            error = validateSupplyCategory(value);
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {
            supplier_name: validateName(supplier.supplier_name, "Supplier Name"),
            contact: validateContact(supplier.contact),
            credits: validateCredits(supplier.credits),
            supplyCategory: validateSupplyCategory(supplier.supplyCategory)
        };

        setErrors(newErrors);

        // Check if any errors exist
        if (Object.values(newErrors).some(err => err)) {
            alert("Please fix the errors before submitting.");
            return;
        }

        // Ensure correct supplier ID
        const correctId = supplier.supplier_id || supplierId;
        if (!correctId || !/^\d+$/.test(correctId)) {
            setError("Invalid supplier ID");
            return;
        }

        const payload = {
            supplier_id: Number(correctId),
            supplier_name: supplier.supplier_name,
            contact: supplier.contact,
            credits: parseFloat(supplier.credits),
            supplyCategory: supplier.supplyCategory
        };

        try {
            await updateSupplier(correctId, payload);
            navigate('/admin/Supplier');
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update supplier");
        }
    };

    // Show loading state
    if (loading) {
        return <div>Loading suppliers...</div>;
    }

    // Handle errors
    if (globalError) {
        return <div>Error: {globalError}</div>;
    }

    return (
        <EditSupplierStyled>
            <h2>Edit Supplier Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Supplier Name</label>
                    <input
                        type="text"
                        name="supplier_name"
                        value={supplier.supplier_name}
                        onChange={handleChange}
                        required
                    />
                    {errors.supplier_name && <p className="error">{errors.supplier_name}</p>}
                </div>

                <div className="input-group">
                    <label>Contact</label>
                    <input
                        type="text"
                        name="contact"
                        value={supplier.contact}
                        onChange={handleChange}
                        required
                    />
                    {errors.contact && <p className="error">{errors.contact}</p>}
                </div>

                <div className="input-group">
                    <label>Credits</label>
                    <input
                        type="number"
                        name="credits"
                        value={supplier.credits}
                        onChange={handleChange}
                        required
                        step="0.01"
                        min="0"
                        max="1000000"
                    />
                    {errors.credits && <p className="error">{errors.credits}</p>}
                </div>

                <div className="input-group">
                    <label>Supply Category</label>
                    <select
                        name="supplyCategory"
                        value={supplier.supplyCategory}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>--Select Supply Category--</option>
                        <option value="pharmacy">Pharmacy</option>
                        <option value="gym">Gym</option>
                        <option value="both">Both</option>
                    </select>
                    {errors.supplyCategory && <p className="error">{errors.supplyCategory}</p>}
                </div>

                <Button type="submit" name="Update Supplier" />
                <Button
                    type="button"
                    name="Cancel"
                    bg="#ccc"
                    color="#000"
                    onClick={() => navigate('/admin/Supplier')}
                />
            </form>
        </EditSupplierStyled>
    );
}

const EditSupplierStyled = styled.div`
    max-width: 500px;
    margin: auto;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

    h2 {
        text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        margin-top: 10px;
    }

    label {
        font-weight: 500;
    }

    input, select {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 0.9rem;
    }

    select {
        color: rgba(34, 34, 96, 0.9);
        &:invalid {
            color: rgba(34, 34, 96, 0.4);
        }
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type="number"] {
        -moz-appearance: textfield;
    }

    button {
        margin-top: 20px;
        padding: 10px;
        border-radius: 5px;
    }

    
`;

export default EditSupplier;