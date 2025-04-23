import React from 'react';
import styled from 'styled-components';
import Button from '../Button/Button';
import { trash } from '../../utils/icons';

function GymEquipmentItem({
    id,
    equipmentId,
    equipmentName,
    equipmentCategory,
    lastMaintenanceDate,
    deleteGymEquipment
}) {
    return (
        <GymEquipmentItemStyled>
            <tr>
                <td>{equipmentId}</td>
                <td>{equipmentName}</td>
                <td>{equipmentCategory}</td>
                <td>{new Date(lastMaintenanceDate).toLocaleDateString()}</td>
                <td>
                    <Button
                        icon={trash}
                        bPad={'1rem'}
                        bRad={'50%'}
                        bg={'#222260'}
                        color={'#fff'}
                        iColor={'#fff'}
                        hColor={'var(--color-green)'}
                        onClick={() => deleteGymEquipment(equipmentId)}
                    />
                </td>
            </tr>
        </GymEquipmentItemStyled>
    );
}

const GymEquipmentItemStyled = styled.tbody`
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

export default GymEquipmentItem;