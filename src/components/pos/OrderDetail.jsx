import React from 'react';
import styled from 'styled-components';

// 전체 컨테이너
const OrderDetailComponent = styled.div`
  width: 100%;
  margin: 20px auto;
  background-color: #fff;
`;

// 제목 컨테이너
const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

// 제목 항목
const TitleItem = styled.div`
  flex: 1;
  text-align: center;
  padding: 10px;
  background-color: #4575f3;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3a2cdb;
  }
`;

// 섹션 블록
const Section = styled.div`
  flex: 1;
  margin-right: 10px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

// 섹션 제목
const SectionTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
`;

// 상세 항목
const DetailItem = styled.p`
  margin: 10px 0;
  font-size: 16px;
  color: #555;
`;

// 주문 내역 리스트
const OrderList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 20px 0;
`;

const OrderListItem = styled.li`
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
`;

// 버튼 그룹
const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 5px; /* 버튼 간의 간격을 5px로 설정 */
  margin-top: 20px;
`;

// 버튼
const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:nth-child(2) {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
`;

function OrderDetail({ order, onComplete }) {
  return (
    <OrderDetailComponent>
      <TitleContainer>
        <TitleItem>주문 상세</TitleItem>
        <TitleItem>주문 내역</TitleItem>
        <TitleItem>결제 정보</TitleItem>
      </TitleContainer>

      <div style={{ display: 'flex', gap: '10px' }}>
        <Section>
          <SectionTitle>주문 상세</SectionTitle>
          <DetailItem>주문 번호: {order.id.toString().padStart(4, '0')}</DetailItem>
          <DetailItem>키오스크ID: {order.kioskID}</DetailItem>
          <DetailItem>주문 수량: {order.items.length}</DetailItem>
        </Section>

        <Section>
          <SectionTitle>주문 내역</SectionTitle>
          <OrderList>
            {order.items.map((item, index) => (
              <OrderListItem key={index}>
                {item.name} - {item.quantity}개 ({item.price * item.quantity}원)
              </OrderListItem>
            ))}
          </OrderList>
        </Section>

        <Section>
          <SectionTitle>결제 정보</SectionTitle>
          <DetailItem>결제 시간: {order.orderTime}</DetailItem>
          <DetailItem>결제 수단: {order.paymentMethod}</DetailItem>
          <DetailItem>총 결제 금액: {order.totalAmount.toLocaleString()}원</DetailItem>
        </Section>
      </div>

      <ButtonGroup>
        <Button onClick={() => onComplete('change')}>결제 수단 변경</Button>
        <Button onClick={() => onComplete('cancel')}>결제 취소</Button>
      </ButtonGroup>
    </OrderDetailComponent>
  );
}

export default OrderDetail;
