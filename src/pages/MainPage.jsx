import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Link as ScrollLink } from 'react-scroll';
import LOGO from '../components/common/Logo';
import sensor from '../assets/images/main/sensor.png';
import advisor from '../assets/images/main/advisor.png';
import face from '../assets/images/main/face.jfif';
import kiosk from '../assets/images/main/kiosk.jpg';
import distanceSensor from '../assets/images/main/distanceSensor.jpg';
import faceRecognition from '../assets/images/main/face_recognition_v2.jfif';
import teller from '../assets/images/main/teller.jfif';

// 애니메이션 키프레임 정의
const slideUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(100px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = css`
  opacity: 1;
  transform: translateY(0);
  animation: ${slideUp} 1s ease-out;
`;

const float = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

const MainContainer = styled.div`
  font-family: 'LINESeedKR-Bd';
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
`;

const Link = styled.a`
  font-family: 'LINESeedKR-Th';
  padding: 1% 3% 0 0;
  font-size: 32px;
  cursor: pointer;
  transition: color 0.3s ease;
  &:hover {
    color: #ff6e7f;
  }
`;

const LogoContainer = styled.div`
  padding: 0.5% 0 0.5% 3%;
`;

const Header = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

const HeaderNav = styled.div`
  display: flex;
  position: fixed;
  width: 100%;
  justify-content: space-between;
  background-color: #fff;
  z-index: 1000;
  border-bottom: ${({ isScrolled }) => (isScrolled ? '1px solid lightgray' : 'none')};
  transition: border-bottom 0.3s ease;
`;

const HeaderBody = styled.div`
  h2 {
    margin-top: 30px; /* 위쪽 간격 줄이기 */
    margin-bottom: 10px; /* 아래쪽 간격 줄이기 */
  }
`;

const KioskImage = styled.img.attrs({
  src: `${kiosk}`,
  alt: `noimage`,
})`
  position: absolute;
  bottom: 0;
  right: 10%;
  height: 80%;
  animation: ${slideUp} 1s ease-out 0.9s;
  animation-fill-mode: forwards;
`;

const BodyHeader = styled.div`
  font-family: 'LINESeedKR-Rg';
  margin-top: 28%;
  font-weight: bold;
  animation: ${slideUp} 1s ease-out;
`;

const BodyContent = styled.div`
  margin-top: 10px;
  font-size: 50px;
  animation: ${slideUp} 1s ease-out 0.3s;
  animation-fill-mode: forwards;
`;

const BodyLeft = styled.div`
  width: 70%;
  text-align: center;
`;

const BodyRight = styled.div`
  width: 30%;
`;

const FunctionSection = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: ${({ bgColor }) => bgColor || '#f9fafb'};

  .content {
    margin-top: 10%;
    margin-left: 5%;
    margin-right: 5%;
    width: 40%;
    h1 {
      color: #7392ff;
    }

    h2 {
      margin-top: 0px;
      margin-bottom: 0px;
      font-size: 41px;
    }

    h5 {
      margin-top: 10px;
      margin-bottom: 10px;
    }

    .footer {
      margin-top: 30px;
    }
  }

  .picture {
    margin-left: 10%;
    margin-right: 5%;
    width: 55%;
    opacity: 0;
    transform: translateY(100px);
    transition: opacity 0.5s ease-out, transform 1s ease-out;
    ${({ isVisible }) => isVisible && fadeIn};
  }

  img {
    width: 100%;
    margin-top: 23%;
  }
`;

const LearnMoreContainer = styled.div`
  font-family: 'LINESeedKR-Th';
  position: absolute;
  bottom: 45px;
  left: 50.5%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
`;

const LearnMore = styled(ScrollLink)`
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #ff6e7f;
  }
`;

const ArrowDown = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  animation: ${float} 2s infinite;
  text-align: center;
`;

const Sidebar = styled.div`
  position: fixed;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SidebarDot = styled(ScrollLink)`
  width: 10px;
  height: 10px;
  background-color: ${({ isActive }) => (isActive ? '#ff6e7f' : 'black')};
  border-radius: 50%;
  position: relative;
  border: 1px solid lightgrey;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover::after {
    content: attr(data-label);
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #7392ff;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    white-space: nowrap;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background-color: #ff6e7f;
  }
