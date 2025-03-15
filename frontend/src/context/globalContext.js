import React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/v1/';

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
 
    const [incomes, setIncomes] = React.useState([])
    const [expenses, setExpenses] = React.useState([])
    const [error, setError] = React.useState(null)

    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${API_URL}add-income`, income)
            setIncomes([...incomes, response.data])
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    return (
        <GlobalContext.Provider value={'hello'}>
            {children}
        </GlobalContext.Provider>
    )

}

export const useGlobalContext = () => {
  return React.useContext(GlobalContext);
}