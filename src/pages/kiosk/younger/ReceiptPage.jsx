import React from 'react';
import { Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { makeOrder } from '../../../apis/Order';

const PageStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #efefef;
  min-width: 27rem;
  position: relative;
`;

const Logo = styled.div`
  font-size: 3vh;
  color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
  font-family: 'Alfa Slab One', serif;
  font-weight: 400;
  font-style: normal;
  padding-left: 1vw;
  padding-top: 1vh;
`;

const KioskLeftHeader = styled.div`
  width: 30%;
  height: 100%;
`;

const KioskRightHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
`;

const ScreenStyle = styled.div`
  position: absolute;
  background-color: #222222;
  top: 1rem;
  right: 1rem;
  width: 60%;
  height: 20%;
  color: white;
  text-align: center;
  line-height: 10rem;
  font-family: 'CafeOhsquareAir';
`;
const BackButton = styled.div`
  font-family: 'CafeOhsquareAir';
  display: flex;
  text-align: center;
`;

const Arrow = styled.div`
  text-align: center;
  font-size: 1rem;
  color: #cfcfcf;
  line-height: 2rem;
  margin: 0 0.5rem;
`;

const BackButtonText = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: #414141;
  line-height: 2rem;
`;

const KioskHeader = styled.div`
  border-bottom: 1px #d9d9d9 solid;
  background-color: white;
  width: 100%;
  height: 5rem;
`;

const KioskBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const KioskCenterCard = styled.div`
  width: 70%;
  height: 40%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 1px 2px 1px rgb(0 0 0 / 25%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const KioskCenterCardTitle = styled.div`
  font-family: 'CafeOhsquareAir';
  margin: 12% 0;
`;

const KioskCenterCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 70%;
  height: 50%;
`;

const KioskCenterCardButton = styled.div`
  box-shadow: inset 1px 2px 1px rgb(0 0 0 / 25%);
  width: 47%;
  height: 100%;
  background-color: #f5f5f5;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const KioskInnerCardTitle = styled.div`
  font-family: 'CafeOhsquareAir';
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
`;

const KioskInnerCardNumber = styled.div`
  font-family: 'CafeOhsquareAir';
  color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
  font-size: 2em;
  margin-bottom: 1rem;
`;

const KioskInnerCardImage = styled.img``;

function ReceiptPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const finishOrder = () => {
    navigate('/kiosk/');
  };

  const goBack = () => {
    // 장바구니에 담아둔 주문 목록 등을 가지고 있어야 한다.
    navigate('/kiosk/payment', { state: state });
  };

  return (
    <PageStyle>
      <KioskHeader>
        <Logo isElder={state.isElder}>Pinokio</Logo>
        <BackButton>
          <Arrow>{'<'}</Arrow>
          <BackButtonText onClick={goBack}>뒤로가기</BackButtonText>
        </BackButton>
      </KioskHeader>
      <KioskBody>
        <KioskCenterCard>
          <KioskCenterCardTitle>결제가 완료되었습니다.</KioskCenterCardTitle>
          <KioskCenterCardContainer>
            <KioskCenterCardButton onClick={finishOrder}>
              <KioskInnerCardTitle>영수증 받기</KioskInnerCardTitle>
              <KioskInnerCardImage src="/Receipt.svg" width="60rem"></KioskInnerCardImage>
            </KioskCenterCardButton>
            <KioskCenterCardButton onClick={finishOrder}>
              <KioskInnerCardTitle>주문번호만 받기</KioskInnerCardTitle>
              <KioskInnerCardNumber isElder={state.isElder}>
                {Math.floor(100 + Math.random() * 900)}
              </KioskInnerCardNumber>
            </KioskCenterCardButton>
          </KioskCenterCardContainer>
        </KioskCenterCard>
      </KioskBody>
      {state.isElder && <ScreenStyle></ScreenStyle>}
    </PageStyle>
  );
}

export default ReceiptPage;