`;

function MainPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = {
    firstFunction: useRef(null),
    secondFunction: useRef(null),
    thirdFunction: useRef(null),
  };

  const navigate = useNavigate();

  const goLogin = () => {
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        } else {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: false,
          }));
        }
      });
    }, options);

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, []);

  return (
    <MainContainer>
      <Header id="main">
        <HeaderNav isScrolled={isScrolled}>
          <LogoContainer>
            <LOGO />
          </LogoContainer>
          <Link onClick={goLogin}>시작하기</Link>
        </HeaderNav>
        <HeaderBody>
          <BodyLeft>
            <BodyHeader>
              <h2>| 고령층을 위한 키오스크 프로젝트 |</h2>
            </BodyHeader>
            <BodyContent>
              <h2>어려운 키오스크 조작</h2>
            </BodyContent>
            <BodyContent>
              <h2>피노키오로 쉽고 간편하게</h2>
            </BodyContent>
          </BodyLeft>
          <BodyRight>
            <KioskImage />
          </BodyRight>
          <LearnMoreContainer>
            <LearnMore to="firstFunction" smooth={true} duration={500}>
              LEARN MORE!
            </LearnMore>
          </LearnMoreContainer>
          <ArrowDown>v</ArrowDown>
        </HeaderBody>
      </Header>
      <FunctionSection
        id="firstFunction"
        ref={sectionRefs.firstFunction}
        isVisible={visibleSections.firstFunction}
        bgColor="#f9fafb"
      >
        <div className="content">
          <div className="head">
            <h1>고객 인식</h1>
          </div>
          <div className="body">
            <h2>고객 근접 시 거리 센서를 이용해서</h2>
            <h2>서비스를 자동 활성화 시킵니다</h2>
          </div>
          <div className="footer">
            <h5>초음파 센서를 이용해 사용자와의 거리를 측정합니다.</h5>
            <h5>측정한 거리가 일정 수준 이하면 App Server로 캡쳐 이미지를 전송합니다.</h5>
            <h5>초음파 센서를 통해 측정한 거리를 1초마다 서버로 전송합니다.</h5>
          </div>
        </div>
        <div className="picture">
          <img src={distanceSensor} alt="sensor" />
        </div>
      </FunctionSection>
      <FunctionSection
        id="secondFunction"
        ref={sectionRefs.secondFunction}
        isVisible={visibleSections.secondFunction}
        bgColor="white"
      >
        <div className="picture">
          <img src={faceRecognition} alt="face" />
        </div>
        <div className="content">
          <div className="head">
            <h1>얼굴 식별</h1>
          </div>
          <div className="body">
            <h2>고객님의 얼굴을 식별 후</h2>
            <h2>노년층인지 식별</h2>
            <h2>회원 / 비회원 유무를 식별</h2>
          </div>
          <div className="footer">
            <h5>캡쳐한 얼굴 이미지를 App Server로 전송합니다.</h5>
            <h5>FastApi는 나이, 성별 분석 및 App Server를 거쳐 DB에 저장된 회원인지 조회</h5>
            <h5>분석 및 조회 결과를 서버를 거쳐 웹에 전달합니다.</h5>
          </div>
        </div>
      </FunctionSection>
      <FunctionSection
        id="thirdFunction"
        ref={sectionRefs.thirdFunction}
        isVisible={visibleSections.thirdFunction}
        bgColor="#f9fafb"
      >
        <div className="content">
          <div className="head">
            <h1>화상 상담</h1>
          </div>
          <div className="body">
            <h2>1 : 3 화상 상담을 지원해 한명의 상담원이</h2>
            <h2>여러 고객을 상담할 수 있게 지원합니다.</h2>
          </div>
          <div className="footer">
            <h5>상담원 한명은 최대 3명의 고객까지 동시 상담 가능합니다.</h5>
            <h5>상담은 상담원과 고객 간 1:1로 진행합니다.</h5>
            <h5>상담원은 고객 요청에 응답해 상담 고객 전환 가능합니다.</h5>
          </div>
        </div>
        <div className="picture">
          <img src={teller} alt="advisor" />
        </div>
      </FunctionSection>
      <Sidebar>
        <SidebarDot
          to="main"
          smooth={true}
          duration={500}
          data-label="Home"
          isActive={
            !visibleSections.firstFunction &&
            !visibleSections.secondFunction &&
            !visibleSections.thirdFunction
          }
        />
        <SidebarDot
          to="firstFunction"
          smooth={true}
          duration={500}
          data-label="센서 인식"
          isActive={
            visibleSections.firstFunction &&
            !visibleSections.secondFunction &&
            !visibleSections.thirdFunction
          }
        />
        <SidebarDot
          to="secondFunction"
          smooth={true}
          duration={500}
          data-label="얼굴 식별"
          isActive={visibleSections.secondFunction && !visibleSections.thirdFunction}
        />
        <SidebarDot
          to="thirdFunction"
          smooth={true}
          duration={500}
          data-label="화상 상담"
          isActive={visibleSections.thirdFunction}
        />
      </Sidebar>
    </MainContainer>
  );
}

export default MainPage;
