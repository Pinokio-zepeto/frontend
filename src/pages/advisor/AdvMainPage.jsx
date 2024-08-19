import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Modal from 'react-modal';
import Logo from '../../components/common/Logo';
import CustomerVideo from '../../components/advisor/CustomerVideo';
import CustomerKiosk from '../../components/advisor/CustomerKiosk';
import CustomerWaiting from '../../components/advisor/CustomerWaiting';
import Toggle from '../../components/common/Toggle';
import useWebSocket from '../../hooks/useWebSocket';
import { makeMeetingRoom, acceptMeeting, deleteMeetingRoom, rejectMeeting } from '../../apis/Room';
import {
  setAvailability,
  setRoomInfo,
  connectKiosk,
  updateKiosk,
  disconnectKiosk,
  setActiveKiosk,
  resetAdvisor,
  updateKioskStream,
} from '../../features/advisor/AdvisorSlice';
import { OpenVidu } from 'openvidu-browser';

import Toast from '../../components/common/Toast';
import { clearUser } from '../../features/user/userSlice';
import Cookies from 'js-cookie';

import { Resizable } from 'react-resizable';
import UpDownButtons from '../../components/common/UpDownButtons';
Modal.setAppElement('#root');

// 스타일 컴포넌트 정의
const AdvMainPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 1000px;
  overflow: hidden; /* 스크롤 제거 */
`;

const AdvHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AdvBody = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 500px;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(40% - 0.5rem);
`;

const LeftTopSection = styled.div`
  width: 100%;
  height: calc(60% - 0.5rem);
`;

const LeftMiddleBarRef = styled.div`
  width: 100%;
  height: 1rem;
`;

const LeftBottomSection = styled.div`
  width: 100%;
  height: calc(40% - 0.5rem);
`;

const MiddleBar = styled.div`
  width: 1rem;
  background-color: blue;
  /* border: 1px solid black; */
  cursor: pointer;
  transform: ${(props) => `translateY(${props.deltaY}px)`};
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(60% - 0.5rem);
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRightText = styled.div`
  font-family: 'CafeOhsquareAir';
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  margin: 0 1rem;
`;

const MaxButtonContainer = styled.div`
  display: flex;
`;

const ToggleContainer = styled.div`
  display: flex;
`;
const LogOut = styled.button`
  box-shadow: 1px 2px 0 rgb(0 0 0 / 0.25);
  background-color: white;
  border: 1px solid black;
  &:hover {
    background-color: #ededed;
  }
  margin-left: 2rem;
`;

const HeaderLeft = styled.div`
  display: flex;
  padding: 1rem;
