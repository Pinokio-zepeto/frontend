import React from 'react';
import { Link } from 'react-router-dom';
import LOGO from '../common/Logo';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../features/user/userSlice';
import Cookies from 'js-cookie';
import RotatingSquareIcon from './RotatingSquareIcon';

const NavbarContainer = styled.nav`
  width: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  width: 94%;
  height: 4rem;
  margin: 1rem;
  border-radius: 1rem;
  box-shadow: 2px 4px 0 rgba(0, 0, 0, 0.25);
  padding: 0 1rem;
  z-index: 1000;
`;

const NavbarMenu = styled.div`
  margin: 0;
  margin-left: 2vw;
  padding: 0;
  position: absolute;
  top: 6rem;
  left: ${(props) => (props.isOpen ? '0' : '-21vw')};
  width: 18vw;
  height: 85%;
  border-radius: 1vw;
  background-color: white;
  box-shadow: 2px 4px rgb(0, 0, 0, 0.25);
  flex-direction: column;
  transition: left 0.3s ease-in-out;
`;

const colors = ['#EC7348', '#FFC33F', '#C383D9', '#7392FF']; // 빨강, 노랑, 보라, 파랑

const NavbarLink = styled(Link)`
  text-decoration: none;
  /*color: inherit; // 상속받은 색상 사용 */
  display: flex;
  align-items: center;
  margin: 1rem 1rem;
  padding: 0.5rem 2rem;
  cursor: pointer;
  position: relative;
  background-color: transparent; // 기본 배경색은 투명
  border-radius: 1rem 0.3rem 0.3rem 1rem;
  color: black; // 기본 글자색은 검정색
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ index }) => colors[index % colors.length]}; // hover 시 배경색
    color: white; // hover 시 글자색
  }

  &:before {
    content: '';
    display: block;
    width: 0.5rem; // 점의 크기
    height: 0.5rem;
    border-radius: 50%;
    background-color: ${({ index }) => colors[index % colors.length]}; // 기본 점 색상
    position: absolute;
    left: 0.5rem; // 점의 위치 조정
    top: 50%;
    transform: translateY(-50%);
    z-index: 1; // 점이 배경보다 위에 표시되도록 설정
    transition: background-color 0.3s ease;
  }

  &:hover:before {
    background-color: white; // hover 시 점의 색상
  }
`;

const LogoLocation = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const LogOut = styled.button`
  position: absolute;
  bottom: 1rem; // distance from the bottom
  right: 1rem; // distance from the right
  color: #ec7348;
  background-color: white;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: #ffc33f;
  }
`;

function Navbar({ isOpen, toggleNavbar }) {
  const dispatch = useDispatch();

  // 메뉴 아이템 클릭 시 NavbarMenu를 닫기 위한 핸들러
  const handleItemClick = () => {
    if (isOpen) {
      toggleNavbar();
    }
  };

  const handleOnclick = () => {
    // User 정보 초기화
    dispatch(clearUser());

    // Token들 초기화.
    localStorage.setItem('accessToken', '');
    localStorage.setItem('refreshToken', '');
    Cookies.set('refreshToken', '');
  };

  const items = [
    { path: '/pos', text: '상품 관리' },
    { path: '/pos/order-list', text: '주문 내역' },
    { path: '/pos/kiosk-management', text: '키오스크 관리' },
    { path: '/pos/sales-report', text: '매출 리포트' },
  ];

  return (
    <NavbarContainer>
      <RotatingSquareIcon setIsOn={toggleNavbar} size={0.07} />
      <NavbarMenu isOpen={isOpen}>
        {items.map((item, index) => (
          // <NavbarItem key={index} index={index} onClick={handleItemClick}>
          <NavbarLink to={item.path} key={index} index={index} onClick={handleItemClick}>
            {item.text}
          </NavbarLink>
          // </NavbarItem>
        ))}
        <LogOut
          onClick={() => {
            handleOnclick();
          }}
        >
          로그아웃
        </LogOut>
      </NavbarMenu>
      <LogoLocation>
        <LOGO />
      </LogoLocation>
    </NavbarContainer>
  );
}

export default Navbar;
