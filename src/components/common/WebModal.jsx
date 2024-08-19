import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ToggleButton from '../common/Toggle';
import { postItem } from '../../apis/Item';

const ModalBg = styled.div`
  /* display: none; */
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  display: flex;
  top: 1rem;
  width: 27rem;
  height: 47rem;
`;
const Modal = styled.div`
  background: white;
  border-radius: 0.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 54%;
  height: 50%;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: space-between;
  overflow: hidden;
  font-family: 'CafeOhsquareAir';
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  margin-bottom: 10px;
`;

const ProductModal = ({ categories, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [detail, setDetail] = useState('');
  const [isScreen, setIsScreen] = useState(false);
  const [isSoldout, setIsSoldout] = useState(false);
  const [category, setCategory] = useState('');

  const handleSave = async () => {
    if (!name.trim() || !detail.trim() || !price || price === '0') {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const categoryId = categories.find((cat) => cat.name === category)?.id;

    const itemRequest = {
      categoryId,
      name,
      price: parseInt(price),
      amount: parseInt(amount),
      detail,
      isScreen,
      isSoldout,
    };

    const formData = new FormData();
    formData.append(
      'itemRequest',
      new Blob([JSON.stringify(itemRequest)], { type: 'application/json' })
    );
    if (image) {
      formData.append('file', image);
    }

    try {
      await postItem(formData);
      onClose(); // Close the modal and trigger screen update
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <Modal>
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="상품명" required />
      <Input
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="가격"
        type="number"
        required
      />
      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="재고"
        type="number"
        required
      />
      <Input type="file" onChange={handleFileChange} />
      <TextArea
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="상품 설명"
        required
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">카테고리 선택</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <div>
        <span>키오스크 노출</span>
        <ToggleButton value={isScreen} setValue={setIsScreen} />
      </div>
      <div>
        <span>품절</span>
        <ToggleButton value={isSoldout} setValue={setIsSoldout} />
      </div>
      <button onClick={handleSave}>확인</button>
      <button onClick={onClose}>취소</button>
    </Modal>
  );
};

export default ProductModal;
