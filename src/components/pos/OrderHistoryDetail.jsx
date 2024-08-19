import React, { useState } from 'react';
import styled from 'styled-components';
import { putOrderStatus } from '../../apis/Order';

const ModalBg = styled.div`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  z-index: 1001;
`;

const SvgContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OrderDetailContainer = styled.div`
  background-color: white;

  /* border: 1px solid #ccc; */
  max-width: 300px; /* Set a maximum width */
  position: absolute;
  top: 44%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* height: 25rem; */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 5%;
  right: 37%;
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  z-index: 2;
`;

const CancelledText = styled.span`
  text-decoration: line-through;
`;

const CancelledStatus = styled.span`
  color: #888;
  font-style: italic;
`;

const CancelledButton = styled.button`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  box-shadow: 1px 2px 0 rgb(0 0 0 / 0.25);
  background-color: white;
  border: 1px solid black;
  /* border-radius: 0.25rem; */
  &:hover {
    background-color: #ededed;
  }
`;

function OrderHistoryDetail({ selectedOrder, setSelectedOrder }) {
  const [isCancelled, setIsCancelled] = useState(selectedOrder.status === 'CANCELLED');

  const handleCancelOrder = async () => {
    console.log('handle cancel order');
    console.log(selectedOrder.orderId);
    const res = await putOrderStatus(selectedOrder.orderId);
    if (!isCancelled) {
      selectedOrder.status = 'CANCELLED';
      setIsCancelled(true);
    } else {
      console.log('check');
      selectedOrder.status = 'ACTIVE';
      setIsCancelled(false);
    }
    // console.log(res);
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedOrder(null);
  };

  const makeDateFormat = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const dateStr = `${year}-${month}-${day}`;
    // 어떤 날짜여도 'YYYY-DD-YY'형식으로 변환!
    return dateStr;
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
    <ModalBg>
      <SvgContainer>
        {/* SVG 배경 이미지 */}
        {/* <svg
          width="80%" // 부모의 너비에 맞춤
          height="80%" // 부모의 높이에 맞춤
          viewBox="0 0 514 909" // SVG의 전체 크기와 좌표계를 설정
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M501 0C501 5.52285 496.523 10 491 10C485.477 10 481 5.52285 481 0H475C475 5.52285 470.523 10 465 10C459.477 10 455 5.52285 455 0H449C449 5.52285 444.523 10 439 10C433.477 10 429 5.52285 429 0H423C423 5.52285 418.523 10 413 10C407.477 10 403 5.52285 403 0H397C397 5.52285 392.523 10 387 10C381.477 10 377 5.52285 377 0H371C371 5.52285 366.523 10 361 10C355.477 10 351 5.52285 351 0H345C345 5.52285 340.523 10 335 10C329.477 10 325 5.52285 325 0H319C319 5.52285 314.523 10 309 10C303.477 10 299 5.52285 299 0H293C293 5.52285 288.523 10 283 10C277.477 10 273 5.52285 273 0H267C267 5.52285 262.523 10 257 10C251.477 10 247 5.52285 247 0H241C241 5.52285 236.523 10 231 10C225.477 10 221 5.52285 221 0H215C215 5.52285 210.523 10 205 10C199.477 10 195 5.52285 195 0H189C189 5.52285 184.523 10 179 10C173.477 10 169 5.52285 169 0H163C163 5.52285 158.523 10 153 10C147.477 10 143 5.52285 143 0H137C137 5.52285 132.523 10 127 10C121.477 10 117 5.52285 117 0H111C111 5.52285 106.523 10 101 10C95.4771 10 91 5.52285 91 0H85C85 5.52285 80.5229 10 75 10C69.4771 10 65 5.52285 65 0H59C59 5.52285 54.5229 10 49 10C43.4772 10 39 5.52285 39 0H33C33 5.52285 28.5228 10 23 10C17.4772 10 13 5.52285 13 0H0V909H13C13 903.477 17.4772 899 23 899C28.5228 899 33 903.477 33 909H39C39 903.477 43.4772 899 49 899C54.5229 899 59 903.477 59 909H65C65 903.477 69.4771 899 75 899C80.5229 899 85 903.477 85 909H91C91 903.477 95.4771 899 101 899C106.523 899 111 903.477 111 909H117C117 903.477 121.477 899 127 899C132.523 899 137 903.477 137 909H143C143 903.477 147.477 899 153 899C158.523 899 163 903.477 163 909H169C169 903.477 173.477 899 179 899C184.523 899 189 903.477 189 909H195C195 903.477 199.477 899 205 899C210.523 899 215 903.477 215 909H221C221 903.477 225.477 899 231 899C236.523 899 241 903.477 241 909H247C247 903.477 251.477 899 257 899C262.523 899 267 903.477 267 909H273C273 903.477 277.477 899 283 899C288.523 899 293 903.477 293 909H299C299 903.477 303.477 899 309 899C314.523 899 319 903.477 319 909H325C325 903.477 329.477 899 335 899C340.523 899 345 903.477 345 909H351C351 903.477 355.477 899 361 899C366.523 899 371 903.477 371 909H377C377 903.477 381.477 899 387 899C392.523 899 397 903.477 397 909H403C403 903.477 407.477 899 413 899C418.523 899 423 903.477 423 909H429C429 903.477 433.477 899 439 899C444.523 899 449 903.477 449 909H455C455 903.477 459.477 899 465 899C470.523 899 475 903.477 475 909H481C481 903.477 485.477 899 491 899C496.523 899 501 903.477 501 909H514V0H501Z"
            fill="white"
          />
        </svg> */}
        <img src="/ReceiptForm.svg" width="400rem" z-index="51" />
        <CloseButton onClick={handleClose}>&times;</CloseButton>

        <OrderDetailContainer>
          <img src="/LongLine.svg" position="relative" z-index="52" width="350rem" />
          <br />
          {/* <hr style={{ marginTop: '30px', borderTop: 'dashed 1px' }} /> */}
          {/* <Logo color={'black'} /> */}
          {/* <hr style={{ marginTop: '30px', borderTop: 'dashed 1px' }} /> */}
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <div>결제 날짜 </div>
            <div>{makeDateFormat(new Date(selectedOrder.orderTime))}</div>
          </div>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <div>결제 시간 </div>
            <div>{makeTimeFormat(new Date(selectedOrder.orderTime))}</div>
          </div>
          {!isCancelled ? (
            <>
              <br />
              <br />
              <br />
            </>
          ) : (
            <>
              <br />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <div>취소 날짜 </div>
                <div>{makeDateFormat(new Date())}</div>
              </div>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <div>취소 시간 </div>
                <div>{makeTimeFormat(new Date())}</div>
              </div>
            </>
          )}
          <br />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <div>승인 상태:</div>
            <div>{isCancelled ? '취소됨' : '결제완료'}</div>
          </div>
          <div>
            <br />
            <img src="/ShortLine.svg" position="relative" z-index="52" width="350rem" />

            {/* <hr style={{ marginTop: '30px', borderTop: 'dashed 1px' }} /> */}
            <table style={{ width: '100%', justifyContent: 'space-between' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center', width: '33%' }}>상품 이름</th>
                  <th style={{ textAlign: 'center', width: '33%' }}>수량</th>
                  <th style={{ textAlign: 'center' }}>가격</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'center', width: '33%' }}>{item.itemName}</td>
                    <td style={{ textAlign: 'center', width: '33%' }}>{item.quantity}개</td>
                    <td style={{ textAlign: 'center' }}>{item.price * item.quantity}원</td>
                  </tr>
                ))}
                <br />
                <tr>
                  <td style={{ textAlign: 'center', width: '33%' }}>결제 금액:</td> <td></td>
                  <td style={{ textAlign: 'center' }}>
                    {isCancelled ? (
                      <CancelledText>{selectedOrder.totalAmount}원</CancelledText>
                    ) : (
                      `${selectedOrder.totalAmount}원`
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              // marginTop: '6rem',
            }}
          >
            {!isCancelled ? (
              <CancelledButton onClick={handleCancelOrder}>결제 취소</CancelledButton>
            ) : (
              <CancelledButton onClick={handleCancelOrder}>취소 결제 복구</CancelledButton>
            )}
          </div>
        </OrderDetailContainer>
      </SvgContainer>
    </ModalBg>
  );
}

export default OrderHistoryDetail;
