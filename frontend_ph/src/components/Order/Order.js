import React, { useState } from "react";

const PharmacyInventoryForm = () => {
  const [order, setOrder] = useState([{ medicine: "", quantity: 1 }]);
  const [prescription, setPrescription] = useState(null);

  const handleChange = (index, field, value) => {
    const newOrder = [...order];
    newOrder[index][field] = value;
    setOrder(newOrder);
  };

  const handleAddMedicine = () => {
    setOrder([...order, { medicine: "", quantity: 1 }]);
  };

  const handleFileUpload = (event) => {
    setPrescription(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Order Submitted:", order, "Prescription:", prescription);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Order Medicine</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {order.map((item, index) => (
          <div key={index} className="flex space-x-2">
            <input
              type="text"
              placeholder="Medicine Name"
              value={item.medicine}
              onChange={(e) => handleChange(index, "medicine", e.target.value)}
              className="border p-2 flex-1 rounded"
              required
            />
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
              className="border p-2 w-20 rounded"
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddMedicine} className="text-blue-600">+ Add More</button>
        <div>
          <label className="block mb-1">Upload Prescription (Optional)</label>
          <input type="file" onChange={handleFileUpload} className="border p-2 rounded w-full" />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Submit Order</button>
      </form>
    </div>
  );
};

export default PharmacyInventoryForm;
