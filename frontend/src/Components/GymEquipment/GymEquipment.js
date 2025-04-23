import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Button from '../Button/Button';
import { plus } from '../../utils/icons';
import Modal from '../Modal/Modal';
import GymEquipmentForm from '../Form/EquipmentForm';
import Navigation from '../../Components/Navigation/Navigation';
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

    const openForm = () => setIsFormOpen(true);
    const closeForm = () => setIsFormOpen(false);

    return (
        <MainLayout>
            <Navigation />
            <GymEquipmentStyled>
                <InnerLayout>
                    <h1>Gym Equipment Inventory</h1>
                    <div className="submit-btn">
                        <Button
                            name={'Add Equipment'}
                            icon={plus}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={'#6C63FF'}
                            color={'#fff'}
                            onClick={openForm}
                        />
                    </div>
                    <div className="gym-equipment-list">
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
                                {gymEquipment.map((item) => (
                                    <GymEquipmentItem
                                        key={item._id}
                                        id={item._id}
                                        equipmentId={item.equipmentId}
                                        equipmentName={item.equipmentName}
                                        equipmentCategory={item.equipmentCategory}
                                        lastMaintenanceDate={item.lastMaintenanceDate}
                                        deleteGymEquipment={deleteGymEquipment}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </InnerLayout>

                <Modal isOpen={isFormOpen} onClose={closeForm}>
                    <GymEquipmentForm onClose={closeForm} onSubmit={addGymEquipment} />
                </Modal>
            </GymEquipmentStyled>
        </MainLayout>
    );
}

const GymEquipmentStyled = styled.div`
    .submit-btn {
        margin: 1rem 0;
    }

    .gym-equipment-list {
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
`;

const MainLayout = styled.div`
    display: flex;
    height: 100vh;
    overflow: hidden;

    > nav {
        width: 250px;
        min-width: 250px;
        background-color: #f8f8f8;
        height: 100%;
    }

    > div {
        flex: 1;
        overflow-y: auto;
    }
`;

export default GymEquipment;