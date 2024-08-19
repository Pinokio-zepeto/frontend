import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { getCategories } from '../../../apis/Category';
import { getItemByItemId, getItemsByCategoryId } from '../../../apis/Item';
import ElderMenuCategory from '../../../components/kiosk/ElderMenuCategory';
import MenuMain from '../../../components/kiosk/MenuMain';
import Cart from '../../../components/kiosk/Cart';
import MenuModal from '../../../components/kiosk/modal/MenuModal';
import { requestMeeting, enterRoom, leaveRoom } from '../../../apis/Room';
import useWebSocket from '../../../hooks/useWebSocket';
import { OpenVidu } from 'openvidu-browser';
import OpenViduVideoComponent from '../../../components/kiosk/OpenViduComponent';
import { useLocation } from 'react-router-dom';
import { getFavoriteItem, getRecentItem } from '../../../apis/Order';

const ElderMenuPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #efefef;
  min-width: 27rem;
`;

const KioskHeader = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px #d9d9d9 solid;
  background-color: white;
  width: 100%;
  height: 13rem;
`;

const KioskLeftHeader = styled.div`
  width: 30%;
  height: 100%;
`;

const KioskRightHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 70%;
`;

const ScreenStyle = styled.div`
  background-color: #222222;
  width: 90%;
  height: 90%;
  color: white;
  text-align: center;
  line-height: 10rem;
  font-family: 'CafeOhsquareAir';
`;

const Logo = styled.div`
  font-size: 3vh;
  color: #ec7348;
  font-family: 'Alfa Slab One', serif;
  font-weight: 400;
  font-style: normal;
  padding-left: 1vw;
  padding-top: 1vh;
  cursor: pointer;
`;

const KioskBody = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const KioskMenusStyle = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  height: calc(22rem - 2px);
  &::-webkit-scrollbar {
    display: none;
  }
`;

const KioskCategoriesStyle = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  height: calc(22rem - 2px);
  &::-webkit-scrollbar {
    display: none;
  }
