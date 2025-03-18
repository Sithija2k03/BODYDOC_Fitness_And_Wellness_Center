import React, { useEffect } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { useGlobalContext } from "../../context/globalContext";
import Form from "../Form/Form";
import IncomeItem from "../IncomeItem/IncomeItem";

function Incomes() {
    const { addIncome, incomes, getIncomes, deleteIncome, totalIncome } = useGlobalContext();

    useEffect(() => {
        getIncomes();
    }, []);
    
    console.log("Incomes state:", incomes);  
    

    return (
        <IncomeStyled>
            <InnerLayout>
                <h1>Incomes</h1>
                <h2 className="total-income">Total Income: <span>${totalIncome()}</span></h2>
                <div className="income-content">
                    <div className="form-container">
                        <Form />
                    </div>
                    
                    <div className="incomes">
                        {incomes && incomes.length > 0 ? (
                            incomes.map((income) => {
                            const { _id, title, amount, date, category, description } = income;
                                   return (
                                            <IncomeItem 
                                                key={_id} 
                                                id={_id}
                                                title={title}
                                                amount={amount}
                                                date={date}
                                                category={category}
                                                description={description}
                                                indicatorColor="var(--color-green)"
                                                type="income"
                                                deleteItem={deleteIncome}
                                            />
                                         );
                                     })
                                ) : (
                                    <p>No incomes found.</p> 
                            )}
                    </div>

                </div>
            </InnerLayout>
        </IncomeStyled>
    );
}

const IncomeStyled = styled.div`
  display: flex;
  overflow: auto;

//   h1 {
//   text-align: left;
// }

  .total-income{
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FCF6F9;
    border: 2px solid #FFFFFF;
    border-radius: 20px;
    padding: 1rem;
    margin: 1rem 0;
    font-size: 2rem;
    gap: .5rem;

    span{
       font-size: 2.5rem;
       font-weight: 800;
       color: var(--color-green);
    }
  }
  .income-content{
    display: flex;
    gap: 2rem;
  }
    .incomes{
    flex:1;
    }
`;

export default Incomes;
