import React, { useEffect } from 'react';
import styled from 'styled-components';

const ToastContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background-color: rgb(65, 65, 65, 0.6);
  color: white;
  padding: 0.1rem 1rem;
  border-radius: 5px;
  height: 3rem;
`;
const ToastMessage = styled.div`
  margin-right: 0.5rem;
`;
const ToastButton = styled.div`
  background-color: ${(props) => props.color};
  width: 3.2rem;
  height: 2.4rem;
  border-radius: 1.2rem;
  margin: 0 0.1rem;
  display: flex;
  justify-content: center;
  line-height: 2.4rem;
`;

Toast.defaultProps = {
  makeButton: false,
};

function Toast({ message, setAnswer, onClose, makeButton }) {
  useEffect(() => {
    if (!makeButton) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [onClose]);

  return (
    <ToastContainer>
      <ToastMessage>{message}</ToastMessage>
      {makeButton && (
        <>
          <ToastButton color="rgb(67, 57, 255, 0.8)" onClick={() => setAnswer('accept')}>
            수락
          </ToastButton>
          <ToastButton color="rgb(236, 115, 72, 0.8)" onClick={() => setAnswer('reject')}>
            거절
          </ToastButton>
        </>
      )}
    </ToastContainer>
  );
}

export default Toast;
