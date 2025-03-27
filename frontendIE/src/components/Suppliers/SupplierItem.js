import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import Button from '../Button/Button';
import { trash, users } from '../utils/icons';

function SupplierItem({
    id,
    supplier_id,
    supplier_name,
    contact,
    credits,
    supplyCategory,
    indicatorColor,
    deleteSupplieritem,
}) {
    return (
        <SupplierItemStyled>
            <div className="indicator" style={{ backgroundColor: indicatorColor }}></div>
            <div className="content">
                <h5>
                    <span className="supplier-icon">{users}</span> {supplier_name}
                </h5>
                <p><strong>Supplier ID:</strong> {supplier_id}</p>
                <p><strong>Contact:</strong> {contact}</p>
                <p><strong>Credits:</strong> {credits}</p>
                <p><strong>Category:</strong> {supplyCategory}</p>

                <div className="buttons">
                    <div className="actions">
                        <Button
                            icon={trash}
                            bPad={'1rem'}
                            bRad={'50%'}
                            bg={'var(--color-delete)'}
                            color={'#fff'}
                            iColor={'#fff'}
                            hColor={'var(--color-green)'}
                            onClick={() => deleteSupplieritem(supplier_id)}
                        />
                    </div>
                </div>
            </div>
        </SupplierItemStyled>
    );
}

const SupplierItemStyled = styled.div`
    background:rgb(246, 244, 245);
    border: 2px solidrgb(176, 67, 67);
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.11);
    border-radius: 20px;
    padding: 1rem;
    max-width: 93%;
    margin-bottom: 1rem;
    display: flex;
    align-items: wrap;
    gap: 1rem;
    overflow: hidden;

    .indicator {
        width: 10px;
        height: 100%;
        border-radius: 5px;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;

        h5 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;

            .supplier-icon {
                font-size: 1.5rem;
                margin-right: 0.5rem;
            }
        }

        p {
            margin: 0.2rem 0;
        }

        .buttons {
            display: flex;
            gap: 0.5rem;
            align-items: center;
        }
    }
`;

export default SupplierItem;
