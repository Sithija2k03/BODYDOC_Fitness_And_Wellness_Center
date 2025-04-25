// src/Components/pharmacy/PharmacyItem.js

import React from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import { trash } from '../../utils/icons';

function PharmacyItem({
    id,
    itemNumber,
    itemName,
    itemCategory,
    availableStockQty,
    reorderLevel,
    supplierName,
    supplierId,
    orderQty,
    unitPrice,
    totalAmount,
    orderDate,
    deletePharmacyItem,
}) {
    return (
        <PharmacyItemStyled>
            <tr>
                <td>{itemNumber}</td>
                <td>{itemName}</td>
                <td>{itemCategory}</td>
                <td>{availableStockQty}</td>
                <td>{reorderLevel}</td>
                <td>{supplierName}</td>
                <td>{supplierId}</td>
                <td>{orderQty}</td>
                <td>{unitPrice}</td>
                <td>{totalAmount}</td>
                <td>{new Date(orderDate).toLocaleDateString()}</td>
                <td>
                <Button
    icon={trash}
    bPad={'1rem'}
    bRad={'50%'}
    bg={'#222260'}
    color={'#fff'}
    iColor={'#fff'}
    hColor={'var(--color-green)'}
    onClick={() => deletePharmacyItem(itemNumber)}
/>

                </td>
            </tr>
        </PharmacyItemStyled>
    );
}

const PharmacyItemStyled = styled.tbody`
    tr {
        background: #fff;
        border-bottom: 1px solid #ccc;

        td {
            padding: 0.8rem;
            text-align: center;
            font-size: 0.95rem;
        }

        td:last-child {
            text-align: center;
        }
    }
`;

export default PharmacyItem;
