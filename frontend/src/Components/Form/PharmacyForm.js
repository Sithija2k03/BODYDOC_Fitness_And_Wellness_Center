import React from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../../../frontendIE/src/context/globalContext";
import Button from '../../../../frontendIE/src/Components/Button/Button';
import { plus } from '../../../../frontendIE/src/Components/utils/icons';

function PharmacyForm() {
  const { addPharmacyItem, getPharmacyItems, error, setError } = useGlobalContext();

  const [inputState, setInputState] = React.useState({
    itemNumber: "",
    itemName: "",
    itemCategory: "",
    availableStockQty: "",
    reorderLevel: "",
    supplierName: "",
    supplierId: "",
    orderQty: "",
  });

  const { itemNumber, itemName, itemCategory, availableStockQty, reorderLevel, supplierName, supplierId, orderQty } = inputState;

  const handleInput = (name) => (e) => {
    setInputState({ ...inputState, [name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemNumber || !itemName || !itemCategory || !availableStockQty || !reorderLevel || !supplierName || !supplierId || !orderQty) {
      alert("Please fill all fields before submitting.");
      return;
    }
    if (parseFloat(availableStockQty) < 0 || parseFloat(reorderLevel) < 0 || parseFloat(orderQty) <= 0) {
      alert("Stock Quantity, Reorder Level, and Order Quantity must be non-negative, and Order Quantity must be positive.");
      return;
    }

    const payload = { itemNumber, itemName, itemCategory, availableStockQty, reorderLevel, supplierName, supplierId, orderQty };
    addPharmacyItem(payload);
    getPharmacyItems();
    setInputState({
      itemNumber: "",
      itemName: "",
      itemCategory: "",
      availableStockQty: "",
      reorderLevel: "",
      supplierName: "",
      supplierId: "",
      orderQty: "",
    });
  };

  return (
    <FormStyled onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <div className="input-control">
        <input type="number" value={itemNumber} name="itemNumber" placeholder="Item Number" onChange={handleInput("itemNumber")} />
      </div>
      <div className="input-control">
        <input type="text" value={itemName} name="itemName" placeholder="Item Name" onChange={handleInput("itemName")} />
      </div>
      <div className="selects">
        <select value={itemCategory} name="itemCategory" onChange={handleInput("itemCategory")}>
          <option value="" disabled>--Select Category--</option>
          <option value="Medicine">Medicine</option>
          <option value="Equipment">Equipment</option>
          <option value="Supplies">Supplies</option>
        </select>
      </div>
      <div className="input-control">
        <input type="number" value={availableStockQty} name="availableStockQty" placeholder="Available Stock Quantity" onChange={handleInput("availableStockQty")} />
      </div>
      <div className="input-control">
        <input type="number" value={reorderLevel} name="reorderLevel" placeholder="Reorder Level" onChange={handleInput("reorderLevel")} />
      </div>
      <div className="input-control">
        <input type="text" value={supplierName} name="supplierName" placeholder="Supplier Name" onChange={handleInput("supplierName")} />
      </div>
      <div className="input-control">
        <input type="number" value={supplierId} name="supplierId" placeholder="Supplier ID" onChange={handleInput("supplierId")} />
      </div>
      <div className="input-control">
        <input type="number" value={orderQty} name="orderQty" placeholder="Order Quantity" onChange={handleInput("orderQty")} />
      </div>
      <div className="submit-btn">
        <Button
          name={'Add Pharmacy Item'}
          icon={plus}
          bPad={'.8rem 1.6rem'}
          bRad={'30px'}
          bg={'var(--color-accent)'}
          color={'#fff'}
        />
      </div>
    </FormStyled>
  );
}

const FormStyled = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  gap: 1rem;
  margin-left: 5px;
  padding: 1rem;
  align-items: flex-start;

  input, textarea, select {
    font-family: inherit;
    font-size: 0.85rem;
    outline: none;
    padding: 0.6rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: #fff;
    resize: none;
    color: rgba(34, 34, 96, 0.9);
    width: 100%;
    
    &::placeholder {
      color: rgba(34, 34, 96, 0.4);
    }
  }

  .input-control {
    width: 100%;
    input {
      width: 100%;
    }
  }

  .selects {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    
    select {
      width: 100%;
      color: rgba(34, 34, 96, 0.4);
      
      &:focus, &:active {
        color: rgba(34, 34, 96, 1);
      }
    }
  }

  .submit-btn {
    width: 100%;
    display: flex;
    justify-content: center;

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

  .error {
    color: red;
    font-size: 0.85rem;
    margin: 0;
  }
`;

export default PharmacyForm;