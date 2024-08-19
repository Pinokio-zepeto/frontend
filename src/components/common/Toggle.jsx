import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleWrapper = styled.button`
  width: ${(props) => props.size};
  height: ${(props) => `calc(${props.size} * 0.5)`};
  border-radius: ${(props) => `calc(${props.size} * 0.3)`};
  border: none;
  cursor: pointer;
  background-color: ${(props) => (props.isToggled ? props.color : '#cccccc')};
  position: relative;
  transition: background-color 0.3s ease;
`;

const Slider = styled.span`
  position: absolute;
  top: ${(props) => `calc(${props.size} * 0.04)`};
  left: ${(props) =>
    props.isToggled ? `calc(${props.size} * 0.53)` : `calc(${props.size} * 0.04)`};
  width: ${(props) => `calc(${props.size} * 0.42)`};
  height: ${(props) => `calc(${props.size} * 0.42)`};
  border-radius: 50%;
  background-color: white;
  transition: left 0.3s ease;
  /* transform: ${(props) => (props.isToggled ? 'translateX(50px)' : 'translateX(0)')}; */
`;

Toggle.defaultProps = {
  // 기본 색, 사이즈 설정
  color: '#7392ff',
  size: '2rem',
};

function Toggle({ value, setValue, color, size }) {
  const handleToggle = () => {
    setValue(!value);
  };

  return (
    <ToggleWrapper isToggled={value} onClick={handleToggle} color={color} size={size}>
      <Slider isToggled={value} size={size} />
    </ToggleWrapper>
  );
}

export default Toggle;
