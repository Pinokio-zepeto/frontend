import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const CI = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: white;
  height: 1.6rem;
  font-size: 0.7rem;

  border-bottom: 1px #d9d9d9 solid;
`;

const CartItemName = styled.div`
  margin: 0 1rem;
`;

const CartItemRight = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 40%;
  /* background-color: yellow; */
`;

const CountButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  width: 20%;
  margin-left: 0.5rem;
`;

const CountUpButton = styled.div`
  width: 0.5rem;
`;

const CountDownButton = styled.div``;

const DeleteButton = styled.div`
  color: #ec7348;
  margin-right: 0.5rem;
  line-height: 1rem;
`;

function CartItem({ item, cartItems, setCartItems }) {
  // const { state } = useLocation();
  // console.log('state in cartitem', state);
  const changeCount = (count) => {
    for (var i = 0; i < cartItems.length; i++) {
      if (cartItems[i].name === item.name) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[i].count += count;
        if (updatedCartItems[i].count <= 0) {
          updatedCartItems.splice(i, 1);
        }
        setCartItems(updatedCartItems);
        return;
      }
    }
  };

  const changePriceForm = (price) => {
    return '₩' + price.toLocaleString();
  };

  return (
    <CI>
      <CartItemName>{item.name}</CartItemName>
      <CartItemRight>
        <CountButtonsContainer>
          <CountUpButton onClick={() => changeCount(+1)}>+</CountUpButton>
          <text>{item.count}</text>
          <CountDownButton onClick={() => changeCount(-1)}>-</CountDownButton>
        </CountButtonsContainer>
        <text>{changePriceForm(item.price)}</text>
        <DeleteButton onClick={() => changeCount(-1 * item.count)}>x</DeleteButton>
      </CartItemRight>
    </CI>
  );
}

export default CartItem;
