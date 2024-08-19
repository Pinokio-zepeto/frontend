import React from 'react';
import styled from 'styled-components';

const ToggleButton = styled.div`
  width: 100px;
  height: 50px;
  background-color: ${({ $toggled }) => ($toggled ? '#4caf50' : '#ccc')};
  border-radius: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  box-sizing: border-box;
  transition: background-color 0.3s;
`;

const ToggleCircle = styled.div`
  width: 40px;
  height: 40px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
  transform: ${({ $toggled }) => ($toggled ? 'translateX(50px)' : 'translateX(0)')};
`;

function ToggleSwitch({ isAvailable, setIsAvailable }) {
  const handleToggle = () => {
    setIsAvailable(!isAvailable);
  };

  return (
    <ToggleButton $toggled={!isAvailable} onClick={handleToggle}>
      <ToggleCircle $toggled={!isAvailable} />
    </ToggleButton>
  );
}

export default ToggleSwitch;
