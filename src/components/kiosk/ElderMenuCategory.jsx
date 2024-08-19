import React from 'react';
import ElderMenuCategoryCard from './ElderMenuCategoryCard';
import styled from 'styled-components';

const EMC = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  /* height: 100%; */
  background-color: #d9d9d9;
`;

const MenuCategoryCards = styled.div`
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
`;

function MenuCategory({ categories, selectedCategory, setSelectedCategory }) {
  return (
    <EMC>
      <MenuCategoryCards>
        {categories &&
          categories.map((cat, index) => (
            <ElderMenuCategoryCard
              key={index}
              cat={cat}
              setselectedcat={setSelectedCategory}
              selectedcat={selectedCategory}
            />
          ))}
      </MenuCategoryCards>
    </EMC>
  );
}

export default MenuCategory;
