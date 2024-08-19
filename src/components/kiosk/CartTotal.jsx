import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const CT = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
`;
const CTtop = styled.div`
  display: flex;
  flex-direction: column;
  height: 9rem;
  padding-left: 1rem;
  padding-top: 1rem;
`;
const GoPaymentButton = styled.div`
  background-color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
  color: white;
  height: 3rem;
  text-align: center;
  line-height: 3rem;
  font-size: 1.3rem;
  pointer-events: ${(props) => (props.disabled ? 'none' : null)};
  opacity: ${(props) => (props.disabled ? '0.5' : null)};
`;

function CartTotal({ cartItems }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    calculatePrice();
  }, [cartItems]);

  const calculatePrice = () => {
    let ttl = 0;
    for (var i = 0; i < cartItems.length; i++) {
      console.log(cartItems);
      ttl += cartItems[i].price * cartItems[i].count;
    }
    setTotalPrice(ttl);
  };

  const changePriceForm = (price) => {
    return '₩' + price.toLocaleString();
  };

  const goPayment = () => {
    // 결제 버튼을 누르면 다음 페이지로 이동
    console.log('This is state : ', state);
    state['cartItems'] = cartItems;
    navigate('/kiosk/payment', { state: state });
  };

  return (
    <CT>
      <CTtop>
        <text>결제 금액</text>
        <text>{changePriceForm(totalPrice)}</text>
      </CTtop>
      <GoPaymentButton
        onClick={goPayment}
        isElder={state?.isElder}
        disabled={cartItems.length === 0}
      >
        결제하기
      </GoPaymentButton>
    </CT>
  );
}

export default CartTotal;
