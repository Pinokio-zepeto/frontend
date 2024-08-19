import React, { useEffect, useRef, useState } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import CarouselPage from './CarouselPage';
import MenuPage from './younger/MenuPage';
import PaymentPage from './younger/PaymentPage';
import ReceiptPage from './younger/ReceiptPage';
import ElderMenuPage from './elder/ElderMenuPage';
import styled from 'styled-components';

const KioskForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4f4f9;
`;

const KioskOutline = styled.div`
  background-color: black;
  height: 58rem;
  border-radius: 1rem;
  width: 28.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
`;

const KioskInline = styled.div`
  background-color: white;
  height: 47rem;
  max-height: 47rem;
  width: 27rem;
  display: flex;
`;

const WarningMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;

  &.visible {
    opacity: 1;
  }
`;

function KioskIndex() {
  const navigate = useNavigate();
  const location = useLocation();
  const [warning, setWarning] = useState(false);
  const warningTimerRef = useRef(null);
  const navigateTimerRef = useRef(null);
  const idleTimeRef = useRef(0);
  const intervalRef = useRef(null);

  const resetTimers = () => {
    // 경고 메시지 숨김
    setWarning(false);

    // 타이머 초기화
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    if (navigateTimerRef.current) {
      clearTimeout(navigateTimerRef.current);
    }

    // 현재 페이지가 /kiosk가 아닐 때만 타이머 시작
    if (location.pathname !== '/kiosk') {
      // 50초 후 경고 메시지 표시
      warningTimerRef.current = setTimeout(() => {
        setWarning(true);

        // 10초 후 페이지 이동
        navigateTimerRef.current = setTimeout(() => {
          navigate('/kiosk');
        }, 10000); // 10000ms = 10초
      }, 50000); // 50000ms = 50초

      idleTimeRef.current = 0; // idleTimeRef 초기화
    }
  };

  useEffect(() => {
    resetTimers(); // 컴포넌트 마운트 시 타이머 시작

    const events = ['click', 'mousemove', 'keydown', 'scroll'];

    // 이벤트 리스너 추가
    events.forEach((event) => {
      window.addEventListener(event, resetTimers);
    });

    // 타이머 업데이트 인터벌 설정
    intervalRef.current = setInterval(() => {
      idleTimeRef.current += 1000; // 1초마다 idleTimeRef 증가

      // 60초 동안 아무 이벤트도 없으면 페이지 이동
      if (idleTimeRef.current >= 60000 && location.pathname !== '/kiosk') {
        clearInterval(intervalRef.current);
        navigate('/kiosk');
      }
    }, 1000); // 1000ms = 1초

    // 언마운트 시 이벤트 리스너 및 타이머 해제
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimers);
      });
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      if (navigateTimerRef.current) {
        clearTimeout(navigateTimerRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [navigate, location.pathname]);

  // /kiosk 경로로 이동할 때 타이머 초기화
  useEffect(() => {
    if (location.pathname === '/kiosk') {
      resetTimers();
    }
  }, [location.pathname]);

  return (
    <KioskForm>
      <KioskOutline>
        <KioskInline>
          {warning && (
            <WarningMessage className={warning ? 'visible' : ''}>
              10초 후에 메인 페이지로 이동됩니다.
            </WarningMessage>
          )}

          <Routes>
            <Route path="/" element={<CarouselPage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="receipt" element={<ReceiptPage />} />
            <Route path="elder-menu" element={<ElderMenuPage />} />
          </Routes>
        </KioskInline>
      </KioskOutline>
    </KioskForm>
  );
}

export default KioskIndex;
