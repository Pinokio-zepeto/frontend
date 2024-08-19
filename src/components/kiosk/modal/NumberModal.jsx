import React, { useState } from 'react';
import styled from 'styled-components';
import { makeOrder } from '../../../apis/Order';
import { useNavigate, useLocation } from 'react-router-dom';

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
  width: 75%;
  height: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'CafeOhsquareAir';
`;

const Title = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 1.2rem;
  margin-top: 10%;
`;

const InputDisplay = styled.div`
  width: 65%;
  text-align: center;
  height: 2rem;
  border-bottom: 2px solid #d9d9d9;
  margin-top: 5%;
  line-height: 2rem;
  font-size: 1.6rem;
`;

const NumberPad = styled.div`
  width: 100%;
  display: grid;
  justify-content: center;

  grid-template-columns: repeat(3, 0fr);
  gap: 0.5rem;
  margin-top: 5%;
`;

const Button = styled.button`
  width: 4.5rem;
  height: 4.5rem;
  font-size: 1.8rem;
  border: none;
  background-color: #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 2px 3px 0px rgba(0, 0, 0, 0.3);
  color: #414141;

  &:last-child {
    background-color: #7392ff;
    color: white;
  }

  &:nth-child(10) {
    font-size: 1.2rem;
    background-color: #ec7348;
    color: white;
  }
`;

function NumberModal({ setModal, setPhoneNumber }) {
  const [number, setNumber] = useState('010-');
  const navigate = useNavigate();
  const { state } = useLocation();
  const handleNumberClick = (num) => {
    if (number.length < 13) {
      if (number.length === 8) {
        setNumber(number + '-' + num);
      } else {
        setNumber(number + num);
      }
    }
  };

  const handleDelete = () => {
    if (number.length === 10) {
      setNumber(number.slice(0, -2));
    } else if (number.length > 4) {
      setNumber(number.slice(0, -1));
    }
  };

  const goReceipt = async () => {
    const orderList = state.cartItems.map((item) => {
      return { itemId: item.itemId, quantity: item.count };
    });
    // 가입 하는 기능이 완성된다면 가입된 아이디의 customerId 값을 null 위치에 넣어주기
    await makeOrder(null, orderList);

    navigate('/kiosk/receipt', { state: state });
  };

  const registerNewCustomer = async () => {
    //가입하고
    //가입한 계정으로
    // goReceipt함수 실행
    goReceipt();
  };

  const handleConfirm = async () => {
    if (number.length === 13) {
      setPhoneNumber(number);
      setModal(false);
      await registerNewCustomer();
    }
  };

  return (
    <ModalBg>
      <Modal>
        <Title>전화번호 뒷 8자리를 입력해주세요.</Title>
        <InputDisplay>{number}</InputDisplay>
        <NumberPad>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button key={num} onClick={() => handleNumberClick(num)}>
              {num}
            </Button>
          ))}
          <Button onClick={handleDelete}>지우기</Button>
          <Button onClick={() => handleNumberClick(0)}>0</Button>
          <Button onClick={handleConfirm}>확인</Button>
        </NumberPad>
      </Modal>
    </ModalBg>
  );
}

export default NumberModal;
