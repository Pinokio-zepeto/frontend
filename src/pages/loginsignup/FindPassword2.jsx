import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;
`;

const FindPasswordForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
`;

const StyledButton = styled.button`
  width: 30%;
  padding: 10px;
  margin: 10px 0;
  background-color: #7392ff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
  }
  &:active {
    background-color: #c383d9;
  }
`;
function FindPassword2() {
  const navigate = useNavigate();

  const navigateLogin = () => {
    navigate('/');
  };
  return (
    <LoginWrapper>
      <FindPasswordForm>
        <h2>ssafy@naver.com 으로 새로운 비밀번호가 전송되었습니다.</h2>

        <StyledButton onClick={navigateLogin}>로그인하러 가기</StyledButton>
      </FindPasswordForm>
    </LoginWrapper>
  );
}

export default FindPassword2;
