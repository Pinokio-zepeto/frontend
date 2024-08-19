import React from 'react';
import styled from 'styled-components';
import CustomerWaitingRooms from './CustomerWaitingRooms';

const CustomerWaitingSection = styled.div`
  border-radius: 1rem;
  background-color: #efefef;
  height: 100%;
  width: 100%;
  line-height: ${(props) => `${props.height}px`};
  background-color: #efefef;
  font-family: 'CafeOhsquareAir';
  font-size: ${(props) => `calc(${props.height}px / 12)`};
`;
const ConnectionText = styled.div`
  font-family: 'CafeOhsquareAir';
`;

function CustomerWaiting({ connectedKiosks, subscribers, onDisconnect, onSetActiveKiosk }) {
  const waitingKiosks = connectedKiosks.filter((kiosk) => kiosk.status === 'connected');

  return (
    <CustomerWaitingSection>
      대기 인원 ({waitingKiosks.length}/{connectedKiosks.length})
      <CustomerWaitingRooms
        connectedKiosks={waitingKiosks}
        subscribers={subscribers}
        onDisconnect={onDisconnect}
        onSetActiveKiosk={onSetActiveKiosk}
      />
    </CustomerWaitingSection>
  );
}

export default CustomerWaiting;
