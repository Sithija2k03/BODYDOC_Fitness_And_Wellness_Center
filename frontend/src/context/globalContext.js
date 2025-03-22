import React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/';

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = React.useState([]);
    const [expenses, setExpenses] = React.useState([]);
    const [salaries, setSalaries] = React.useState([]);
    const [error, setError] = React.useState(null);

    // Income section
    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${API_URL}add-income`, income);
            setIncomes([...incomes, response.data]);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }

        getIncomes();
    };

    const getIncomes = async () => {
        try {
            const response = await axios.get(`${API_URL}get-incomes`);
            setIncomes(response.data.data);
            console.log("Fetched incomes:", response.data);
        } catch (error) {
            console.error("Error fetching incomes:", error);
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${API_URL}delete-income/${id}`);
            getIncomes();  // Refresh the income list after deletion
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    const totalIncome = () => {
        return incomes.reduce((total, income) => total + income.amount, 0);
    };

    // Expense section
    const addExpense = async (expense) => {
        try {
            const response = await axios.post(`${API_URL}add-expense`, expense);
            setExpenses([...expenses, response.data]);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }

        getExpenses();
    };

    const getExpenses = async () => {
        try {
            const response = await axios.get(`${API_URL}get-expenses`);
            setExpenses(response.data.data);
            console.log("Fetched expenses:", response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${API_URL}delete-expense/${id}`);
            getExpenses();  // Refresh the expense list after deletion
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    const totalExpenses = () => {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    };

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return history.slice(0,4); 
    };
    

    // Salary section
    const addSalary = async (salaryData) => {
        try {
            const response = await axios.post(`${API_URL}create`, salaryData);
            setSalaries([...salaries, response.data.salary]);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }

        getSalaries();
    };

    const getSalaries = async () => {
        try {
            const response = await axios.get(`${API_URL}salaries`);
            setSalaries(response.data.salaries);
            console.log("Fetched salaries:", response.data);
        } catch (error) {
            console.error("Error fetching salaries:", error);
        }
    };

    const deleteSalary = async (id) => {
        try {
            await axios.delete(`${API_URL}salary-delete/${id}`);
            getSalaries();  // Refresh the salary list after deletion
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    const updateSalaryStatus = async (salaryId, newStatus) => {
        try {
            const response = await axios.patch(`${API_URL}update-status/${salaryId}`, { status: newStatus });
    
            if (response.data.salary) {
                setSalaries((prevSalaries) =>
                    prevSalaries.map((salary) =>
                        salary._id === salaryId ? { ...salary, status: newStatus } : salary
                    )
                );
            }
        } catch (error) {
            console.error("Error updating salary status:", error);
            setError(error.response?.data?.message || "Something went wrong");
        }
    };
    
    

    // Function to fetch employee by role
    const getEmployeeByRole = async (role) => {
        try {
            const response = await axios.get(`${API_URL}getEmployeeByRole?role=${role}`);
            if (response.data) {
                return response.data.data; // Return the employee data
            } else {
                console.error("Employee not found for role:", role);
                return null;
            }
        } catch (error) {
            console.error("Error fetching employee by role:", error);
            return null;
        }
    };

    return (
        <GlobalContext.Provider value={{ 
            addIncome, 
            getIncomes, 
            incomes, 
            deleteIncome,
            totalIncome,
            addExpense,
            getExpenses,
            expenses,
            deleteExpense,
            totalExpenses,  
            salaries,
            addSalary,
            getSalaries,
            deleteSalary,
            updateSalaryStatus,
            getEmployeeByRole,
            transactionHistory
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return React.useContext(GlobalContext);
};