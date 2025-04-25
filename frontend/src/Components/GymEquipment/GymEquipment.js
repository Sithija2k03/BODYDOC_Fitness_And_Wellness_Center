import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Button from '../Button/Button';
import { plus, search, fileText } from '../../utils/icons'; // Added search and fileText icons
import Modal from '../Modal/Modal';
import GymEquipmentForm from '../Form/EquipmentForm';
import Navigation from '../../Components/Navigation/Navigation';
import jsPDF from 'jspdf'; // Import jsPDF
import autoTable from 'jspdf-autotable'; // Import autoTable directly
import GymEquipmentItem from '../../Components/GymEquipment/GymEquipmentItems';

function GymEquipment() {
    const {
        gymEquipment = [], // Placeholder: Update globalContext.js to include gymEquipment state
        getGymEquipment = () => {}, // Placeholder: Add to globalContext.js
        addGymEquipment = () => {}, // Placeholder: Add to globalContext.js
        deleteGymEquipment = () => {}, // Placeholder: Add to globalContext.js

        error,
        success,
        setSuccess
    } = useGlobalContext();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // Added state for search term

    useEffect(() => {
        getGymEquipment();
    }, [getGymEquipment]);

    useEffect(() => {
        if (success) {
            alert(success);
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success, setSuccess]);

    useEffect(() => {
        console.log('Gym Equipment Items:', gymEquipment); // Debug: Inspect the data
    }, [gymEquipment]);

    const openForm = () => setIsFormOpen(true);
    const closeForm = () => setIsFormOpen(false);

    // Filter gym equipment based on search input
    const filteredGymEquipment = gymEquipment.filter((item) =>
        item?.equipmentName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Function to generate PDF
    const generatePDF = () => {
        const doc = new jsPDF();

        autoTable(doc, {
            head: [['Equipment ID', 'Equipment Name', 'Category', 'Last Maintenance Date']],
            body: filteredGymEquipment.map((item) => [
                item.equipmentId || 'N/A',
                item.equipmentName || 'N/A',
                item.equipmentCategory || 'N/A',
                item.lastMaintenanceDate ? new Date(item.lastMaintenanceDate).toLocaleDateString() : 'N/A'
            ]),
            startY: 30,
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
            margin: { top: 30 },
            didDrawPage: (data) => {
                // Add document title on the first page
                doc.setFontSize(18);
                doc.text('Gym Equipment Inventory', 14, 22);
            }
        });

        // Save the PDF
        doc.save('gym-equipment-inventory.pdf');
    };

    // Inline GymEquipmentItem component to ensure correct rendering
    const GymEquipmentItem = ({
        id,
        equipmentId,
        equipmentName,
        equipmentCategory,
        lastMaintenanceDate,
        deleteGymEquipment
    }) => {
        return (
            <tr>
                <td>{equipmentId || 'N/A'}</td>
                <td>{equipmentName || 'N/A'}</td>
                <td>{equipmentCategory || 'N/A'}</td>
                <td>{lastMaintenanceDate ? new Date(lastMaintenanceDate).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button className="delete-btn" onClick={() => deleteGymEquipment(equipmentId)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    };

    return (
        <MainLayout>
            <div className="page-content">
                <Navigation />
                <GymEquipmentStyled>
                    <InnerLayout>
                        <h1>Gym Equipment Inventory</h1>
                        <SearchBarContainer>
                            <input
                                type="text"
                                placeholder="Search equipment by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="search-icon">{search}</div>
                        </SearchBarContainer>
                        <div className="submit-btn">
                            <Button
                                name={'Add Equipment'}
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
                        <div className="gym-equipment-list">
                            {gymEquipment.length > 0 ? (
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Equipment ID</th>
                                            <th>Equipment Name</th>
                                            <th>Category</th>
                                            <th>Last Maintenance Date</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredGymEquipment.length > 0 ? (
                                            filteredGymEquipment.map((item) => (
                                                <GymEquipmentItem
                                                    key={item._id}
                                                    id={item._id}
                                                    equipmentId={item.equipmentId}
                                                    equipmentName={item.equipmentName}
                                                    equipmentCategory={item.equipmentCategory}
                                                    lastMaintenanceDate={item.lastMaintenanceDate}
                                                    deleteGymEquipment={deleteGymEquipment}
                                                />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5">No gym equipment matches your search</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No gym equipment available</p>
                            )}
                        </div>
                    </InnerLayout>

                    <Modal isOpen={isFormOpen} onClose={closeForm}>
                        <GymEquipmentForm onClose={closeForm} onSubmit={addGymEquipment} />
                    </Modal>
                </GymEquipmentStyled>
            </div>
        </MainLayout>
    );
}

const MainLayout = styled.div`
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, rgba(245, 102, 146, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%);
    padding: 2rem;

    .page-content {
        display: flex;
        flex: 1;
        background: white;
        border-radius: 20px;
        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    > .page-content > nav {
        width: 250px;
        min-width: 250px;
        background-color: #f8f8f8;
        height: 100%;
    }

    > .page-content > div {
        flex: 1;
        overflow-y: auto;
    }
`;

const GymEquipmentStyled = styled.div`
    flex: 1;

    .submit-btn {
        margin: 1rem 0;
        display: flex;
        gap: 1rem; // Add spacing between buttons
        justify-content: center;

        button {
            box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.06);
        }
    }

    .gym-equipment-list {
        margin-top: 1rem;
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    th, td {
        padding: 0.8rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    th {
        background-color: #f2f2f2;
        font-weight: 600;
        width: 20%; // 100% / 5 columns
    }

    td {
        background-color: #fafafa;
    }

    tr:hover td {
        background-color: #f0f0f0;
    }

    .delete-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        background-color: #f44336;
        color: white;
    }

    .delete-btn:hover {
        background-color: #d32f2f;
    }

    p {
        text-align: center;
        font-size: 1rem;
        color: #666;
        margin: 2rem 0;
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
        left: 790px;
        top: 160px;
        color: var(--color-primary);
        cursor: pointer;
    }
`;



export default GymEquipment;