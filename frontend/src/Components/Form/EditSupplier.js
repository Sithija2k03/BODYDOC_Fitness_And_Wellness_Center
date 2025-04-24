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

    useEffect(() => {
        if (suppliers.length === 0) {
            getSuppliers();
        }
    }, [suppliers, getSuppliers]);

    useEffect(() => {
        if (suppliers.length > 0 && supplierId) {
            const foundSupplier = suppliers.find(s =>
                s.supplier_id.toString() === supplierId.toString() ||
                s.manual_id?.toString() === supplierId.toString()
            );

            if (foundSupplier) {
                setSupplier({
                    supplier_id: foundSupplier.supplier_id,
                    supplier_name: foundSupplier.supplier_name,
                    contact: foundSupplier.contact,
                    credits: foundSupplier.credits.toString(),
                    supplyCategory: foundSupplier.supplyCategory || 'both'
                });
            } else {
                setError('Supplier not found');
            }
        }
    }, [suppliers, supplierId, setError]);

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

        let error = '';
        if (name === 'supplier_name') error = validateName(value, "Supplier Name");
        else if (name === 'contact') error = validateContact(value);
        else if (name === 'credits') error = validateCredits(value);
        else if (name === 'supplyCategory') error = validateSupplyCategory(value);

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {
            supplier_name: validateName(supplier.supplier_name, "Supplier Name"),
            contact: validateContact(supplier.contact),
            credits: validateCredits(supplier.credits),
            supplyCategory: validateSupplyCategory(supplier.supplyCategory)
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(err => err)) {
            alert("Please fix the errors before submitting.");
            return;
        }

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

    if (loading) return <div>Loading suppliers...</div>;
    if (globalError) return <div>Error: {globalError}</div>;

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

    .input-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: bold;
    }

    input, select {
        width: 100%;
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #ccc;
    }

    .error {
        color: red;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
`;

export default EditSupplier;
