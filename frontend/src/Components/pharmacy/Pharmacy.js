import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';
import Button from '../Button/Button';
import { plus } from '../../utils/icons';
import Modal from '../Modal/Modal';
import PharmacyForm from '../Form/PharmacyForm';
import Navigation from '../../Components/Navigation/Navigation';
import PharmacyItem from './PharmacyItems';

function Pharmacy() {
    const {
        pharmacyItems,
        getPharmacyItems,
        addPharmacyItem,
        deletePharmacyItem,
        error,
        success,
        setSuccess
    } = useGlobalContext();

    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        getPharmacyItems();
    }, [getPharmacyItems]);

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
            <PharmacyStyled>
                <InnerLayout>
                    <h1>Pharmacy Inventory</h1>
                    <div className="submit-btn">
                        <Button
                            name={'Add Item'}
                            icon={plus}
                            bPad={'.8rem 1.6rem'}
                            bRad={'30px'}
                            bg={'#6C63FF'}
                            color={'#fff'}
                            onClick={openForm}
                        />
                    </div>
                    <div className="pharmacy-item-list">
    <table>
        <thead>
            <tr>
                <th>Item Number</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Stock Qty</th>
                <th>Reorder Level</th>
                <th>Supplier</th>
                <th>Supplier ID</th>
                <th>Order Qty</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Order Date</th>
                <th>Action</th>
            </tr>
        </thead>
        {pharmacyItems.map((item) => (
            <PharmacyItem
                key={item._id}
                id={item._id}
                itemNumber={item.itemNumber}
                itemName={item.itemName}
                itemCategory={item.itemCategory}
                availableStockQty={item.availableStockQty}
                reorderLevel={item.reorderLevel}
                supplierName={item.supplierName}
                supplierId={item.supplierId}
                orderQty={item.orderQty}
                unitPrice={item.unitPrice}
                totalAmount={item.totalAmount}
                orderDate={item.orderDate}
                deletePharmacyItem={deletePharmacyItem}
            />
        ))}
    </table>
</div>


                </InnerLayout>

                <Modal isOpen={isFormOpen} onClose={closeForm}>
                    <PharmacyForm onClose={closeForm} onSubmit={addPharmacyItem} />
                </Modal>
            </PharmacyStyled>
        </MainLayout>
    );
}

const PharmacyStyled = styled.div`
    .submit-btn {
        margin: 1rem 0;
    }

    .pharmacy-item-list {
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

export default Pharmacy;
