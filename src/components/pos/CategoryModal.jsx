import React, { useState, useEffect } from 'react';
import { createCategory } from '../../apis/Category';
import styled from 'styled-components';
import RoundButton from '../common/RoundButton';

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 0.5rem;
  align-items: center;
`;

const Input = styled.input`
  /* 입력 필드 스타일 */
`;

const CategoryModal = ({ category, categories, onSave, onClose }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSave = async () => {
    console.log('handleSave');
    if (!name.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }

    // 중복된 카테고리 체크
    const isDuplicate = categories.some(
      (existingCategory) => existingCategory.name === name.trim()
    );

    if (isDuplicate) {
      alert('중복된 카테고리입니다.');
      return;
    }

    if (name.length <= 8) {
      await createCategory(name);
      onSave({ id: category?.id, name });
      onClose();
    } else {
      alert('카테고리명을 8글자 이하로 설정해주세요.');
    }
  };

  return (
    <Modal>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="카테고리명"
        required
      />
      <ButtonContainer>
        <RoundButton onClick={handleSave} theme={'colored'} text={'확인'} />
        <RoundButton onClick={onClose} theme={'white'} text={'취소'} />
      </ButtonContainer>
    </Modal>
  );
};

export default CategoryModal;
