import React, { useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as PlusIcon } from '../../assets/images/plus_icon.svg';
import { ReactComponent as MinusIcon } from '../../assets/images/minus_icon.svg';

const UpDownButtonsStyle = styled.div`
  --height: ${(props) => props.size};
  display: flex;
  flex-direction: row;
  width: calc(var(--height) * 3);
  height: auto;
  border: calc(var(--height) / 60) solid #d9d9d9;
  border-radius: calc(var(--height) * 0.17);
  font-size: calc(var(--height) * 0.8);
  line-height: var(--height);
`;

const MenuCount = styled.div`
  --height: ${(props) => props.size};
  width: var(--height);
  height: var(--height);
  display: flex;
  justify-content: center;
  align-items: center;
`;

function UpDownButtons({ value, setValue, size, color }) {
  // console.log(size);
  return (
    <UpDownButtonsStyle size={size} color={color}>
      <MinusIcon
        onClick={() => (value > 0 ? setValue(value - 1) : null)}
        width={size}
        height={size}
      ></MinusIcon>
      <MenuCount size={size}>{value}</MenuCount>
      <PlusIcon onClick={() => setValue(value + 1)} width={size} height={size}></PlusIcon>
    </UpDownButtonsStyle>
  );
}

export default UpDownButtons;
