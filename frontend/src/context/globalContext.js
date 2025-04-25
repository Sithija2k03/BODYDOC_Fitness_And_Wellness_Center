import React , { createContext, useContext , useState} from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:4000/';

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = React.useState([]);
    const [expenses, setExpenses] = React.useState([]);
    const [salaries, setSalaries] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [pharmacyItems, setPharmacyItems] = React.useState([]);
    const [gymEquipment, setGymEquipment] = React.useState([]);
    const [suppliers, setSuppliers] = React.useState([]);
     const [appointments, setAppointments] = React.useState([]);
     const [bookings, setBookings] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [success, setSuccess] = React.useState(null);
    
    // Income section
    const addIncome = async (income) => {
        try {
            const response = await axios.post(`${API_URL}transactions/add-income`, income);
            setIncomes((prevIncomes) => [...prevIncomes, response.data]);
            await getIncomes();
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };
    
    const getIncomes = async () => {
        try {
            const response = await axios.get(`${API_URL}transactions/get-incomes`);
            setIncomes(response.data.data);
            console.log("Fetched incomes:", response.data);
        } catch (error) {
            console.error("Error fetching incomes:", error);
        }
    };

    const deleteIncome = async (id) => {
        try {
            await axios.delete(`${API_URL}transactions/delete-income/${id}`);
            getIncomes();
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
            const response = await axios.post(`${API_URL}transactions/add-expense`, expense);
            setExpenses([...expenses, response.data]);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
        getExpenses();
    };

    const getExpenses = async () => {
        try {
            const response = await axios.get(`${API_URL}transactions/get-expenses`);
            setExpenses(response.data.data);
            console.log("Fetched expenses:", response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`${API_URL}transactions/delete-expense/${id}`);
            getExpenses();
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
        return history.slice(0, 4);
    };

    // Salary section
    const addSalary = async (salaryData) => {
        try {
            const response = await axios.post(`${API_URL}transactions/create`, salaryData);
            setSalaries([...salaries, response.data.salary]);
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
        getSalaries();
    };

    const getSalaries = async () => {
        try {
            const response = await axios.get(`${API_URL}transactions/salaries`);
            setSalaries(response.data.salaries);
            console.log("Fetched salaries:", response.data);
        } catch (error) {
            console.error("Error fetching salaries:", error);
        }
    };

    const deleteSalary = async (id) => {
        try {
            await axios.delete(`${API_URL}transactions/salary-delete/${id}`);
            getSalaries();
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong");
        }
    };

    const updateSalaryStatus = async (salaryId, newStatus) => {
        try {
            const response = await axios.patch(`${API_URL}transactions/update-status/${salaryId}`, { status: newStatus });
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
    
    const getEmployeeByRole = async (role) => {
        try {
            const response = await axios.get(`${API_URL}getEmployeeByRole?role=${role}`);
            if (response.data) {
                return response.data.data;
            } else {
                console.error("Employee not found for role:", role);
                return null;
            }
        } catch (error) {
            console.error("Error fetching employee by role:", error);
            return null;
        }
    };
  
    // Inventory Section
    //add parmacy items
    const getPharmacyItems = async () => {
        setLoading(true); // Start loading
        try {
          const response = await axios.get(`${API_URL}pharmacy/`);
          setPharmacyItems(response.data);
          setError(null);
          setSuccess(null);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch pharmacy items');
        } finally {
          setLoading(false); // End loading
        }
      };
      
      const addPharmacyItem = async (item) => {
        try {
          console.log("Pharmacy Item Payload:", item);
          const response = await axios.post(`${API_URL}pharmacy/add`, item);
          if (!response.data || !response.data.item) {
            throw new Error("Invalid response from server");
          }
          setPharmacyItems((prev) => [...prev, response.data.item]);
          setError(null);
          setSuccess("Pharmacy item added successfully");
        } catch (err) {
          console.error("Add Pharmacy Item Error:", err.response || err.message);
          setError(err.response?.data?.error || "Failed to add pharmacy item");
        }
      };
      
      const deletePharmacyItem = async (itemNumber) => {
        try {
            await axios.delete(`${API_URL}pharmacy/delete/${itemNumber}`);
            setPharmacyItems((prev) =>
                prev.filter((item) => item.itemNumber !== itemNumber)
            );
            setError(null);
            setSuccess("Pharmacy item deleted successfully");
        } catch (err) {
            console.error("Delete Pharmacy Item Error:", err.response || err.message);
            setError(err.response?.data?.error || "Failed to delete pharmacy item");
        }
    }; 
    
    

    //Gym Equipment Section
    const getGymEquipment = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get(`${API_URL}gym/`);
            setGymEquipment(response.data);
            setError(null);
            setSuccess(null);
        } catch (err) {
            console.error("Get Gym Equipment Error:", err.response || err.message);
            setError(err.response?.data?.error || 'Failed to fetch gym equipment');
        } finally {
            setLoading(false); // End loading
        }
    };

    const addGymEquipment = async (equipment) => {
        try {
            console.log("Gym Equipment Payload:", equipment);
            const response = await axios.post(`${API_URL}gym/add`, equipment);
            if (!response.data || !response.data.equipment) {
                throw new Error("Invalid response from server");
            }
            setGymEquipment((prev) => [...prev, response.data.equipment]);
            setError(null);
            setSuccess("Gym equipment added successfully");
        } catch (err) {
            console.error("Add Gym Equipment Error:", err.response || err.message);
            setError(err.response?.data?.error || "Failed to add gym equipment");
        }
    };

    const deleteGymEquipment = async (equipmentId) => {
        try {
            await axios.delete(`${API_URL}gym/delete/${equipmentId}`);
            setGymEquipment((prev) =>
                prev.filter((item) => item.equipmentId !== equipmentId)
            );
            setError(null);
            setSuccess("Gym equipment deleted successfully");
        } catch (err) {
            console.error("Delete Gym Equipment Error:", err.response || err.message);
            setError(err.response?.data?.error || "Failed to delete gym equipment");
        }
    };


// Supplier Section
    const getSuppliers = async () => {
        setLoading(true); // Start loading
        try {
          const response = await axios.get(`${API_URL}supplier/get`);
          setSuppliers(response.data);
          setError(null);
          setSuccess(null);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch suppliers');
        } finally {
          setLoading(false);  // End loading
        }
      };
  
    const addSupplier = async (supplier) => {
        try {
            console.log("Supplier Payload:", supplier);
            const response = await axios.post(`${API_URL}supplier/add`, supplier);
            if (!response.data || !response.data.supplier) {
                throw new Error("Invalid response from server");
            }
            setSuppliers((prev) => [...prev, response.data.supplier]);
            setError(null);
            setSuccess("Supplier added successfully");
        } catch (err) {
            console.error("Add Supplier Error:", err.response || err.message);
            setError(err.response?.data?.error || "Failed to add supplier");
        }
    };
  
    const deleteSupplier = async (supplier_id) => {
        try {
            await axios.delete(`${API_URL}supplier/delete/${supplier_id}`);
            setSuppliers((prev) => prev.filter((supplier) => supplier.supplier_id !== supplier_id));
            setError(null);
            setSuccess("Supplier deleted successfully");
        } catch (err) {
            console.error("Delete Supplier Error:", err.response || err.message);
            setError(err.response?.data?.error || "Failed to add supplier");
        }
    };

    const updateSupplier = async (supplier_id, updatedData) => {
        try {
            await axios.put(`${API_URL}supplier/update/${supplier_id}`, updatedData, {
                headers: { 'Content-Type': 'application/json' }
            });

            setSuppliers((prev) =>
                prev.map((supplier) =>
                    supplier.supplier_id === supplier_id ? { ...supplier, ...updatedData } : supplier
                )
            );

            setError(null);
            setSuccess("Supplier updated successfully!");
        } catch (err) {
            console.error("Update Supplier Error:", err.response || err.message);
            setError(err.response?.data?.error || "Failed to update supplier");
        }
    };

    //E Pharmacy Section
    // Add a new appointment
    const addAppointment = async (newAppointment) => {
        try {
            const response = await axios.post(`${API_URL}appoinments/add`, newAppointment);
            console.log("Added appointment response:", response.data);
            setAppointments([...appointments, response.data.appointment]);
        } catch (err) {
            console.error("Error adding appointment:", err);
            setError("Failed to add appointment.");
        }
    };

    const getAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_URL}appoinments/`);
            setAppointments(res.data);
        } catch (err) {
            setError('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };
    
    const deleteAppointment = async (id) => {
        try {
            await axios.delete(`${API_URL}appoinments/delete/${id}`);
            setAppointments(appointments.filter(appoinment => appoinment._id !== id));
        } catch (err) {
            console.error("Error deleting appointment:", err);
            setError("Failed to delete appointment.");
        }
    };

    const updateAppoinment = async (id, formData) => {
        try {
            const data = await axios.put(`${API_URL}appoinments/update/${id}`,formData);
          setAppointments(appointments.map(app => (app.id === id ? { id, ...data.data } : app)));
          return data;
        } catch (err) {
          const errorMessage = err.response?.data?.error || 'Failed to update appointment';
          setError(errorMessage);
          console.error('Update error:', err.response || err);
          throw err;
        }
      };
    

    // Order Section
    const addOrder = async (newOrder) => {
      try {
          // Log the FormData content for debugging
          console.log("Sending FormData to backend:");
          for (let pair of newOrder.entries()) {
              console.log(`${pair[0]}: ${pair[1]}`);
          }

          const response = await axios.post(`${API_URL}order/add`, newOrder, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });

          console.log("Added order response:", response.data);

          // Ensure the response contains the expected data
          if (!response.data || !response.data.data) {
              throw new Error("Invalid response from backend: missing order data");
          }

          // Update the orders state with the new order
          setOrders((prevOrders) => [...prevOrders, response.data.data]);
      } catch (err) {
          console.error("Error adding order:", err);
          // Log more details about the error
          if (err.response) {
              console.error("Response data:", err.response.data);
              console.error("Response status:", err.response.status);
              console.error("Response headers:", err.response.headers);
          } else if (err.request) {
              console.error("No response received:", err.request);
          } else {
              console.error("Error setting up request:", err.message);
          }
          setError(err.response?.data?.error || err.message || "Failed to add order.");
      }
  };

    const getOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_URL}order/`);
            setOrders(res.data);
        } catch (err) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };
    
    const deleteOrder = async (id) => {
        try {
            await axios.delete(`${API_URL}order/delete/${id}`);
            setOrders(orders.filter(order => order._id !== id));
        } catch (err) {
            console.error("Error deleting order:", err);
            setError("Failed to delete order.");
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
            transactionHistory,
            pharmacyItems, 
            suppliers, 
            success,
            getPharmacyItems, 
            addPharmacyItem, 
            getSuppliers, 
            addSupplier,
            deleteSupplier,

            updateSupplier,
            deletePharmacyItem,
            gymEquipment,
            getGymEquipment,
            addGymEquipment,
            deleteGymEquipment,

            appointments, 
            loading,
            addAppointment, 
            getAppointments,
            deleteAppointment,

            bookings,
            setBookings,

            error,
            setError,
            addOrder,
            getOrders,
            deleteOrder,
        
            orders
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return React.useContext(GlobalContext);
};