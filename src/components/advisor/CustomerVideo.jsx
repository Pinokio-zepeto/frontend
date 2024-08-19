import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import OpenViduVideoComponent from './OpenViduVideoComponent';

const VideoSection = styled.div`
  width: auto;
  height: 100%;
  border-radius: 1rem;
  text-align: center;
  line-height: ${(props) => `${props.height}px`};
  background-color: #efefef;
  font-family: 'CafeOhsquareAir';
  font-size: ${(props) => `calc(${props.height}px / 12)`};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
`;

function CustomerVideo({ streamManager }) {
  const divRef = useRef(null);
  const [thisHeight, setThisHeight] = useState(0);
  const [thisWidth, setThisWidth] = useState(0);

  useEffect(() => {
    if (divRef.current) {
      setThisHeight(divRef.current.offsetHeight);
      setThisWidth(divRef.current.offsetWidth);
    }
  }, []);

  return (
    <VideoSection ref={divRef} width={thisWidth} height={thisHeight}>
      {streamManager ? (
        <VideoContainer>
          <OpenViduVideoComponent streamManager={streamManager} />
        </VideoContainer>
      ) : (
        '연결된 고객이 없습니다.'
      )}
    </VideoSection>
  );
}

export default CustomerVideo;
