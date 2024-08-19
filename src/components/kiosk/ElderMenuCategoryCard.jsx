import React, { useRef, useState } from 'react';
import styled from 'styled-components';

const EMCC = styled.div`
  background-color: ${(props) => (props.cat.id === props.selectedcat.id ? '#EC7348' : null)};
  color: ${(props) => (props.cat.id === props.selectedcat.id ? 'white' : null)};
  height: 2.5rem;

  font-size: ${(props) => (props.cat.name.length >= 7 ? '0.7rem' : '1rem')};
  font-family: var(--font-CafeOhsquareAir);
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

function MenuCategoryCard({ cat, setselectedcat, selectedcat }) {
  const borderRadius = useState('10px');
  const mccRef = useRef(null);

  const handleClick = () => {
    setselectedcat(cat);
  };

  return (
    <EMCC
      ref={mccRef}
      onClick={handleClick}
      selectedcat={selectedcat}
      cat={cat}
      borderRadius={borderRadius}
    >
      {cat.name}
    </EMCC>
  );
}

export default MenuCategoryCard;
