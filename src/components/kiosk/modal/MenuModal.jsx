import React, { forwardRef, useState } from 'react';
import styled from 'styled-components';
import coffeeimage from '../../../assets/images/coffee_image.png';

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

const ImageAndContents = styled.div`
  width: 100%;
  height: 80%;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 75%;
`;
const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ModalBody = styled.div`
  padding: 0 1rem;
  padding-top: 0.7rem;
  height: 6rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const TitleAndDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuTitleKo = styled.div`
  font-size: 1rem;
`;

const MenuDetail = styled.div`
  font-size: 0.6rem;
  overflow: auto;
  max-height: 3.5rem;
  min-height: 2.5rem;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PriceAndButtons = styled.div`
  position: end;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MenuPrice = styled.div``;

const UpDownButtons = styled.div`
  --height: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: calc(var(--height) * 3);
  height: var(--height);
  border: calc(var(--height) / 60) solid #d9d9d9;
  border-radius: 0.1rem;
`;

const DownButton = styled.div`
  --height: 1rem;
  width: var(--height);
  height: var(--height);
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
`;

const MenuCount = styled.div`
  --height: 1rem;
  width: var(--height);
  height: var(--height);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const UpButton = styled.div`
  --height: 1rem;
  width: var(--height);
  height: var(--height);
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
`;

const ModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 0.8rem;
`;

const CancelButton = styled.div`
  --height: 0.7rem;
  border: 0.05rem solid;
  border-color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
  border-radius: var(--height);
  width: 40%;
  color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
  height: calc(var(--height) * 2);
  line-height: calc(var(--height) * 2);
  text-align: center;
  margin-right: 0.7rem;
  font-family: 'CafeOhsquareAir';
  box-shadow: 0.05rem 0.1rem 0rem rgb(0 0 0 / 25%);
`;

const PutButton = styled.div`
  --height: 0.7rem;
  border: 0.05rem solid;
  border-color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
  background-color: ${(props) => (props.isElder ? '#EC7348' : '#7392ff')};
  border-radius: var(--height);
  color: white;
  width: 40%;
  height: calc(var(--height) * 2);
  line-height: calc(var(--height) * 2);
  text-align: center;
  font-family: 'CafeOhsquareAir';
  box-shadow: 0.05rem 0.1rem 0rem rgb(0 0 0 / 25%);
  pointer-events: ${(props) => (props.disabled ? 'none' : null)};
  opacity: ${(props) => (props.disabled ? '0.5' : null)};
`;

function MenuModal({ item, cartItems, setCartItems, setModal, isElder }) {
  // modal 창에서 선택한 수량
  const [count, setCount] = useState(1);

  const addCart = () => {
    console.log(item.name);

    for (var i = 0; i < cartItems.length; i++) {
      // 만약 이미 Cart에 담겨있는 상품이라면 count 수만 증가시키고,
      if (cartItems[i].itemId === item.itemId) {
        const updatedCartItems = [...cartItems];
        updatedCartItems[i].count += count;
        setCartItems(updatedCartItems);
        setModal(false);
        return;
      }
    }
    // 없는 상품이라면 리스트에 새롭게 추가한다.
    const updatedCartItems = [...cartItems, item];
    updatedCartItems[updatedCartItems.length - 1]['count'] = count;
    setCartItems(updatedCartItems);
    setModal(false);

    return;
  };

  return (
    <ModalBg>
      <Modal>
        <ImageAndContents>
          <ImageContainer>
            <ModalImage src={item.file} />
          </ImageContainer>
          <ModalBody>
            <TitleAndDetail>
              <MenuTitleKo>{item.name}</MenuTitleKo>
              <MenuDetail>{item.detail}</MenuDetail>
            </TitleAndDetail>
            <PriceAndButtons>
              <MenuPrice>{item.price}</MenuPrice>
              <UpDownButtons>
                <DownButton
                  onClick={() => (count > 0 ? setCount(count - 1) : null)}
                  isElder={isElder}
                >
                  -
                </DownButton>
                <MenuCount>{count}</MenuCount>
                <UpButton onClick={() => setCount(count + 1)} isElder={isElder}>
                  +
                </UpButton>
              </UpDownButtons>
            </PriceAndButtons>
          </ModalBody>
        </ImageAndContents>
        <ModalFooter>
          <CancelButton onClick={() => setModal(false)} isElder={isElder}>
            취소
          </CancelButton>
          <PutButton onClick={addCart} disabled={!(count > 0)} isElder={isElder}>
            담기
          </PutButton>
        </ModalFooter>
      </Modal>
    </ModalBg>
  );
}

export default MenuModal;
