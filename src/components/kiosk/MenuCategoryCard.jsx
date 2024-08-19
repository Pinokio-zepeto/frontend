import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const MCC = styled.div`
  background-color: ${(props) => (props.cat.id === props.selectedcat.id ? '#7392ff' : null)};
  color: ${(props) => (props.cat.id === props.selectedcat.id ? 'white' : null)};
  width: ${(props) => `${100 / props.showSize}%`};
  border-radius: ${(props) => props.borderRadius};

  font-size: ${(props) => (props.cat.name.length >= 7 ? '0.7rem' : '1rem')};
  font-family: var(--font-CafeOhsquareAir);
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

function MenuCategoryCard({ cat, setselectedcat, selectedcat, showSize }) {
  const [borderRadius, setBorderRadius] = useState('0px');
  const mccRef = useRef(null);

  useEffect(() => {
    const updateBorderRadius = () => {
      if (mccRef.current) {
        const height = mccRef.current.offsetHeight;
        setBorderRadius(`${height / 2}px`);
      }
    };

    // Update the border-radius when the component mounts or updates
    updateBorderRadius();

    // Optionally, add event listener for window resize to handle dynamic height changes
    window.addEventListener('resize', updateBorderRadius);
    return () => window.removeEventListener('resize', updateBorderRadius);
  }, [showSize]);

  const handleClick = () => {
    setselectedcat(cat);
  };

  return (
    <MCC
      ref={mccRef}
      onClick={handleClick}
      selectedcat={selectedcat}
      cat={cat}
      showSize={showSize}
      borderRadius={borderRadius}
    >
      {cat.name}
    </MCC>
  );
}

export default MenuCategoryCard;
