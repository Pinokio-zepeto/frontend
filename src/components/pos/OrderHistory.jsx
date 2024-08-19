import React, { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styled from 'styled-components';
import RangeDatePicker from './RangeDatePicker';
import { getOrdersByRange } from '../../apis/Order';

const OrderHistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`;

const TableHeader = styled.tr`
  margin-top: 1rem;
  font-size: 1.5rem;
  padding-bottom: 0.2rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid black;
`;

const ColumnTitle = styled.th`
  width: 20%;
  display: flex;
  justify-content: center;
  font-size: 1rem;
`;

const ColumnContent = styled.div`
  width: 25%;
  display: flex;
  justify-content: center;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SearchBar = styled.input`
  width: 70%;
  height: 3rem;
  border: none;
  caret-color: #7392ff;

  font-size: 2rem;
  &:focus {
    outline: none;
  }
`;

const OrderList = styled.div`
  padding-top: 1rem;
`;

const OrderListEach = styled.div`
  width: 100%;
  height: 2rem;
  line-height: 2rem;
  border: ${(props) => (props.isSelected ? '1px solid #919191' : '1px solid white')};
  border-radius: 0.4rem;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0.2rem 0;
`;

const Product = styled.div`
  font-size: 12px;
`;
function OrderHistory({ selectedOrder, setSelectedOrder }) {
  const [orders, setOrders] = useState(null);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    console.log('orders');
    // console.log('dateRange is changed');
    getOrders();
    // setSelectedOrder(orders[0]);
  }, [startDate, endDate]);

  const getOrders = async () => {
    // console.log(startDate, endDate);
    const orders_temp = await getOrdersByRange(makeDateFormat(startDate), makeDateFormat(endDate));
    console.log('order list : ', orders_temp);
    setOrders(orders_temp);

    // setSelectedOrder(orders_temp[0]);
  };

  const makeDateFormat = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const dateStr = `${year}-${month}-${day}`;
    // 어떤 날짜여도 'YYYY-DD-YY'형식으로 변환!
    return dateStr;
  };
  const changePriceForm = (price) => {
    return '₩' + price.toLocaleString();
  };

  function makeTimeFormat(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    const period = hours >= 12 ? '오후' : '오전';
    const adjustedHours = hours % 12 || 12;

    return `${period} ${adjustedHours}:${minutes}:${seconds}`;
  }

  return (
    <OrderHistoryContainer>
      {/* <Header>결제 내역</Header> */}
      <FilterContainer>
        <SearchBar />
        <RangeDatePicker setDateRange={setDateRange} dateRange={dateRange} />
      </FilterContainer>
      <TableHeader>
        <ColumnTitle>주문 날짜</ColumnTitle>
        <ColumnTitle>상품 내역</ColumnTitle>

        <ColumnTitle>주문 시간</ColumnTitle>
        <ColumnTitle>총 금액</ColumnTitle>
        <ColumnTitle>결제 상태</ColumnTitle>
      </TableHeader>
      <OrderList>
        {orders &&
          orders.map((order) => (
            <OrderListEach
              key={order.orderId}
              onClick={() => setSelectedOrder(order)}
              isSelected={selectedOrder && order.orderId === selectedOrder.orderId}
            >
              <>
                <ColumnContent>{makeDateFormat(new Date(order.orderTime))}</ColumnContent>
                <ColumnContent>
                  <Product>
                    {order.items && order.items.length > 0
                      ? order.items.length === 1
                        ? `${order.items[0].itemName}`
                        : `${order.items[0].itemName} 외 ${order.items.length - 1}건`
                      : '상품이 없습니다.'}
                  </Product>
                </ColumnContent>
                <ColumnContent>{makeTimeFormat(new Date(order.orderTime))}</ColumnContent>
                <ColumnContent>{changePriceForm(order.totalAmount)}</ColumnContent>
                <ColumnContent>{order.status}</ColumnContent>
              </>
            </OrderListEach>
          ))}
      </OrderList>
    </OrderHistoryContainer>
  );
}

export default OrderHistory;
