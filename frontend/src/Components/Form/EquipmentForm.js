import React, { useState } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/globalContext";
import Button from '../Button/Button'; // Adjust path if needed
import { plus } from '../../utils/icons';

function AddPharmacyItem() {
    const { addPharmacyItem, getPharmacyItems, error, setError } = useGlobalContext();

    const [inputState, setInputState] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!itemNumber || !itemName || !itemCategory || !availableStockQty || !reorderLevel || !supplierName || !supplierId || !orderQty) {
            alert("Please fill all fields before submitting.");
            return;
        }

        if (parseFloat(itemNumber) <= 0 || parseFloat(availableStockQty) < 0 || parseFloat(reorderLevel) < 0 || parseFloat(orderQty) < 0) {
            alert("Item Number, Stock, Reorder Level, and Order Qty must be positive numbers.");
            return;
        }

        const payload = {
            itemNumber: parseFloat(itemNumber),
            itemName,
            itemCategory,
            availableStockQty: parseFloat(availableStockQty),
            reorderLevel: parseFloat(reorderLevel),
            supplierName,
            supplierId,
            orderQty: parseFloat(orderQty),
        };

        try {
            await addPharmacyItem(payload);
            await getPharmacyItems(); // Fetch updated items
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
        } catch (error) {
            setError("Failed to add pharmacy item");
        }
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
            <div className="input-control">
                <input type="text" value={itemCategory} name="itemCategory" placeholder="Category" onChange={handleInput("itemCategory")} />
            </div>
            <div className="input-control">
                <input type="number" value={availableStockQty} name="availableStockQty" placeholder="Stock" onChange={handleInput("availableStockQty")} />
            </div>
            <div className="input-control">
                <input type="number" value={reorderLevel} name="reorderLevel" placeholder="Reorder Level" onChange={handleInput("reorderLevel")} />
            </div>
            <div className="input-control">
                <input type="text" value={supplierName} name="supplierName" placeholder="Supplier Name" onChange={handleInput("supplierName")} />
            </div>
            <div className="input-control">
                <input type="text" value={supplierId} name="supplierId" placeholder="Supplier ID" onChange={handleInput("supplierId")} />
            </div>
            <div className="input-control">
                <input type="number" value={orderQty} name="orderQty" placeholder="Order Qty" onChange={handleInput("orderQty")} />
            </div>
            <div className="submit-btn">
                <Button name={'Add Item'} icon={plus} bPad={'.8rem 1.6rem'} bRad={'30px'} bg={'#F56692'} color={'#fff'} />
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

    input {
        font-family: inherit;
        font-size: 0.85rem;
        outline: none;
        padding: 0.6rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        background: #fff;
        width: 100%;
    }

    .input-control {
        width: 100%;
    }

    .submit-btn {
        width: 100%;
        display: flex;
        justify-content: center;

        button {
            width: 200px;
            padding: 0.6rem;
            font-size: 0.9rem;
            border-radius: 8px;
            transition: all 0.3s ease-in-out;
        }
    }

    .error {
        color: red;
        font-size: 0.85rem;
    }
`;

export default AddPharmacyItem;
