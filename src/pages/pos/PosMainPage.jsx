// This is UnusedPage !!!!!!!!!!!!!!!!!!!!
// This is UnusedPage !!!!!!!!!!!!!!!!!!!!
// This is UnusedPage !!!!!!!!!!!!!!!!!!!!
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import OrderList from '../../components/pos/OrderList';
import OrderDetail from '../../components/pos/OrderDetail';
import Navbar from '../../components/pos/Navbar';
const PosMainPageWrapper = styled.div`
  width: 100%;
`;

function PosMainPage() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const initialOrders = [
    {
      id: 1,
      kioskID: 'kiosk1',
      amount: 14500,
      items: [
        { name: '아메리카노', quantity: 1, price: 4500 },
        { name: '카페라떼', quantity: 2, price: 5000 },
      ],
      status: '완료',
      orderTime: '2024-07-29T11:15:47',
      paymentMethod: '카드',
      totalAmount: 14500,
    },
    {
      id: 2,
      kioskID: 'kiosk3',
      amount: 10000,
      items: [
        { name: '바닐라라떼', quantity: 1, price: 5000 },
        { name: '아이스아메리카노', quantity: 1, price: 5000 },
      ],
      status: '완료',
      orderTime: '2024-07-29T11:15:47',
      paymentMethod: '카드',
      totalAmount: 10000,
    },
    {
      id: 3,
      kioskID: 'kiosk4',
      amount: 10000,
      items: [
        { name: '바닐라라떼', quantity: 1, price: 5000 },
        { name: '아이스아메리카노', quantity: 1, price: 5000 },
      ],
      status: '완료',
      orderTime: '2024-07-29T11:15:47',
      paymentMethod: '카드',
      totalAmount: 10000,
    },
    {
      id: 4,
      kioskID: 'kiosk4',
      amount: 15000,
      items: [
        { name: '바닐라라떼', quantity: 1, price: 5000 },
        { name: '아이스아메리카노', quantity: 1, price: 5000 },
      ],
      status: '완료',
      orderTime: '2024-07-29T11:15:47',
      paymentMethod: '카드',
      totalAmount: 10000,
    },
    {
      id: 5,
      kioskID: 'kiosk1',
      amount: 14500,
      items: [
        { name: '아메리카노', quantity: 1, price: 4500 },
        { name: '카페라떼', quantity: 2, price: 5000 },
      ],
      status: '완료',
      orderTime: '2024-07-29T11:15:47',
      paymentMethod: '카드',
      totalAmount: 14500,
    },
    {
      id: 6,
      kioskID: 'kiosk3',
      amount: 15000,
      items: [
        { name: '바닐라라떼', quantity: 1, price: 5000 },
        { name: '개맛잇는커피', quantity: 1, price: 10000 },
      ],
      status: '미완',
      orderTime: '2024-07-29T11:15:47',
      paymentMethod: '카드',
      totalAmount: 15000,
    },
    {
      id: 7,
      kioskID: 'kiosk4',
      amount: 15000,
      items: [
        { name: '바닐라라떼', quantity: 1, price: 5000 },
        { name: '전국1등커피', quantity: 1, price: 10000 },
      ],
      status: '미완',
      orderTime: '2024-07-29T11:15:47',
      paymentMethod: '카드',
      totalAmount: 15000,
    },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(initialOrders[0]);
  const navbarRef = useRef(null);

  const changeOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
  };

  const selectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target)) {
      setIsNavbarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <PosMainPageWrapper>
      <div ref={navbarRef}>
        <Navbar isOpen={isNavbarOpen} toggleNavbar={() => setIsNavbarOpen(!isNavbarOpen)} />
      </div>

      <OrderList
        orders={orders}
        onOrderSelect={selectOrder}
        onOrderComplete={(orderId) => changeOrderStatus(orderId, '완료')}
      />

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onComplete={() => changeOrderStatus(selectedOrder.id, '완료')}
        />
      )}
    </PosMainPageWrapper>
  );
}

export default PosMainPage;
