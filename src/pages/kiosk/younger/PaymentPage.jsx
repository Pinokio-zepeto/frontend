import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { makeOrder } from '../../../apis/Order';
import OpenViduVideoComponent from '../../../components/kiosk/OpenViduComponent';
import AskRegisterModal from '../../../components/kiosk/modal/AskRegisterModal';
import NumberModal from '../../../components/kiosk/modal/NumberModal';

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
  cursor: pointer;
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
  background-color: #fffdfd;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const KioskInnerCardTitle = styled.div`
  font-family: 'CafeOhsquareAir';
  font-size: 1em;
  margin-bottom: 0.2rem;
`;

const KioskInnerCardSubTitle = styled.div`
  font-family: 'CafeOhsquareAir';
  color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
  font-size: 0.5em;
  margin-bottom: 1rem;
`;
const KioskInnerCardImage = styled.img``;

function PaymentPage() {
  // 결제가 끝나면 회원 가입을 할 것인지 묻는다.
  // 회원가입을 하지 않는다면 바로 post order 요청을 보내고,
  // 가입을 누른다면 전화번호를 입력후 회원 정보로 post order를 보낸다.
  const navigate = useNavigate();
  const { state } = useLocation();
  const [subscribers, setSubscribers] = useState([]);
  const [cameraSession, setCameraSession] = useState(null);
  const [screenSession, setScreenSession] = useState(null);
  const [turnAskRegisterModal, setTurnAskRegisterModal] = useState(false);
  const [turnNumberModal, setTurnNumberModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    console.log('state', state);
  }, []);

  const goReceipt = async () => {
    const orderList = state.cartItems.map((item) => {
      return { itemId: item.itemId, quantity: item.count };
    });
    await makeOrder(state.customer.customerId, orderList);

    navigate('/kiosk/receipt', { state: state });
  };

  const goBack = () => {
    // 장바구니에 담아둔 주문 목록 등을 가지고 있어야 한다.
    if (state.isElder) {
      navigate('/kiosk/elder-menu', { state: state });
    } else {
      navigate('/kiosk/menu', { state: state });
    }
  };
  const payForOrder = () => {
    if (state.customer.customerId === 'guest') {
      setTurnAskRegisterModal(true);
    } else {
      goReceipt();
    }
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
          <KioskCenterCardTitle>결제 수단을 선택해주세요.</KioskCenterCardTitle>
          <KioskCenterCardContainer>
            <KioskCenterCardButton onClick={payForOrder}>
              <KioskInnerCardTitle>신용카드</KioskInnerCardTitle>
              <KioskInnerCardSubTitle isElder={state.isElder}>
                체크카드 / 삼성페이
              </KioskInnerCardSubTitle>
              <KioskInnerCardImage src="/CreditCard.svg" width="80rem"></KioskInnerCardImage>
            </KioskCenterCardButton>
            <KioskCenterCardButton onClick={payForOrder}>
              <KioskInnerCardTitle>카카오페이</KioskInnerCardTitle>
              <KioskInnerCardSubTitle isElder={state.isElder}>앱 전용</KioskInnerCardSubTitle>
              <KioskInnerCardImage src="/KakaoTalk_logo.svg" width="60rem"></KioskInnerCardImage>
            </KioskCenterCardButton>
          </KioskCenterCardContainer>
        </KioskCenterCard>
      </KioskBody>
      {state.isElder && <ScreenStyle></ScreenStyle>}
      {turnAskRegisterModal && (
        <AskRegisterModal
          setTurnNumberModal={setTurnNumberModal}
          setTurnAskRegisterModal={setTurnAskRegisterModal}
        ></AskRegisterModal>
      )}
      {turnNumberModal && (
        <NumberModal setModal={setTurnNumberModal} setPhoneNumber={setPhoneNumber}></NumberModal>
      )}
    </PageStyle>
  );
}

export default PaymentPage;
