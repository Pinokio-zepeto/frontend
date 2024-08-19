import React from 'react';
import styled from 'styled-components';
import OpenViduVideoComponent from './OpenViduVideoComponent';

const CustomerKioskContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: ${(props) => `${props.height}px`};
  background-color: #efefef;
  font-family: 'CafeOhsquareAir';
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function CustomerKiosk({ streamManager }) {
  console.log('CustomerKiosk rendered with streamManager:', streamManager);
  return (
    <CustomerKioskContainer>
      <VideoContainer>
        {streamManager ? (
          <OpenViduVideoComponent streamManager={streamManager} />
        ) : (
          '화면 공유가 시작되지 않았습니다.'
        )}
      </VideoContainer>
    </CustomerKioskContainer>
  );
}

export default CustomerKiosk;
