import React, { useEffect, useRef, useState } from 'react';
import MenuCategoryCard from './MenuCategoryCard';
import styled from 'styled-components';

const MC = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  background-color: white;
  padding: 1rem 0;
`;

const Arrow = styled.div`
  text-align: center;
  font-size: 2vh;
  color: #cfcfcf;
  width: 10%;
  cursor: pointer;
`;
const MenuCategoryCards = styled.div`
  width: 80%;
  display: flex;
  flex-direction: row;
`;

function MenuCategory({ categories, selectedCategory, setSelectedCategory }) {
  const [nowFirst, setNowFirst] = useState(0);
  const leftArrow = useRef(null);
  const showSize = 4;
  useEffect(() => {
    // leftArrow.current.opacity = '0.5';
  });

  const decreaseNowFirst = () => {
    if (nowFirst > 0) {
      setNowFirst(nowFirst - 1);
    }
  };
  const increaseNowFirst = () => {
    if (nowFirst < categories.length - showSize) {
      setNowFirst(nowFirst + 1);
    }
  };

  return (
    <MC>
      <Arrow ref={leftArrow} onClick={decreaseNowFirst}>
        {'<'}
      </Arrow>
      <MenuCategoryCards>
        {categories &&
          categories
            .slice(nowFirst, nowFirst + showSize)
            .map((cat, index) => (
              <MenuCategoryCard
                key={index}
                cat={cat}
                setselectedcat={setSelectedCategory}
                selectedcat={selectedCategory}
                showSize={showSize}
              />
            ))}
      </MenuCategoryCards>

      <Arrow onClick={increaseNowFirst}>{'>'}</Arrow>
    </MC>
  );
}

export default MenuCategory;
