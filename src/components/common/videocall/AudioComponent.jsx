import React, { useEffect, useRef } from 'react';

const AudioComponent = ({ track }) => {
  const audioElement = useRef(null);

  useEffect(() => {
    if (audioElement.current) {
      track.attach(audioElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return <audio ref={audioElement} id={track.sid} />;
};

export default AudioComponent;
