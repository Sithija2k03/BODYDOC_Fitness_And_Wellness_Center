import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function OrderItem({ id, userName, doctorName, cDate, prescription, onDelete }) {

  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      if (typeof onDelete === 'function') {
        onDelete(id);
      } else {
        console.error('onDelete is not a function');
      }
    }
  };

  const handleEdit = () => {
    // Navigate with the order data
    navigate(`/order-edit/${id}`, {
      state: { id, userName, doctorName, cDate, prescription }
    });
  };

  return (
    <OrderCard>
      <div className="header">
        <h3>Order #{id}</h3>
      </div>
      <div className="info">
        <div><strong>User:</strong> {userName}</div>
        <div><strong>Doctor:</strong> {doctorName}</div>
        <div><strong>Consultation Date:</strong> {cDate}</div>
        <a 
          href={`http://localhost:4000/${prescription}`} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          View Prescription
        </a>
      </div>

      <div className="actions">
        <button className="edit-btn" onClick={handleEdit}>
          Edit
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </OrderCard>
  );
}

const OrderCard = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s ease;
  border-left: 6px solid #F56692;

  &:hover {
    transform: translateY(-3px);
  }

  .header {
    margin-bottom: 1rem;
    h3 {
      margin: 0;
      color: #4a4a4a;
      font-size: 1.2rem;
    }
  }

  .info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.7rem;

    div {
      font-size: 0.95rem;
      color: #333;
      word-wrap: break-word;
    }
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;

    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.2s;
    }

    .edit-btn {
      background-color: #4a90e2;
      color: white;

      &:hover {
        background-color: #357abd;
      }
    }

    .delete-btn {
      background-color: #e74c3c;
      color: white;

      &:hover {
        background-color: #c0392b;
      }
    }
  }
`;

export default OrderItem;
