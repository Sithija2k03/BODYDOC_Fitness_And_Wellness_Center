import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SupplierForm from '../Form/SupplierForm';
import SupplierItem from './SupplierItem';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Button from '../Button/Button';
import { plus } from '../../utils/icons';
import Modal from '../Modal/Modal'; // Import Modal

function Supplier() {
    const { addSupplier, getSuppliers, suppliers, deleteSupplier, error, success, setSuccess } = useGlobalContext();
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        getSuppliers();
    }, [getSuppliers]);

    // Alert for success message
    useEffect(() => {
        if (success) {
            alert(success); 
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success, setSuccess]);

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    // Ensure suppliers is always an array
    const safeSuppliers = Array.isArray(suppliers) ? suppliers : [];

    return (
        <SupplierStyled>
            <InnerLayout>
                <h1>Suppliers View</h1>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <div className="submit-btn">
                    <Button 
                        name={'Add Supplier'}
                        icon={plus}
                        bPad={'.8rem 1.6rem'}
                        bRad={'30px'}
                        bg={'var(--color-accent)'}
                        color={'#fff'}
                        onClick={openForm} // Open the form in a modal
                    />
                </div>
                <div className='supplier-list'>
                    {safeSuppliers.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Supplier ID</th>
                                    <th>Supplier Name</th>
                                    <th>Contact</th>
                                    <th>Credits</th>
                                    <th>Supply Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {safeSuppliers.map((supplier) => {
                                    const { _id, supplier_id, supplier_name, contact, credits, supplyCategory } = supplier;
                                    return (
                                        <tr key={_id}>
                                            <td>{supplier_id}</td>
                                            <td>{supplier_name}</td>
                                            <td>{contact}</td>
                                            <td>{credits}</td>
                                            <td>{supplyCategory}</td>
                                            <td>
                                                <button className="edit-btn">Edit</button>
                                                <button className="delete-btn" onClick={() => deleteSupplier(supplier_id)}>Delete</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p>No suppliers available</p>
                    )}
                </div>
            </InnerLayout>

            {/* Modal for Supplier Form */}
            <Modal isOpen={isFormOpen} onClose={closeForm}>
                <SupplierForm onClose={closeForm} />
            </Modal>
        </SupplierStyled>
    );
}

const SupplierStyled = styled.div`
    .content {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
    }
    .supplier-list {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 1rem;
    }

    th, td {
        padding: 0.8rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: #f2f2f2;
    }

    td {
        background-color: #fafafa;
    }

    tr:hover td {
        background-color: #f0f0f0;
    }

    .edit-btn, .delete-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
    }

    .edit-btn {
        background-color: #4CAF50;
        color: white;
        margin-right: 0.5rem;
    }

    .delete-btn {
        background-color: #f44336;
        color: white;
    }

    .edit-btn:hover {
        background-color: #388E3C;
    }

    .delete-btn:hover {
        background-color: #d32f2f;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 0.9rem;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background: rgba(255, 0, 0, 0.1);
    border-radius: 5px;
    text-align: center;
`;

export default Supplier;
