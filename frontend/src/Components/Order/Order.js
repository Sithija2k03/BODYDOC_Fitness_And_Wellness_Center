import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import OrderItem from './OrderItem';
import Header from '../../Login/Header';

function OrderList() {
  const { orders, getOrders, loading, error } = useGlobalContext();

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <Header />
      <OrderListStyled>
        <h2>My Orders</h2>
        <div className="orders">
          {loading ? (
            <p className="status">Loading orders...</p>
          ) : error ? (
            <p className="status error">{error}</p>
          ) : orders && orders.length > 0 ? (
            orders.map((order, index) => (
              <OrderItem
                key={order.id || index}
                userName={order.user_name}
                doctorName={order.doctor_name}
                cDate={order.c_date}
                prescription={order.prescription}
              />
            ))
          ) : (
            <p className="status">No orders found</p>
          )}
        </div>
      </OrderListStyled>
    </>
  );
}

const OrderListStyled = styled.div`
  padding: 2rem;
  background: #f4f4f4;
  min-height: 100vh;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  .orders {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .status {
    font-size: 1rem;
    color: #555;
  }

  .status.error {
    color: #e74c3c;
  }
`;

export default OrderList;