import React, { useState, useEffect } from 'react';
import OrderHistory from '../../components/pos/OrderHistory';
import OrderHistoryDetail from '../../components/pos/OrderHistoryDetail';
import styled from 'styled-components';
import Navbar from '../../components/pos/Navbar';

const OrderListPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`;
function OrderListPage() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // const handleCancelOrder = (orderId) => {
  //   setOrders(
  //     orders.map((order) => (order.id === orderId ? { ...order, status: 'cancelled' } : order))
  //   );
  // };

  return (
    <OrderListPageStyle>
      <Navbar isOpen={isNavbarOpen} toggleNavbar={() => setIsNavbarOpen(!isNavbarOpen)} />
      <OrderHistory selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
      {selectedOrder && (
        <OrderHistoryDetail selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
      )}
    </OrderListPageStyle>
  );
}

export default OrderListPage;
