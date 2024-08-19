import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MenuCategory from '../../../components/kiosk/MenuCategory';
import MenuMain from '../../../components/kiosk/MenuMain';
import Cart from '../../../components/kiosk/Cart';
import MenuModal from '../../../components/kiosk/modal/MenuModal';
import { useSelector } from 'react-redux';
import { getCategories } from '../../../apis/Category';
import { getItemByItemId, getItemsByCategoryId } from '../../../apis/Item';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { getFavoriteItem, getRecentItem } from '../../../apis/Order';

const MenuPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #efefef;
  min-width: 27rem;
`;

const KioskHeader = styled.div`
  border-bottom: 1px #d9d9d9 solid;
  background-color: white;
  width: 100%;
  height: 5rem;
`;

const Logo = styled.div`
  font-size: 3vh;
  color: #7392ff;
  font-family: 'Alfa Slab One', serif;
  font-weight: 400;
  font-style: normal;
  padding-left: 1vw;
  padding-top: 1vh;
  cursor: pointer;
`;

const KioskBody = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  height: calc(30rem - 2px);
  &::-webkit-scrollbar {
    display: none;
  }
`;

function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [modal, setModal] = useState(false);

  const categoriesMounted = useRef(false);
  const selectedCategoryMounted = useRef(false);
  const userData = useSelector((store) => store.user);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    console.log('first rendering');
    getCategory();
    console.log('THIS IS STATE : ', state);

    // 처음 렌더링 했을 때 순서 getCategory ->  useEffect(categories) -> useEffect(selectedCategory)
  }, []);

  const getCategory = async () => {
    /* axios를 이용하여 category를 가져온다. */
    const category_data = await getCategories(userData.typeInfo.posId);
    console.log('received categories datas : ', category_data);

    if (state.customer.customerId !== 'guest') {
      category_data.responseList.unshift({
        id: 'recommended',
        name: '추천 메뉴',
      });
    }
    setCategories(category_data.responseList);
  };

  useEffect(() => {
    // payment 페이지로 넘어갔다가 돌아올 때 cartItems를 유지하기 위해
    console.log('useEffect state cartItems : ', state.cartItems);
    if (state.cartItems) {
      setCartItems(state.cartItems);
    }
  }, []);

  useEffect(() => {
    if (!categoriesMounted.current) {
      console.log('categories mounted : ');
      categoriesMounted.current = true;
    } else {
      console.log('categories updated');
      console.log(categories);
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  useEffect(() => {
    if (!selectedCategoryMounted.current) {
      // mount되었을 때는 안되게, update 되었을 때는 useEffect가 실행되게 하기 위해
      console.log('selectedCategory mounted : ');
      selectedCategoryMounted.current = true;
    } else if (selectedCategory.id !== 'recommended') {
      // 추천 메뉴일 따로 예외 처리를 해주어야 한다.
      console.log('selectedCategory updated');
      console.log(selectedCategory);
      getMenu();
    } else if (selectedCategory.id === 'recommended') {
      console.log('selectedCategory Id is recommended');
      getRecommendedMenu();
    }
  }, [selectedCategory]);

  const getMenu = async () => {
    if (selectedCategory && userData) {
      const menu_data = await getItemsByCategoryId(selectedCategory.id);
      console.log('received menus datas : ', menu_data);
      // 화면에 보여줄 데이터만 필터링 (isScreen이 YES인 경우)
      const filteredMenus = menu_data.responseList
        .filter((menu) => menu.isScreen === 'YES')
        .map((menu) => {
          menu['count'] = 0; // count 초기화
          return menu;
        });
      setMenus(filteredMenus);
    }
  };
  const getRecommendedMenu = async () => {
    if (selectedCategory && userData) {
      let menu_data = [];
      let favoriteItem = await getFavoriteItem(state.customer.customerId);
      if (favoriteItem?.length > 0) {
        console.log('say hello');
        console.log('fav', favoriteItem[0]);
        favoriteItem = await getItemByItemId(favoriteItem[0].itemId);
        console.log('favoriteItem : ', favoriteItem);
        menu_data.push(favoriteItem);
      }

      let recentItem = await getRecentItem(state.customer.customerId);
      if (
        recentItem.orderItems[0].itemId !== favoriteItem.itemId &&
        recentItem.orderItems?.length > 0
      ) {
        recentItem = await getItemByItemId(recentItem.orderItems[0].itemId);
        console.log('recentItems : ', recentItem);
        menu_data.push(recentItem);
      }

      console.log('received menus datas : ', menu_data);
      // 화면에 보여줄 데이터만 필터링 (isScreen이 YES인 경우)
      const filteredMenus = menu_data
        .filter((menu) => menu.isScreen === 'YES')
        .map((menu) => {
          menu['count'] = 0; // count 초기화
          return menu;
        });
      setMenus(filteredMenus);
    }
  };

  const handleClick = () => {
    navigate('/kiosk/menu');
  };

  return (
    <MenuPageStyle>
      <KioskHeader>
        <Logo>Pinokio</Logo>
        {categories.length > 0 && selectedCategory && (
          <MenuCategory
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}
      </KioskHeader>
      <KioskBody>
        {menus.length > 0 && selectedCategory && (
          <MenuMain
            selectedCategory={selectedCategory}
            setSelectedMenu={setSelectedMenu}
            setModal={setModal}
            menus={menus}
          />
        )}
      </KioskBody>
      <Cart
        cartItems={cartItems}
        setCartItems={setCartItems}
        isElder={state.isElder}
        state={state}
      />

      {modal && (
        <MenuModal
          item={selectedMenu}
          cartItems={cartItems}
          setCartItems={setCartItems}
          setModal={setModal}
          isElder={false}
        ></MenuModal>
      )}
    </MenuPageStyle>
  );
}

export default MenuPage;
