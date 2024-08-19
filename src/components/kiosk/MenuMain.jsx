import React, { useEffect } from 'react';
import MenuMainCard from './MenuMainCard';
import styled from 'styled-components';

const MM = styled.div`
  display: flex;
  flex-direction: row;
  width: 80%;
  padding-top: 2vh;
  flex-wrap: wrap;
`;

function MenuMain({ selectedCategory, setSelectedMenu, setModal, menus }) {
  // 한 줄에 showSize 개만큼 보여줌
  // const [showSize, setShowSize] = useState(3);
  // 메뉴들을 페이지에 맞게 담고 있는 배열
  // const [pages, setPages] = useState([]);

  useEffect(() => {
    /* 처움 렌더링할 때랑 카테고리 선택할 때마다 makeRow 실행 */
    // makeRow();
  }, [selectedCategory]);

  // const makeRow = () => {
  //   /* selectedCategory를 이용하여 해당되는 메뉴 가져오기 */

  //   const pagesLength = Math.floor((menus.length - 1) / showSize) + 1;
  //   let pages_temp = [];
  //   for (let p = 0; p < pagesLength; p++) {
  //     pages_temp.push([]);
  //     for (let i = 0; i < showSize; i++) {
  //       // console.log('p : ', p, pagesLength);
  //       if (p * showSize + i < menus.length) {
  //         pages_temp[p].push(menus[p * showSize + i]);
  //       } else {
  //         pages_temp[p].push({
  //           posId: null,
  //           categoryId: null,
  //           price: null,
  //           amount: null,
  //           name: null,
  //           detail: null,
  //           file: null,
  //           isScreen: null,
  //           isSoldOut: null,
  //         });
  //       }
  //     }
  //   }
  //   console.log(pages_temp);
  //   setPages(pages_temp);
  // };

  return (
    <MM>
      {menus.map((menu, index) => (
        <MenuMainCard
          key={index}
          menu={menu}
          setSelectedMenu={setSelectedMenu}
          setModal={setModal}
        />
      ))}
      {/* {pages.length > 0 &&
        pages.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', flexDirection: 'row' }}>
            {row.map(
              (menu, colIndex) =>
                menu && (
                  <MenuMainCard
                    key={colIndex}
                    menu={menu}
                    setSelectedMenu={setSelectedMenu}
                    setModal={setModal}
                  />
                )
            )}
          </div>
        ))} */}
    </MM>
  );
}

export default MenuMain;
