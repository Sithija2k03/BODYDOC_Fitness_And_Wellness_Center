import React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:7000/';
const GlobalContext = React.createContext();

const GlobalProvider = ({ children }) => {
  const [pharmacyItems, setPharmacyItems] = React.useState([]);
  const [suppliers, setSuppliers] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const getPharmacyItems = async () => {
    try {
      const response = await axios.get(`${API_URL}pharmacy/`);
      setPharmacyItems(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch pharmacy items');
    }
  };

  const addPharmacyItem = async (item) => {
    try {
      const response = await axios.post(`${API_URL}pharmacy/add`, item);
      setPharmacyItems((prev) => [...prev, response.data.item]);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add pharmacy item');
    }
  };

  const getSuppliers = async () => {
    try {
      const response = await axios.get(`${API_URL}supplier/`);
      setSuppliers(response.data);
      setError(null);
      setSuccess(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch suppliers');
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
      setSuccess("Supplier deleted successfully"); // Set success message
    } catch (err) {
      console.error("Delete Supplier Error:", err.response || err.message);
      setError(err.response?.data?.error || "Failed to delete supplier");
    }
  };

  return (
    <GlobalContext.Provider value={{ 
      pharmacyItems, 
      suppliers, 
      error, 
      success,
      getPharmacyItems, 
      addPharmacyItem, 
      getSuppliers, 
      addSupplier,
      deleteSupplier, 
      setError,
      setSuccess
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => React.useContext(GlobalContext);
export { GlobalProvider };