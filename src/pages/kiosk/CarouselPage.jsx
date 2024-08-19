import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import carouselimage from '../../assets/images/carouselimage.webp';
import carouselimage2 from '../../assets/images/carouselimage2.webp';
import carouselimage3 from '../../assets/images/carouselimage3.webp';
import NumberModal from '../../components/kiosk/modal/NumberModal';
import { kioskMyInfo } from '../../apis/Item';
import axios from 'axios';

const CarouselPageStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 30rem;
`;

const CarouselWindow = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30vw;
  height: 1000vh;
`;

const CarouselButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  height: 12vh;
  width: 8vw;
  margin: 0 0.5vw;
  font-weight: Bold;
  font-size: 3vh;
`;

const Slider = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CarouselMessage = styled.div`
  position: absolute;

  color: white;
  margin-top: 20vh;
`;

const ModalButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

function CarouselPage() {
  const navigate = useNavigate();
  const slideRef = useRef(0);

  const [result, setResult] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const userData = useSelector((state) => state.user);
  const kioskId = userData.typeInfo.kioskId;
  const isFirstRender = useRef(true);
  const [isWaiting, setIsWaiting] = useState(false);
  const [carouselimages, setCarouselimages] = useState([
    carouselimage,
    carouselimage2,
    carouselimage3,
    carouselimage,
  ]);

  const [customer, setCustomer] = useState({ customerId: null, gender: null, age: null });

  const startKiosk = async (kioskId) => {
    try {
      const response = await axios.post(`http://localhost:5001/start`, { kiosk_id: kioskId });
      console.log(response);
    } catch (error) {
      console.error('키오스크 컨트롤러 시작 실패:', error);
    }
  };

  const fetchData = async () => {
    console.log('first');
    const result = await kioskMyInfo(); // Promise를 반환하는 함수
    console.log('customer result:', result);
    setCustomer({ customerId: 'guest', gender: 'male', age: 23 });
  };

  useEffect(() => {
    fetchData();

    if (isFirstRender.current) {
      console.log('kioskId : ', kioskId);
      startKiosk(kioskId);
      const connectEventSource = () => {
        const url = 'https://i11a601.p.ssafy.io/api/customer/face-recognition-events';
        console.log('Connecting to:', url);

        const eventSource = new EventSource(url);

        eventSource.addEventListener('waitingStatus', (event) => {
          const data = JSON.parse(event.data);
          console.log('Received waitingStatus event:', data);
          setIsWaiting(data.waiting);
          setShowModal(data.waiting);
        });

        eventSource.addEventListener('faceDetectionResult', (event) => {
          const data = JSON.parse(event.data);
          console.log('Received faceDetectionResult event:', data);
          if (!data.isFace) {
            setIsWaiting(false);
            setShowModal(false);
            setResult(null);
          }
        });

        eventSource.addEventListener('analysisResult', (event) => {
          const data = JSON.parse(event.data);
          console.log('Received analysisResult event:', data);
          setResult({
            age: data.age,
            gender: data.gender,
            isFace: data.isFace,
            isCustomer: data.isCustomer,
            customerId: data.customerId,
            customerAge: data.customerAge,
            customerGender: data.customerGender,
            faceEmbeddingData: data.faceEmbeddingData,
          });
          setIsWaiting(false);
          setShowModal(true);
        });

        eventSource.onerror = (error) => {
          console.error('SSE error:', error);
          eventSource.close();
          setTimeout(connectEventSource, 5000); // Retry connection
        };

        return () => {
          eventSource.close();
        };
      };

      connectEventSource();
      isFirstRender.current = false;
      return;
    }

    // setTimeout(() => {
    //   console.log('1초 기다리기 끝');
    // }, 1000); //1초 기다리기
  }, []);

  useEffect(() => {
    if (customer?.customerId !== null && customer?.gender !== null && customer?.age !== null) {
      console.log('customer 인식 완료');
      console.log('print customer ::::', customer);
      if (customer.customerId === 'guest') {
        console.log('customer는 guest입니다.');
      } else {
        console.log('customer는 기존 회원입니다.');
      }
    }
  }, [customer]);

  // const connectEventSource = () => {
  //   const url = 'http://localhost:8080/api/customer/face-recognition-events';
  //   console.log('Connecting to:', url);

  //   const eventSource = new EventSource(url);

  //   eventSource.addEventListener('waitingStatus', (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log('Received waitingStatus event:', data);
  //     setIsWaiting(data.waiting);
  //   });

  //   eventSource.addEventListener('faceDetectionResult', (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log('Received faceDetectionResult event:', data);
  //     if (!data.isFace) {
  //       setIsWaiting(false);
  //       setResult(null);
  //     }
  //   });

  //   eventSource.addEventListener('analysisResult', (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log('Received analysisResult event:', data);
  //     setResult({
  //       age: data.age,
  //       gender: data.gender,
  //       isFace: data.isFace,
  //       isCustomer: data.isCustomer,
  //       customerId: data.customerId,
  //       customerAge: data.customerAge,
  //       customerGender: data.customerGender,
  //       faceEmbeddingData: data.faceEmbeddingData,
  //     });
  //     setIsWaiting(false);
  //     setShowModal(true);
  //   });

  //   eventSource.onerror = (error) => {
  //     console.error('SSE error:', error);
  //     eventSource.close();
  //     setTimeout(connectEventSource, 5000); // 재연결 시도
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // };

  const havingHere = () => {
    navigate('/kiosk/menu', {
      state: { where: 'having here', customer: customer, orderList: null, isElder: false },
    });
  };

  const takeAway = () => {
    navigate('/kiosk/elder-menu', {
      state: { where: 'take away', customer: customer, orderList: null, isElder: true },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      moveSlider();
    }, 2000);
    /*
    페이지가 넘어가고 컴포넌트가 없는데 계속 컴포넌트를 찾아서 style을 바꿔주려니깐 에러가 뜬다.
    때문에 clearInterval을 통해 언마운트되면 지워줘야 한다.
    */
    return () => clearInterval(interval);
  }, [carouselIndex]);

  const moveSlider = () => {
    setCarouselIndex((prevIndex) => prevIndex + 1);

    if (slideRef.current) {
      // console.log(`Moving slider to index ${carouselIndex}`);
      if (carouselIndex % 2 === 1) {
        slideRef.current.style.transform = `translateX(-${13.5 * (carouselIndex + 1)}rem)`;
        slideRef.current.style.transition = 'all 0.5s ease-in-out';
      } else if (
        carouselIndex >= 2 * (carouselimages.length - 1) &&
        carouselIndex % (2 * (carouselimages.length - 1)) === 0
      ) {
        slideRef.current.style.transform = 'none';
        slideRef.current.style.transition = 'none';
        setCarouselIndex(1);
      }
    } else {
      // console.error('slideRef.current is null');
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleConfirm = (number) => {
    console.log('입력된 번호:', number);
    // 여기에 번호 처리 로직을 추가할 수 있습니다.
  };

  return (
    <CarouselPageStyle>
      <Slider ref={slideRef}>
        {carouselimages &&
          carouselimages.map((image, key) => <CarouselImage src={image} key={key} alt="" />)}
      </Slider>
      <CarouselWindow>
        {result ? (
          <div>
            <h2>얼굴 인식 결과:</h2>
            <p>회원 여부: {result.isCustomer ? '회원' : '비회원'}</p>
            <p>나이: {result.age}</p>
            <p>성별: {result.gender}</p>
            {result.isCustomer && (
              <div>
                <h3>회원 정보:</h3>
                <p>ID: {result.customerId}</p>
                <p>등록된 나이: {result.customerAge}</p>
                <p>등록된 성별: {result.customerGender}</p>
              </div>
            )}
          </div>
        ) : (
          <CarouselMessage>얼굴 인식 결과를 기다리는 중...</CarouselMessage>
        )}
        <ButtonContainer>
          <img
            src="/HavingHere.svg"
            alt=""
            onClick={havingHere}
            width={'100rem'}
            style={{ marginRight: '2rem' }}
          />
          <img src="/TakeAway.svg" alt="" onClick={takeAway} width={'100rem'} />
        </ButtonContainer>
      </CarouselWindow>
      {/* <ModalButton onClick={() => setShowModal(true)}>번호 입력 모달 열기</ModalButton> */}
      {showModal && <NumberModal setModal={setShowModal} onConfirm={handleConfirm} />}
    </CarouselPageStyle>
  );
}

export default CarouselPage;
