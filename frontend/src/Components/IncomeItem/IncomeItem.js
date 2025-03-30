import React from 'react'
import Button from '../Button/Button'
import styled from 'styled-components';
import {calendar, comment, trash, dollar, list, users, dumbell, pharmacy, swim, booking, rupees, bolt, water, maintain, wrench, broom} from '../../utils/icons';
import { dateFormat } from '../../utils/dateFormat';

function IncomeItem({
    id,
    title,
    amount,
    date,
    category,
    description,
    deleteItem,
    indicatorColor,
    type
}) {

    const categoryIcon = () => {
        switch(category){
            case 'Memberships':
                return users;
            case 'Gym/Yoga Booking':
                return dumbell;
            case 'Swimming Pool Booking':
                return swim;
            case 'Badminton Court Booking':
                return booking;
            case 'Pool Lounge Booking':
                return booking;
            case 'Medicare & E-Pharmacy':
                return pharmacy;
            case 'Other':
                return dollar;
            default:
                return '';
      }
   }

   const expenseCatIcon = () => {
    switch(category){
        case 'Electricity Bills':
            return bolt;
        case 'Water Bills':
            return water;
        case 'Facility Maintainance':
            return maintain;
        case 'Eqipment Maintainance':
            return wrench;
        case 'Pharmacy Inventory':
            return pharmacy;
        case 'Cleaning Services':
            return broom;
        case 'Other':
            return dollar;
        default:
            return '';
        }
    }

    return (
        <IncomeItemStyled  indicator={indicatorColor}>
            <div className='icon'>
                {type === 'expense' ? expenseCatIcon() : categoryIcon()}
            </div>
            <div className='content'>
                <h5>{title}</h5>
                <div className='inner-content'>
                    <div className='text'>
                        <p>{rupees} {amount}</p>
                        <p>{calendar} {dateFormat(date)}</p>
                        <p>{list} {category}</p>
                        <p> 
                            {comment}  
                            {description}
                        </p>
                    </div>
                    <div className='actions'>
                        <Button
                            icon={trash}
                            bPad={'1rem'}
                            bRad={'50%'}
                            bg={' #222260'}
                            color={'#fff'}
                            iColor={'#fff'}
                            hColor={'var(--color-green)'}
                            onClick={() => deleteItem(id)}
                            />
                    </div>
                </div>
            </div>
        </IncomeItemStyled>
    )
}

const IncomeItemStyled = styled.div`
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    box-shadow: 0 1px 10px rgba(0, 0, 0, 0.06);
    border-radius: 15px;
    padding: 0.8rem; /* Reduced padding to make items smaller */
    width: 85%;
    max-width: 750px;
    margin: 0 auto;
    color: #222260;
    display: flex;
    gap: 1.5rem; 
    align-items: center; 

    /* More Visible Icon */
    .icon {
        width: 60px;  /* Increased size */
        height: 60px;
        border-radius: 12px;
        background: #E0E0E0; /* Slightly darker background for contrast */
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        font-size: 1.5rem; /* Increase icon size */
        color: #222260;
    }

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.3rem; 
        
        h5 {
            font-size: 1rem;
            font-weight: 600;
            color: #222260;
            margin: 0;
            margin-left: 0px; 
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.5rem;


            &::before {
                content: '${(props) => (props.indicator.indicatorColor)}';
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
               background-color: var(--color-green); 
                margin-right: 0.5rem;
            }
        }

        .inner-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            width: 100%;

            .text {
                display: flex;
                align-items: center;
                gap: 0.8rem; /* Balanced gap for better alignment */

                p {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    color: var(--primary-color);
                    opacity: 0.8;
                    font-size: 0.9rem;
                }
            }
        }
    }
`;




export default IncomeItem