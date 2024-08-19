import React, { useState } from 'react';
import styled from 'styled-components';
import RoundButton from '../../common/RoundButton';
import { makeOrder } from '../../../apis/Order';
import { useLocation, useNavigate } from 'react-router-dom';

const ModalBg = styled.div`
  /* display: none; */
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  display: flex;
  width: 27rem;
  height: 47rem;
`;
const Modal = styled.div`
  background: white;
  border-radius: 0.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  height: 20%;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: space-evenly;
  align-items: center;
  overflow: hidden;
  font-family: 'CafeOhsquareAir';
`;

const ModalTitle = styled.div`
  font-size: 1.3rem;
`;

const ButtonCotainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`;

function AskRegisterModal({ setTurnNumberModal, setTurnAskRegisterModal }) {
  const navigate = useNavigate();
  const { state } = useLocation();

  const clickBeGuest = () => {
    setTurnAskRegisterModal(false);
    goReceipt();
  };

  const goReceipt = async () => {
    const orderList = state.cartItems.map((item) => {
      return { itemId: item.itemId, quantity: item.count };
    });
    await makeOrder(null, orderList);
    navigate('/kiosk/receipt', { state: state });
  };

  const clickRegister = () => {
    setTurnNumberModal(true);
    setTurnAskRegisterModal(false);
  };

  return (
    <ModalBg>
      <Modal>
        <ModalTitle>회원 가입하시겠습니까?</ModalTitle>
        <ButtonCotainer>
          <RoundButton onClick={clickBeGuest} text="비회원" />
          <RoundButton onClick={clickRegister} text="가입" theme="colored" />
        </ButtonCotainer>
      </Modal>
    </ModalBg>
  );
}

export default AskRegisterModal;
