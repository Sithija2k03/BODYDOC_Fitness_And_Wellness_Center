import React from 'react';
import { useGlobalContext } from '../context/globalContext';
import styled from 'styled-components';

function History() {

    const {transactionHistory} = useGlobalContext()

    const [...history] = transactionHistory()
    

    return (
        <HistoryStyled>
            <h2>Recent History</h2>
            {history.map((item) => {
                const {_id, title, amount, type} = item
                return (
                    <div key={_id} className='history-item'>
                        <p style = {{
                            color: type === 'income' ? 'green' : 'red'
                        }}>
                            {title}
                        </p>

                        <p style = {{
                            color: type === 'income' ? 'green' : 'red'
                        }}>
                            {
                                type === 'income'? `+ Rs.${amount}` : `- Rs.${amount}`
                            }
                        </p>
                    </div> 
                )
            })}
        </HistoryStyled>
    )
}

const HistoryStyled = styled.div`
   display: flex;
   flex-direction: column;
   gap: 1rem;
   .history-item {
       background: #FCF6F9;
       border: 2px solid #FFFFFF;
       box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
       padding: .5rem;
       border-radius: 20px;
       display: flex;
       justify-content: space-between;
       align-items: center;
    }

`;

export default History;