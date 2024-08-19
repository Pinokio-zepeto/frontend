import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from '../../components/common/Logo';
import { useNavigate } from 'react-router-dom';
import { sendTellerNewPassword, sendPosNewPassword } from '../../apis/Mail';

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;
`;

const FindPasswordForm = styled.form`
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

const InputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;
const Input = styled.input`
  width: 68%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  color: #333;
  &:focus {
    outline: 1px solid #7392ff;
  }
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

const SelectInput = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  color: #333;
  &:focus {
    outline: 1px solid #7392ff;
  }
`;

function FindPassword1() {
  const [email, setEmail] = useState('');
  const [usertype, setUserType] = useState('');
  const navigate = useNavigate();

  const handleUserType = (e) => {
    setUserType(e.target.value);
  };

  const sendEmail = async () => {
    try {
      if (usertype === 'advisor') {
        await sendTellerNewPassword(email);
        alert('상담원 새 비밀번호가 이메일로 전송되었습니다.');
      } else if (usertype === 'pos') {
        await sendPosNewPassword(email);
        alert('포스 새 비밀번호가 이메일로 전송되었습니다.');
      } else {
        alert('직종을 선택하세요.');
        return;
      }
      navigate('/findpassword2');
    } catch (error) {
      console.error('이메일 전송 실패:', error);
      alert('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleFindPassword = (e) => {
    e.preventDefault();
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    sendEmail();
  };

  return (
    <LoginWrapper>
      <Logo />
      <FindPasswordForm onSubmit={handleFindPassword}>
        <h2>비밀번호 찾기</h2>
        <SelectInput value={usertype} onChange={handleUserType}>
          <option value="" disabled>
            선택하세요
          </option>
          <option value="pos">포스</option>
          <option value="advisor">상담원</option>
        </SelectInput>
        <InputWrapper>
          <Input
            type="text"
            className="email"
            placeholder="이메일"
            onChange={(e) => setEmail(e.target.value)}
          />
          <StyledButton type="submit">이메일 전송</StyledButton>
        </InputWrapper>
      </FindPasswordForm>
    </LoginWrapper>
  );
}

export default FindPassword1;