`;
const AdvMainPage = () => {
  const advisorData = useSelector((state) => state.advisor);
  const userData = useSelector((state) => state.user);
  /*
    isAvailable : 거절 모드의 on / off 여부
    currentConnections : 현재 연결된 고객 수
  */
  const { isAvailable, currentConnections, maxConnections, roomToken, roomId, connectedKiosks } =
    advisorData;

  // deltaY : 가운데 Bar의 y축 이동 거리 (개발 예쩡)
  const [deltaY, setDeltaY] = useState(0);
  const handleScroll = (event) => {
    console.log('deedd');
    console.log(event.target.scrollTop);
    setDeltaY(event.target.scrollTop);
  };

  const middlebarRef = useRef();

  const leftmiddlebarRef = useRef();

  /*  
  isAccept : 연결 요청에 대한 답변
  요청이 오지 않아 toast가 뜨지 않은 상태는 "no request",
  요청이 들어왔지만 상담원이 아직 승낙/거절을 하지 않은 상태는 "waiting"
  요청에 대해 승낙을 하면 "accept"
  요청에 대해 거절을 하면 "reject"
  --> 일단 이렇게 써놨는데 만약 바꾸고 싶다면 바꾸되 이 주석도 그에 맞게 바꿔줘!!
  */
  const [isAccept, setIsAccept] = useState('waiting');

  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [consultationRequest, setConsultationRequest] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const { sendMessage, lastMessage, isConnected, connect } = useWebSocket(userData.token);

  const [OV, setOV] = useState(null);
  const [session, setSession] = useState(null);
  const [publisher, setPublisher] = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [screenSubscriber, setScreenSubscriber] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeAdvisor = useCallback(async () => {
    if (!isConnected) {
      try {
        const response = await makeMeetingRoom();
        console.log(`방 생성 응답:`, response);
        dispatch(setRoomInfo(response));
        connect();
      } catch (error) {
        console.error(`방 생성 오류:`, error);
      }
    }
  }, [dispatch, connect, isConnected]);

  const handleCustomerDisconnect = useCallback(
    (connectionId) => {
      dispatch(disconnectKiosk(connectionId));
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((sub) => sub.stream.connection.connectionId !== connectionId)
      );
    },
    [dispatch]
  );

  const handleCustomerConnect = useCallback(
    (connectionId) => {
      dispatch(
        updateKiosk({
          connectionId,
        })
      );
      console.log(`Attempting to update kiosk with connectionId: ${connectionId}`);
    },
    [dispatch]
  );

  const handleOnclick = () => {
    // User 정보 초기화
    dispatch(clearUser());
    dispatch(resetAdvisor());

    // Token들 초기화.
    localStorage.setItem('accessToken', '');
    localStorage.setItem('refreshToken', '');
    Cookies.set('refreshToken', '');
  };

  const initializeSession = useCallback(
    async (roomId, token) => {
      const ov = new OpenVidu();
      setOV(ov);

      const session = ov.initSession();
      setSession(session);

      session.on('streamCreated', (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        console.log('subscriber', subscriber);
        subscriber.on('streamPlaying', (e) => {
          console.log('Subscriber stream playing');
        });
        subscriber.on('error', (error) => {
          console.error('Subscriber error:', error);
        });

        let streamType = 'unknown';
        let userId = '';
        try {
          const connectionData = event.stream.connection.data;
          console.log('Raw connection data:', connectionData);

          const [clientData, roleData] = connectionData.split('%/%');
          const parsedClientData = JSON.parse(clientData);
          const parsedRoleData = JSON.parse(roleData);

          streamType = parsedClientData.clientData === 'screen' ? 'SCREEN' : 'CAMERA';
          userId = parsedRoleData.userId;

          console.log('Processed stream type:', streamType);
          console.log('User ID:', userId);
        } catch (error) {
          console.error('Error processing connection data:', error);
        }

        dispatch(
          updateKiosk({
            connectionId: event.stream.connection.connectionId,
            streamType,
            userId,
            screenId: streamType === 'SCREEN' ? event.stream.connection.connectionId : undefined,
          })
        );

        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);

        console.log('New subscriber:', subscriber);
        const connectionId = event.stream.connection.connectionId;
        handleCustomerConnect(connectionId);
        console.log(`New subscriber added: ${connectionId}`);

        if (connectedKiosks.length === 1 && streamType === 'CAMERA') {
          handleSetActiveKiosk(event.stream.connection.connectionId);
        }
      });

      session.on('streamDestroyed', (event) => {
        const connectionId = event.stream.connection.connectionId;
        handleCustomerDisconnect(connectionId);
        console.log(`Subscriber removed: ${connectionId}`);
      });

      session.on('exception', (exception) => {
        console.warn('Exception in session:', exception);
      });

      try {
        await session.connect(token, { clientData: userData.email });
        console.log('OpenVidu 세션 연결 성공');

        const publisher = await ov.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: '640x480',
          frameRate: 30,
          insertMode: 'APPEND',
          mirror: false,
        });

        await session.publish(publisher);
        setPublisher(publisher);
        console.log('상담원 스트림 발행 성공');
      } catch (error) {
        console.error('세션 연결 또는 스트림 발행 오류:', error);
      }
    },
    [userData.email, handleCustomerConnect, handleCustomerDisconnect, connectedKiosks.length]
  );

  useEffect(() => {
    if (userData.token && !isConnected) {
      initializeAdvisor();
    }
    return () => {
      dispatch(resetAdvisor());
    };
  }, [initializeAdvisor, userData.token, dispatch, isConnected]);

  useEffect(() => {
    if (roomId && roomToken && !isInitialized) {
      initializeSession(roomId, roomToken);
      setIsInitialized(true);
    }
  }, [roomId, roomToken, initializeSession, isInitialized]);

  useEffect(() => {
    middlebarRef.current.addEventListener('drag', (e) => {
      console.log('드래그하는 도중 발생하는 이벤트');
    });
    middlebarRef.current.addEventListener('dragend', (e) => {
      console.log('드래그가 끝나면 발생하는 이벤트');
    });
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const data = JSON.parse(lastMessage.data);
      console.log('WebSocket 메시지 수신:', data);
      if (data.type === 'consultationRequest') {
        setConsultationRequest(data);
        setToastMessage('상담 요청이 왔습니다. 수락하시겠습니까?');
        setShowToast(true);
      }
    }
  }, [lastMessage]);

  const handleConsultationRequest = useCallback((accept) => {
    setPendingAction(accept ? 'accept' : 'reject');
    setShowToast(false);
  }, []);

  useEffect(() => {
    const handlePendingAction = async () => {
      if (pendingAction && consultationRequest) {
        if (pendingAction === 'accept') {
          try {
            await acceptMeeting(roomId, consultationRequest.kioskId);
            const availableRoom = connectedKiosks.find((kiosk) => kiosk.status === 'waiting');
            if (availableRoom) {
              dispatch(
                connectKiosk({
                  id: availableRoom.id,
                  kioskId: consultationRequest.kioskId,
                  status: 'connected',
                })
              );
              console.log('Updated connectedKiosks:', connectedKiosks);
            } else {
              console.log('No available room for new kiosk');
            }
          } catch (error) {
            console.error('상담 수락 오류:', error);
          }
        } else if (pendingAction === 'reject') {
          try {
            await rejectMeeting();
          } catch (error) {
            console.error('상담 거절 오류:', error);
          }
        }
        setConsultationRequest(null);
        setPendingAction(null);
      }
    };

    handlePendingAction();
  }, [pendingAction, consultationRequest, roomId, connectedKiosks, dispatch]);

  const [activeSubscriber, setActiveSubscriber] = useState(null);
  const [activeScreenSubscriber, setActiveScreenSubscriber] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered: connectedKiosks or subscribers changed');
    console.log('connectedKiosks:', connectedKiosks);
    console.log('subscribers:', subscribers);

    const activeKiosk = connectedKiosks.find((kiosk) => kiosk.isActive);
    console.log('activeKiosk:', activeKiosk);

    if (activeKiosk) {
      const newActiveSubscriber = subscribers.find(
        (sub) => sub.stream.connection.connectionId === activeKiosk.connectionId
      );
      const newActiveScreenSubscriber = subscribers.find(
        (sub) => sub.stream.connection.connectionId === activeKiosk.screenId
      );
      console.log('newActiveSubscriber:', newActiveSubscriber);
      console.log('newActiveScreenSubscriber:', newActiveScreenSubscriber);
      setActiveSubscriber(newActiveSubscriber || null);
      setActiveScreenSubscriber(newActiveScreenSubscriber || null);
    } else {
      console.log('No active kiosk found');
      setActiveSubscriber(null);
      setActiveScreenSubscriber(null);
    }
  }, [connectedKiosks, subscribers]);

  const handleSetActiveKiosk = useCallback(
    (connectionId, screenId) => {
      console.log('handleSetActiveKiosk called with:', connectionId, screenId);
      dispatch(setActiveKiosk(connectionId));
      subscribers.forEach((subscriber) => {
        const shouldSubscribe = subscriber.stream.connection.connectionId === connectionId;
        console.log(
          'Subscribing to audio:',
          subscriber.stream.connection.connectionId,
          shouldSubscribe
        );
        subscriber.subscribeToAudio(shouldSubscribe);
      });
      const activeScreenSubscriber = subscribers.find(
        (sub) => sub.stream.connection.connectionId === screenId
      );
      console.log('Found activeScreenSubscriber:', activeScreenSubscriber);
      setActiveScreenSubscriber(activeScreenSubscriber || null);
    },
    [dispatch, subscribers]
  );

  return (
    <AdvMainPageWrapper>
      <AdvHeader>
        <HeaderLeft>
          <Logo size={'2.5rem'} />
          <LogOut
            onClick={() => {
              handleOnclick();
            }}
          >
            로그아웃
          </LogOut>
        </HeaderLeft>
        <HeaderRight>
          <MaxButtonContainer>
            <HeaderRightText>최대 상담 인원 수</HeaderRightText>
            <UpDownButtons
              value={maxConnections}
              setValue={maxConnections}
              color={'#7392ff'}
              size={'2rem'}
            />
          </MaxButtonContainer>
          <ToggleContainer>
            <HeaderRightText>거절 모드</HeaderRightText>
            <Toggle
              value={!isAvailable}
              setValue={(value) => dispatch(setAvailability(!value))}
              size={'3rem'}
            />
          </ToggleContainer>
        </HeaderRight>
      </AdvHeader>
      <AdvBody onScroll={handleScroll}>
        <LeftSection>
          <LeftTopSection>
            <CustomerVideo streamManager={activeSubscriber || null} />
          </LeftTopSection>
          <LeftMiddleBarRef ref={leftmiddlebarRef} />
          <LeftBottomSection>
            <CustomerWaiting
              connectedKiosks={connectedKiosks}
              subscribers={subscribers}
              onDisconnect={handleCustomerDisconnect}
              onSetActiveKiosk={handleSetActiveKiosk}
            />
          </LeftBottomSection>
        </LeftSection>
        <MiddleBar ref={middlebarRef} deltaY={deltaY} />
        <RightSection>
          <CustomerKiosk streamManager={activeScreenSubscriber || null} />
        </RightSection>
        {showToast && (
          <Toast
            message={toastMessage}
            setAnswer={(answer) => handleConsultationRequest(answer === 'accept')}
            onClose={() => setShowToast(false)}
            makeButton={true}
          />
        )}
      </AdvBody>
    </AdvMainPageWrapper>
  );
};

export default AdvMainPage;
