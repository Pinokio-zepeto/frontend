import React, { useEffect, useRef } from 'react';

// interface VideoComponentProps {
//   track: LocalVideoTrack | RemoteVideoTrack;
//   participantIdentity: string;
//   local?: boolean;
// }

const VideoComponent = ({ track, participantIdentity, local = false }) => {
  const videoElement = useRef(null);

  useEffect(() => {
    if (videoElement.current) {
      track.attach(videoElement.current);
    }
    return () => {
      track.detach();
    };
  }, [track]);

  return (
    <div id={`camera-${participantIdentity}`} className="video-container">
      <div className="participant-data">
        <p>
          {participantIdentity}
          {local ? ' (You)' : ''}
        </p>
      </div>
      <video ref={videoElement} id={track.sid}></video>
    </div>
  );
};

export default VideoComponent;
