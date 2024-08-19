import React from 'react';
import styled from 'styled-components';
import CartItem from './CartItem';
import CartTotal from './CartTotal';

const CartContainer = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
  border-top: 1px #d9d9d9 solid;
  width: 100%;
  height: 12rem;
  font-family: var(--font-CafeOhsquareAir);
`;

const CartLeft = styled.div`
  border-right: 1px #d9d9d9 solid;
  width: 70%;
  display: flex;
  flex-direction: column;
  padding: 0.8rem 0.8rem;
`;

const DeleteAllButton = styled.div`
  background-color: #414141;
  text-align: center;
  width: 5rem;
  color: white;
  box-shadow: 2px 2px black;
`;

const ItemContainer = styled.div`
  border: 1px #d9d9d9 solid;
  border-radius: 0.2rem;
  background-color: white;
  width: 100%;
  height: 8.5rem;
  margin-top: 0.8rem;
  box-shadow: 2px 4px rgb(0 0 0 / 30%);
  overflow-x: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
`;

function Cart({ cartItems, setCartItems }) {
  const deleteAll = () => {
    setCartItems([]);
  };

  return (
    <CartContainer>
      <CartLeft>
        <DeleteAllButton onClick={deleteAll}>전체삭제</DeleteAllButton>
        <ItemContainer>
          {cartItems.map((item, index) => (
            <CartItem key={index} item={item} cartItems={cartItems} setCartItems={setCartItems} />
          ))}
        </ItemContainer>
      </CartLeft>
      <CartTotal cartItems={cartItems} />
    </CartContainer>
  );
}

export default Cart;
