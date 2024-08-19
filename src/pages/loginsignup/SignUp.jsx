import React, { useState, useCallback } from 'react';
import Logo from '../../components/common/Logo';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  posDuplicateEmail,
  tellerDuplicateEmail,
  postRegisterAdvisor,
  postRegisterPos,
} from '../../apis/Auth';
import { sendEmail, checkAuth } from '../../apis/Mail';
import { debounce } from 'lodash';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const SignUpWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f9;
  padding: 20px;
`;

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  max-width: 600px;
  box-sizing: border-box;

  .has-label {
    margin: 10px 0 0 0;
  }
`;

const SignUpTitle = styled.div`
  color: #7392ff;
  font-size: 25px;
  font-weight: Bold;
  margin: 10px 0 20px 0;
`;

const Input = styled.input`
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

const EmailLabelContainer = styled.div`
  position: relative;
  width: 100%;
`;

const EmailSendBtn = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 4rem;
  height: 1.7rem;
  font-size: 10px;
`;

const VerifyLabelContainer = styled.div`
  position: relative;
  width: 100%;
`;

const VerifyBtn = styled.button`
  position: absolute;
  top: 42%;
  right: 10px;
  transform: translateY(-50%);
  width: 4rem;
  height: 1.7rem;
  font-size: 10px;
`;

const LabelContainer = styled.div`
  width: 100%;
`;

const AddedMessage = styled.div`
  color: ${(props) => (props.isUsableId === true ? 'limegreen' : 'red')};
  font-size: 10px;
  text-align: end;
`;

const StyledButton = styled.button`
  width: 100%;
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

const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
`;

const TogglePasswordVisibility = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
`;

function SignUp() {
  const [id, setId] = useState('');
  const [isUsableId, setIsUsableId] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordChecking, setPasswordChecking] = useState('');
  const [position, setPosition] = useState('');
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // 비밀번호 표시 여부 상태

  const navigate = useNavigate();
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

  const checkIdDuplicated = useCallback(
    debounce(async (email) => {
      if (position) {
        try {
          const response =
            position === 'pos' ? await posDuplicateEmail(email) : await tellerDuplicateEmail(email);
          if (response.duplicate) {
            setErrorMessage('이미 가입된 이메일 입니다.');
          } else if (email.match(emailRegEx) === null) {
            setErrorMessage('이메일 형식에 맞지 않습니다.');
          } else {
            setIsUsableId(true);
            setErrorMessage('');
          }
        } catch (error) {
          setErrorMessage('이메일 중복 검사 중 오류가 발생했습니다.');
        }
      } else {
        setErrorMessage('직책을 먼저 선택해주세요.');
      }
    }, 500),
    [position]
  );

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setId(email);
    setIsUsableId(false);
    setErrorMessage('');
    checkIdDuplicated(email);
  };

  const handleEmailSend = async () => {
    if (!id) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      await sendEmail(id);
      setEmailSent(true);
      setVerificationMessage('인증 코드가 이메일로 전송되었습니다.');
    } catch (error) {
      setVerificationMessage('이메일 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await checkAuth(verificationCode);
      if (response) {
        setVerificationMessage('이메일 인증이 완료되었습니다.');
      } else {
        setVerificationMessage('인증 코드가 올바르지 않습니다.');
      }
    } catch (error) {
      setVerificationMessage('인증 코드 확인 중 오류가 발생했습니다.');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!isUsableId) {
      alert('이메일 중복 검사를 완료해주세요.');
      return;
    }
    if (password !== passwordChecking) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 8) {
      alert('비밀번호를 8자리 이상으로 설정해주세요.');
      return;
    }
    try {
      if (position === 'advisor') {
        await postRegisterAdvisor(code, id, password, passwordChecking);
      } else if (position === 'pos') {
        await postRegisterPos(code, id, password, passwordChecking);
      }
      navigate('/');
    } catch (error) {
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SignUpWrapper>
      <Logo />
      <SignUpForm id="login-form" onSubmit={handleSignUp}>
        <SignUpTitle>회원가입</SignUpTitle>

        <LabelContainer>
          <SelectInput
            name="position"
            id="position"
            onChange={(e) => {
              setPosition(e.target.value);
              setErrorMessage('');
              setIsUsableId(false);
            }}
          >
            <option value="" selected disabled hidden>
              선택해주세요
            </option>
            <option value="pos">포스기</option>
            <option value="advisor">상담원</option>
          </SelectInput>
        </LabelContainer>

        <EmailLabelContainer>
          <Input
            type="text"
            className="Email"
            placeholder="이메일"
            onChange={handleEmailChange}
            disabled={!position}
          />
          {errorMessage && <AddedMessage>{errorMessage}</AddedMessage>}
          {isUsableId && !errorMessage && (
            <AddedMessage isUsableId={isUsableId}>사용할 수 있는 이메일입니다.</AddedMessage>
          )}
          <EmailSendBtn type="button" onClick={handleEmailSend} disabled={!position}>
            인증하기
          </EmailSendBtn>
        </EmailLabelContainer>

        {emailSent && (
          <VerifyLabelContainer>
            <Input
              type="text"
              className="VerificationCode"
              placeholder="인증 코드를 입력해주세요"
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <VerifyBtn type="button" onClick={handleVerifyCode}>
              인증 확인
            </VerifyBtn>
            {verificationMessage && (
              <AddedMessage
                style={{
                  color:
                    verificationMessage.includes('완료') || verificationMessage.includes('전송')
                      ? 'limegreen'
                      : 'red',
                }}
              >
                {verificationMessage}
              </AddedMessage>
            )}
          </VerifyLabelContainer>
        )}

        <PasswordContainer>
          <Input
            id="password"
            type={passwordVisible ? 'text' : 'password'} // 비밀번호 보이기/숨기기
            className="Password"
            placeholder="패스워드"
            onChange={(e) => setPassword(e.target.value)}
            disabled={!position}
          />
          <TogglePasswordVisibility onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
          </TogglePasswordVisibility>
        </PasswordContainer>

        <LabelContainer>
          <PasswordContainer>
            <Input
              id="password-checking"
              type={passwordVisible ? 'text' : 'password'} // 비밀번호 보이기/숨기기
              className="has-label"
              placeholder="패스워드 확인"
              onChange={(e) => setPasswordChecking(e.target.value)}
              disabled={!position}
            />
            <TogglePasswordVisibility onClick={() => setPasswordVisible(!passwordVisible)}>
              {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
            </TogglePasswordVisibility>
          </PasswordContainer>
          {password.length >= 8 ? (
            password === passwordChecking ? (
              <AddedMessage isCorrect={true} style={{ color: 'green' }}>
                비밀번호가 일치합니다.
              </AddedMessage>
            ) : (
              <AddedMessage isCorrect={false}>비밀번호가 일치하지 않습니다.</AddedMessage>
            )
          ) : (
            <AddedMessage isCorrect={false}>비밀번호를 8자리 이상으로 설정해주세요.</AddedMessage>
          )}
        </LabelContainer>

        <LabelContainer>
          <Input
            type="text"
            className="code"
            placeholder={
              position === 'pos' ? '매장 코드를 입력해주세요.' : '매장 코드를 입력해주세요.'
            }
            onChange={(e) => setCode(e.target.value)}
            disabled={!position}
          />
        </LabelContainer>

        <StyledButton type="submit">회원가입</StyledButton>
      </SignUpForm>
    </SignUpWrapper>
  );
}
export default SignUp;
