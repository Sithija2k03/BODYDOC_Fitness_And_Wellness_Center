import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SupplierForm from '../Form/SupplierForm';
import SupplierItem from './SupplierItem';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Button from '../Button/Button';
import { plus, search, fileText } from '../../utils/icons'; // Added download icon for the PDF button
import Modal from '../Modal/Modal';
import { useNavigate } from "react-router-dom";
import jsPDF from 'jspdf'; // Import jsPDF
import 'jspdf-autotable'; // Import autoTable plugin


function Supplier() {
    const { addSupplier, getSuppliers, suppliers, deleteSupplier, error, success, setSuccess } = useGlobalContext();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();// Initialize useNavigate


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

    // Filter suppliers based on search input
    const filteredSuppliers = safeSuppliers.filter((supplier) =>
        supplier?.supplier_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        // Set document title
        doc.setFontSize(18);
        doc.text('Suppliers List', 14, 22);

        // Define table headers (excluding Actions)
        const headers = [
            'Supplier ID',
            'Supplier Name',
            'Contact',
            'Credits',
            'Supply Category'
        ];

        // Map filtered suppliers to table rows (excluding Actions)
        const data = filteredSuppliers.map((supplier) => [
            supplier.supplier_id || 'N/A',
            supplier.supplier_name || 'N/A',
            supplier.contact || 'N/A',
            supplier.credits || '0',
            supplier.supplyCategory || 'Not Specified'
        ]);

        // Use autoTable to create the table in the PDF
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 30, // Start table below the title
            styles: {
                fontSize: 10,
                cellPadding: 3,
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [245, 102, 146], // Pink background for headers (matches #F56692)
                textColor: [255, 255, 255], // White text for headers
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250] // Light gray background for alternate rows (matches #fafafa)
            },
            margin: { top: 30 }
        });

        // Save the PDF
        doc.save('suppliers-list.pdf');
    };

    return (
        <SupplierStyled>
            <InnerLayout>
                <h1>Suppliers View</h1>
                <SearchBarContainer>
                    <input
                        type="text"
                        placeholder="Search supplier by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="search-icon">{search}</div>
                </SearchBarContainer>
                <div className="submit-btn">
                    <Button
                        name={'Add Supplier'}
                        icon={plus}
                        bPad={'.8rem 1.6rem'}
                        bRad={'30px'}
                        bg={'#F56692'}
                        color={'#fff'}
                        onClick={openForm}
                    />
                    <Button
                        name={'Generate PDF'}
                        icon={fileText}
                        bPad={'.8rem 1.6rem'}
                        bRad={'30px'}
                        bg={'#F56692'}
                        color={'#fff'}
                        onClick={generatePDF}
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
                                {filteredSuppliers.length > 0 ? (
                                    filteredSuppliers.map((supplier) => {
                                        const { _id, supplier_id, supplier_name, contact, credits, supplyCategory } = supplier;
                                        return (
                                            <tr key={_id}>
                                                <td>{supplier_id}</td>
                                                <td>{supplier_name}</td>
                                                <td>{contact}</td>
                                                <td>{credits}</td>
                                                <td>{supplyCategory || 'Not Specified'}</td>
                                                <td>
                                                    <button className="edit-btn" onClick={() => navigate(`/edit-supplier/${supplier_id}`)}>Edit</button>
                                                    <button className="delete-btn" onClick={() => deleteSupplier(supplier_id)}>Delete</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6">No suppliers match your search</td>
                                    </tr>
                                )}
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
                                                <button className="edit-btn" onClick={() => navigate(`/edit-supplier/${supplier_id}`)}> Edit</button>
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

    .submit-btn {
        margin: 1rem 0;
        display: flex;
        gap: 1rem; // Add spacing between buttons
        justify-content: center;

        button {
            box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.06); // Match button shadow
        }
    }
`;

const SearchBarContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    margin-left: 15px;

    input {
        background: #FFFFFF;
        width: 100%;
        max-width: 400px;
        padding: 10px 40px 10px 10px; 
        border: 2px solid #228B22;
        border-radius: 20px;
        font-size: 1rem;
        outline: none;
        transition: 0.3s ease-in-out;

        &:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 5px var(--color-primary);
        }
    }

    .search-icon {
        width: 60px;
        height: 60px;
        position: absolute;
        left: 420px;
        top: 127px;
        color: var(--color-primary);
        cursor: pointer;
    }
`;

export default Supplier;