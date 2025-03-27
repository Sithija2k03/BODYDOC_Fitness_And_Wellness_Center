import React, { useEffect } from 'react';
import styled from 'styled-components';
import SupplierForm from '../Form/SupplierForm';
import SupplierItem from './SupplierItem';
import { useGlobalContext } from '../../context/globalContext';
import { InnerLayout } from '../../styles/Layouts';

function Supplier() {
    const { addSupplier, getSuppliers, suppliers, deleteSupplier, error, success, setSuccess } = useGlobalContext();

    useEffect(() => {
        getSuppliers();
    }, []);

   //alert for success message
    useEffect(() => {
        if (success) {
            alert(success); 
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success, setSuccess]);

    return (
        <SupplierStyled>
            <InnerLayout>
                <h1>Suppliers View</h1>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <div className='content'>
                    <div className='supplier-form'>
                        <SupplierForm addSupplier={addSupplier} />
                    </div>
                    <div className='supplier-list'>
                        {suppliers.length > 0 ? (
                            suppliers.map((supplier) => {
                                const { _id, supplier_id, supplier_name, contact, credits, supplyCategory } = supplier;
                                return (
                                    <SupplierItem
                                        key={_id}
                                        id={_id}
                                        supplier_id={supplier_id}
                                        supplier_name={supplier_name}
                                        contact={contact}
                                        credits={credits}
                                        supplyCategory={supplyCategory}
                                        indicatorColor={'#4CAF50'}
                                        deleteSupplieritem={deleteSupplier}
                                    />
                                );
                            })
                        ) : (
                            <p>No suppliers available</p>
                        )}
                    </div>
                </div>
            </InnerLayout>
        </SupplierStyled>
    );
}

const SupplierStyled = styled.div`
    .content {
        display: flex;
        justify-content: space-between;
        gap: 2rem;
    }

    .supplier-form {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-right: 2px solid #e0e0e0;
    }

    .supplier-list {
        flex: 1;
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 1rem;
    margin: 1rem 0;
    padding: 0.5rem 1rem;
    background: rgba(255, 0, 0, 0.1);
    border-radius: 5px;
    text-align: center;
`;

export default Supplier;