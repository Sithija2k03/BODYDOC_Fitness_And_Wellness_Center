import React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/';

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = React.useState([]);
    const [expenses, setExpenses] = React.useState([]);
    const [error, setError] = React.useState(null);

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
       const res = await axios.delete(`${API_URL}delete-income/${id}`);

       getIncomes();
    }
    
    const totalIncome = () => {
        let totalIncome = 0;
        incomes.forEach(income => {
            totalIncome += income.amount;
        })
        return totalIncome;
    }

    console.log("Total income:", totalIncome);

    return (
        <GlobalContext.Provider value={{ 
            addIncome, 
            getIncomes, 
            incomes,
            deleteIncome,
            totalIncome  
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return React.useContext(GlobalContext);
};
