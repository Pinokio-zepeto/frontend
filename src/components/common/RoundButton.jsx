import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  --height: 0.7rem;
  border: 0.05rem solid;
  border-color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
  background-color: ${(props) =>
    props.theme === 'colored' ? (props.isElder ? '#EC7348' : '#7392ff') : 'white'};
  border-radius: var(--height);
  color: ${(props) =>
    props.theme === 'colored' ? 'white' : props.isElder ? '#EC7348' : '#7392ff'};
  width: 40%;
  height: calc(var(--height) * 2);
  line-height: calc(var(--height) * 2);
  text-align: center;
  font-family: 'CafeOhsquareAir';
  box-shadow: 0.05rem 0.1rem 0rem rgb(0 0 0 / 25%);
  pointer-events: ${(props) => (props.disabled ? 'none' : null)};
  opacity: ${(props) => (props.disabled ? '0.5' : null)};
`;

function RoundButton(props) {
  return <StyledButton {...props}>{props.text}</StyledButton>;
}

export default RoundButton;
