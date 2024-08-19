import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { postItem, putItem, itemScreenToggle, itemSoldOutToggle } from '../../apis/Item';
import Toggle from '../common/Toggle';
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
  width: 30%;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 10px;
`;

const ToggleContainer = styled.div`
  width: 40%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 30%;
  margin: 0.5rem 0;
`;

const ButtonCotainer = styled.div`
  display: flex;
  flex-direction: row;
  transform: translate(10%, 0);
`;

const TextArea = styled.textarea`
  width: 100%;
  margin-bottom: 10px;
  height: 10rem;
`;

const ProductModal = ({ product, categories, onClose }) => {
  // modal 내의 toggle이 안됨
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [image, setImage] = useState(null);
  const [detail, setDetail] = useState('');
  const [isScreen, setIsScreen] = useState(false);
  const [isSoldOut, setIsSoldout] = useState(false);
  const [category, setCategory] = useState('');
  const [useExistingImage, setUseExistingImage] = useState(false);

  useEffect(() => {
    if (product !== null) {
      console.log(product);
      setName(product.name);
      setPrice(product.price);
      setAmount(product.amount);
      setImage(product.image);
      setDetail(product.detail);
      console.log(categories.filter((category) => category.id === product.categoryId));
      const categoryName = categories.filter((category) => category.id === product.categoryId)[0]
        .name;
      setCategory(categoryName);
      setIsScreen(product.isScreen === 'YES' ? true : false);
      setIsSoldout(product.isSoldOut === 'YES' ? true : false);
    }
  }, []);

  const handleSave = async () => {
    if (!name.trim() || !detail.trim() || !price || price === '0') {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    console.log('product : ', product);
    if (product === null) {
      const categoryId = categories.find((cat) => cat.name === category)?.id;
      const itemRequest = {
        categoryId,
        name,
        price: parseInt(price),
        amount: parseInt(amount),
        detail,
        image,
      };

      formData.append(
        'itemRequest',
        new Blob([JSON.stringify(itemRequest)], { type: 'application/json' })
      );

      if (image) {
        formData.append('file', image);
        console.log(image);
      } else {
        // URL을 Blob 객체로 변환하여 FormData에 추가
        const blob = new Blob([], { type: 'image/jpeg' }); // 빈 Blob 객체 생성
        const fileName = ''; // 파일 이름 설정
        formData.append('file', blob, fileName); // Blob 객체와 파일 이름을 함께 추가
        console.log(blob); // 이걸로 확인 가능
      }
    } else {
      const categoryId = categories.find((cat) => cat.name === category)?.id;
      const updateItemRequest = {
        categoryId,
        name,
        price: parseInt(price),
        amount: parseInt(amount),
        detail,
        isScreen: isScreen ? 'YES' : 'NO',
        isSoldOut: isSoldOut ? 'YES' : 'NO',
        useExistingImage,
      };
      console.log('updateItemRequest', updateItemRequest);
      formData.append(
        'updateItemRequest ',
        new Blob([JSON.stringify(updateItemRequest)], { type: 'application/json' })
      );
      if (image) {
        formData.append('file', image);
        console.log('image', image);
      } else {
        // URL을 Blob 객체로 변환하여 FormData에 추가
        const blob = new Blob([], { type: 'image/jpeg' }); // 빈 Blob 객체 생성
        const fileName = ''; // 파일 이름 설정
        formData.append('file', blob, fileName); // Blob 객체와 파일 이름을 함께 추가
        console.log(blob); // 이걸로 확인 가능
      }
    }

    try {
      console.log('product2 : ', product);

      if (product === null) {
        await postItem(formData);
        onClose(); // Close the modal and trigger screen update
      } else {
        console.log('formData', formData);
        await putItem(product.itemId, formData);
        onClose();
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <Modal>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value.trim())}
        placeholder="상품명"
        required
      />
      <Input
        value={price}
        onChange={(e) => setPrice(e.target.value.trim())}
        placeholder="가격"
        type="number"
        required
      />
      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value.trim())}
        placeholder="재고"
        type="number"
        required
      />
      <Input type="file" onChange={handleFileChange} />
      <ToggleContainer>
        <div>사진 유지 여부</div>
        <Toggle
          setValue={() => setUseExistingImage(!useExistingImage)}
          value={useExistingImage}
        ></Toggle>
      </ToggleContainer>
      <TextArea
        value={detail}
        onChange={(e) => setDetail(e.target.value.trim())}
        placeholder="상품 설명"
        required
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="" disabled>
          카테고리 선택
        </option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      <ToggleContainer>
        <div>키오스크 노출</div>
        <Toggle value={isSoldOut} setValue={setIsSoldout} />
      </ToggleContainer>
      <ToggleContainer>
        <div>품절</div>
        <Toggle value={isScreen} setValue={setIsScreen} />
      </ToggleContainer>
      <ButtonCotainer>
        <RoundButton onClick={handleSave} text="확인" theme="colored" />
        <RoundButton onClick={onClose} text="취소" />
      </ButtonCotainer>
    </Modal>
  );
};

export default ProductModal;
