import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { useGlobalContext } from "../../context/globalContext";
import SalaryItem from "../SalaryItem/SalaryItem";
import SalaryForm from "../Salaries/SalaryForm";
import Modal from "../Modal/Modal";
import Button from '../Button/Button'
import {plus} from '../../utils/icons'

function Salaries() {
    const { addSalary, salaries, getSalaries, deleteSalary } = useGlobalContext();
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        getSalaries();
    }, [getSalaries]);

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    return (
        <SalariesStyled>
            <InnerLayout>
                <h1>Salaries</h1>
                {/* <button className="add-salary-btn" onClick={openForm}>
                    Add Salary
                </button> */}
                <div className="add-salary-btn">
                <Button 
                    name={'Add Salary'}
                    icon={plus}
                    bPad={'.8rem 1.6rem'}
                    bRad={'30px'}
                    bg={'var(--color-accent)'}
                    color={'#fff'}
                    onClick={openForm}
                />
            </div>
                <div className="salary-content">
                    <div className="salaries">
                        {salaries && salaries.length > 0 ? (
                            salaries.map((salary) => {
                                const { _id, employeeId, basicSalary, allowances, deductions, netSalary, paymentDate, status } = salary;
                                return (
                                    <SalaryItem
                                        key={_id}
                                        id={_id}
                                        employeeId={employeeId}
                                        basicSalary={basicSalary}
                                        allowances={allowances}
                                        deductions={deductions}
                                        netSalary={netSalary}
                                        paymentDate={paymentDate}
                                        status={status}
                                        indicatorColor="var(--color-green)"
                                        type="salary"
                                        deleteItem={deleteSalary}
                                    />
                                );
                            })
                        ) : (
                            <p>No salaries found.</p>
                        )}
                    </div>
                </div>
            </InnerLayout>

            {/* Modal for Salary Form */}
            <Modal isOpen={isFormOpen} onClose={closeForm}>
                <SalaryForm onClose={closeForm} />
            </Modal>
        </SalariesStyled>
    );
}

const SalariesStyled = styled.div`
    .add-salary-btn {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-left:-500px;
        margin-bottom:1.5rem;

        button {
            width: 200px; 
            padding: 0.6rem;
            font-size: 0.9rem;
            transition: all 0.3s ease-in-out;
            box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.06);
            border-radius: 8px;
              gap: 1.6rem;
            &:hover {
                background: var(--color-green) !important;
            }
        }
`;

export default Salaries;