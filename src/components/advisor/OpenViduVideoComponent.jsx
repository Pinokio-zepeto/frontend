import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const StyledOpenViduVideoComponent = styled.div`
  background-color: #222222;
  width: 90%;
  height: 90%;
  color: white;
  text-align: center;
  line-height: 10rem;
  font-family: 'CafeOhsquareAir';
  border-radius: 10px;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const OpenViduVideoComponent = ({ streamManager }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return (
    <StyledOpenViduVideoComponent>
      <StyledVideo autoPlay={true} ref={videoRef} />
    </StyledOpenViduVideoComponent>
  );
};

export default OpenViduVideoComponent;
