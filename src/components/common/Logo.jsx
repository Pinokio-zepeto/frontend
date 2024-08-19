import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LogoStyle = styled.text`
  font-size: ${(props) => props.size};
  color: ${(props) => (props.color ? props.color : '#7392ff')};
  font-family: 'Alfa Slab One';
  font-weight: 400;
  font-style: normal;
  /* text-shadow: -1px 0px grey, 0px 1px grey, 1px 0px grey, 0px -1px grey; */
  text-shadow: 1px 2px #bdc3c7;
  cursor: pointer; /* 클릭 가능하게 표시 */
`;

LogoStyle.defaultProps = {
  size: '3rem',
};

function Logo({ onClick, size, color }) {
  const navigate = useNavigate();
  const userType = useSelector((state) => state.user.type);

  const handleClick = () => {
    // 조건에 따라 경로를 설정
    if (userType === 'pos') {
      navigate('/pos');
    } else if (userType === 'advisor') {
      navigate('/advisor');
    } else if (userType === 'kiosk') {
      navigate('/kiosk');
    }
  };

  return (
    <LogoStyle
      onClick={() => {
        handleClick();
        if (onClick) onClick();
      }}
      size={size}
      color={color}
    >
      Pinokio
    </LogoStyle>
  );
}

export default Logo;
