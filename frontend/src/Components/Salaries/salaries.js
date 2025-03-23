import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { useGlobalContext } from "../../context/globalContext";
import SalaryItem from "../SalaryItem/SalaryItem";
import SalaryForm from "../Salaries/SalaryForm";
import Modal from "../Modal/Modal";
import Button from '../Button/Button';
import { plus, search } from '../../utils/icons';

function Salaries() {
    const { addSalary, salaries, getSalaries, deleteSalary } = useGlobalContext();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getSalaries();
    }, []);

    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    // Filter salaries based on search input
    const filteredSalaries = salaries
        ? salaries.filter((salary) => 
            salary?.status?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <SalariesStyled>
            <InnerLayout>
                <h1>Salaries</h1>

                <SearchBarContainer>
                    <input
                        type="text"
                        placeholder="Search salary by Salary Status..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="search-icon">{search}</div>
                </SearchBarContainer>

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
                        {filteredSalaries.length > 0 ? (
                            filteredSalaries.map((salary) => {
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
        margin-left: -500px;
        margin-bottom: 1.5rem;

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
    }
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  margin-left: 15px;

  input {
    background: var(--color-white);
    width: 100%;
    max-width: 400px;
    padding: 10px 40px 10px 10px;
    border: 2px solid var(--primary-color);
    border-radius: 20px;
    font-size: 1rem;
    outline: none;
    transition: 0.3s ease-in-out;

    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 5px var(--color-primary);
    }
  }

  .search-icon {
    width: 60px;
    height: 60px;
    position: absolute;
    left: 500px;
    top: 145px;
    color: var(--color-primary);
    cursor: pointer;
  }
`;

export default Salaries;