`;

function ElderMenuPage() {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [modal, setModal] = useState(false);
  const selectedCategoryMounted = useRef(false);
  // 여기까지 기본 키오스크 기능

  const userData = useSelector((store) => store.user);
  // Redux

  const [openViduConnection, setOpenViduConnection] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [OV, setOV] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [cameraSession, setCameraSession] = useState(null);
  const [screenSession, setScreenSession] = useState(null);
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [publisher, setPublisher] = useState(null);
  const { sendMessage, lastMessage, isConnected, connect } = useWebSocket(userData.token);
  // 여기까지 비디오 기능

  const { state } = useLocation();
  // router 로 넘겨주는 parameter

  const isFirstRender = useRef(true);

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
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

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
      menu_data.responseList.map((menu) => {
        menu['count'] = 0;
      });
      setMenus(menu_data.responseList);
    }
  };

  const getRecommendedMenu = async () => {
    if (selectedCategory && userData) {
      let menu_data = [];
      let favoriteItem = await getFavoriteItem(state.customer.customerId);
      if (favoriteItem?.length > 0) {
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

  // 여기서부터 비디오 관련 기능
  const initializeWebSocket = useCallback(() => {
    if (!isConnected) {
      connect();
    }
  }, [isConnected, connect]);

  useEffect(() => {
    initializeWebSocket();
    return () => {
      // Cleanup logic if needed
    };
  }, [initializeWebSocket]);

  useEffect(() => {
    if (isConnected) {
      console.log('WebSocket 연결됨');
      requestRoomEnter();
      getCategory();
      isFirstRender.current = false;
    }
  }, [isConnected]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage.data);
        console.log('WebSocket 메시지 수신:', data);
        if (data.type === 'roomId') {
          console.log('상담요청 수락, roomId 수신:', data.roomId);
          setRoomId(data.roomId);
        }
      } catch (error) {
        console.error('WebSocket 메시지 파싱 오류:', error);
      }
    }
  }, [lastMessage]);

  const requestRoomEnter = useCallback(async () => {
    try {
      await requestMeeting();
      console.log('상담 요청 전송 완료');
    } catch (error) {
      console.error('상담 요청 실패:', error);
      // 여기에 사용자에게 오류를 표시하는 로직을 추가할 수 있습니다.
    }
  }, []);
  useEffect(() => {
    if (roomId && userData.typeInfo.kioskId && !openViduConnection) {
      console.log('enterRoom 호출:', roomId, userData.typeInfo.kioskId);
      enterRoom(roomId, userData.typeInfo.kioskId)
        .then((response) => {
          console.log('enterRoom 성공', response);
          const videoToken = response.videoToken;
          const screenToken = response.screenToken;
          initializeSession(videoToken, screenToken);
          setOpenViduConnection(true);
        })
        .catch((error) => {
          console.error('enterRoom 오류:', error);
        });
    }
  }, [roomId, userData.typeInfo.kioskId, openViduConnection]);

  const initializeSession = useCallback(
    async (videoToken, screenToken) => {
      if (isSessionInitialized) return;

      setIsSessionInitialized(true);

      const OV = new OpenVidu();
      const cameraSessionObj = OV.initSession();
      const screenSessionObj = OV.initSession();

      setCameraSession(cameraSessionObj);
      setScreenSession(screenSessionObj);

      cameraSessionObj.on('streamCreated', (event) => {
        const subscriber = cameraSessionObj.subscribe(event.stream, undefined);
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      });

      cameraSessionObj.on('streamDestroyed', (event) => {
        setSubscribers((prevSubscribers) =>
          prevSubscribers.filter((sub) => sub !== event.stream.streamManager)
        );
      });

      try {
        await cameraSessionObj.connect(videoToken, { clientData: userData.typeInfo.kioskId });
        console.log('카메라 세션 연결 성공');

        const publisher = await OV.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        });

        await cameraSessionObj.publish(publisher);
        setPublisher(publisher);
        console.log('카메라 스트림 발행 성공');

        await screenSessionObj.connect(screenToken, { clientData: 'screen' });
        console.log('화면 공유 세션 연결 성공');

        const requestScreenShare = async () => {
          try {
            const screenPublisher = await OV.initPublisherAsync(undefined, {
              videoSource: 'screen',
              publishAudio: false,
              publishVideo: true,
              resolution: '1280x720',
              frameRate: 30,
              insertMode: 'APPEND',
              mirror: false,
            });

            await screenSessionObj.publish(screenPublisher);
            console.log('화면 공유 스트림 발행 성공');
          } catch (error) {
            if (error.name === 'SCREEN_CAPTURE_DENIED') {
              console.warn('화면 공유가 사용자에 의해 취소되었습니다.');
            } else {
              console.error('화면 공유 스트림 발행 오류:', error);
            }
          }
        };

        await requestScreenShare();
      } catch (error) {
        console.error('세션 연결 또는 스트림 발행 오류:', error);
      }
    },
    [userData.typeInfo.kioskId]
  );

  const handleLeaveRoom = useCallback(async () => {
    try {
      setRoomId(null);
      if (cameraSession) {
        cameraSession.disconnect();
      }
      if (screenSession) {
        screenSession.disconnect();
      }
      await leaveRoom(roomId);
      setOpenViduConnection(false);
      console.log('상담 종료 성공');
    } catch (error) {
      console.error('상담 종료 오류:', error);
    }
  }, [cameraSession, screenSession, roomId]);

  return (
    <ElderMenuPageStyle>
      <KioskHeader>
        <KioskLeftHeader>
          <Logo>Pinokio</Logo>
        </KioskLeftHeader>
        <KioskRightHeader>
          <ScreenStyle>
            {subscribers.length > 0 && <OpenViduVideoComponent streamManager={subscribers[0]} />}
          </ScreenStyle>
          {(cameraSession || screenSession) && <button onClick={handleLeaveRoom}>상담 종료</button>}
        </KioskRightHeader>
      </KioskHeader>
      <KioskBody>
        <KioskCategoriesStyle>
          {categories.length > 0 && selectedCategory && (
            <ElderMenuCategory
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )}
        </KioskCategoriesStyle>
        <KioskMenusStyle>
          {menus.length > 0 && selectedCategory && (
            <MenuMain
              selectedCategory={selectedCategory}
              setSelectedMenu={setSelectedMenu}
              setModal={setModal}
              menus={menus}
            />
          )}
        </KioskMenusStyle>
      </KioskBody>
      <Cart cartItems={cartItems} setCartItems={setCartItems} />

      {modal && (
        <MenuModal
          item={selectedMenu}
          cartItems={cartItems}
          setCartItems={setCartItems}
          setModal={setModal}
          isElder={true}
        ></MenuModal>
      )}
    </ElderMenuPageStyle>
  );
}

export default ElderMenuPage;
