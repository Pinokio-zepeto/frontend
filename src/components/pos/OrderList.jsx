import React from 'react';
import styled from 'styled-components';

const OrderListComponent = styled.div`
  width: 100%;
`;

const Header = styled.div`
  background-color: #4575f3;
  color: white;
  height: 30px;
  padding: 3px;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: space-around;
  align-items: center; /* 수직 중앙 정렬 */
`;

const HeaderCategory = styled.span`
  flex: 1;
  text-align: center;
`;

const Body = styled.div``;

const OrderLists = styled.div`
  display: flex;
  justify-content: space-around;
  height: 60px;
  padding: 5px;
  background-color: ${({ index }) => (index % 2 === 0 ? '#f0f0f0' : 'white')};
  align-items: center; /* 수직 중앙 정렬 */
`;

const OrderListAttribute = styled.span`
  flex: 1;
  text-align: center;
  font-size: 14px;
`;

function OrderList({ orders, onOrderSelect, onOrderComplete }) {
  return (
    <OrderListComponent>
      <Header>
        <HeaderCategory>주문 번호</HeaderCategory>
        <HeaderCategory>키오스크ID</HeaderCategory>
        <HeaderCategory>판매 금액</HeaderCategory>
        <HeaderCategory>주문 내역</HeaderCategory>
        <HeaderCategory>완료 여부</HeaderCategory>
      </Header>
      <Body>
        {orders.map((order, index) => (
          <OrderLists
            key={order.id}
            onClick={() => onOrderSelect(order)}
            index={index} // index를 props로 전달
          >
            <OrderListAttribute>{order.id.toString().padStart(4, '0')}</OrderListAttribute>
            <OrderListAttribute>{order.kioskID}</OrderListAttribute>
            <OrderListAttribute>{order.amount.toLocaleString()}원</OrderListAttribute>
            <OrderListAttribute>
              {order.items.map((item) => item.name).join(', ')}
            </OrderListAttribute>
            <OrderListAttribute>{order.status === '완료' ? '완료' : '미완'}</OrderListAttribute>
          </OrderLists>
        ))}
      </Body>
    </OrderListComponent>
  );
}

export default OrderList;
