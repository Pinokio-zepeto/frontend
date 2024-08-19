import React, { useState } from 'react';
import styled from 'styled-components';
import ToggleButton from '../common/Toggle';
import { deleteItem, itemScreenToggle, itemSoldOutToggle } from '../../apis/Item'; // Import the necessary functions

const ProductTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const ProductRow = styled.tr`
  border-bottom: 1px solid #ddd;
  &:hover .delete-button {
    opacity: 1;
  }
`;

const ProductCell = styled.td`
  padding: 0.5rem 0;
  vertical-align: middle;
  text-align: left;
`;

const DeleteCell = styled(ProductCell)`
  width: 30px;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
`;

const DeleteButton = styled.button`
  opacity: 0;
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  transition: opacity 0.3s ease;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ModalButton = styled.button`
  margin: 0 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

const ProductList = ({ setProducts, products, onEdit, onDelete, setToastMessage }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteItem(productToDelete.itemId); // Call the deleteItem function
      onDelete(productToDelete.itemId); // Call the onDelete handler to remove from list
      setToastMessage(`${productToDelete.name} 상품 삭제 완료!`);
    } catch (error) {
      setToastMessage('상품 삭제 실패!');
    }
    setShowConfirmModal(false); // Close the modal after delete
  };

  const handleToggle = async (product, field) => {
    console.log('product : ', product);
    try {
      let updatedProduct;
      if (field === 'isSoldOut') {
        await itemSoldOutToggle(product.itemId);
        updatedProduct = { ...product, isSoldOut: product.isSoldOut === 'YES' ? 'NO' : 'YES' };
      } else if (field === 'isScreen') {
        await itemScreenToggle(product.itemId);
        updatedProduct = { ...product, isScreen: product.isScreen === 'YES' ? 'NO' : 'YES' };
      }
      // console.log(`soldout : ${product.isSoldOut} isScreen: ${product.isScreen}`);
      setToastMessage(
        `${product.name}의 ${
          field === 'isSoldOut' ? '품절 여부' : '키오스크 노출'
        }가 변경되었습니다.`
      );

      // products 배열을 직접 업데이트하지 말고 prop을 통한 콜백 함수를 호출
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.itemId === updatedProduct.itemId ? updatedProduct : p))
      );
    } catch (error) {
      setToastMessage(`${product.name} 상태 업데이트 실패!`);
      console.error('Toggle failed:', error);
    }
  };

  return (
    <>
      <ProductTable>
        <thead>
          <ProductRow>
            <th style={{ textAlign: 'left' }}>이미지</th>
            <th style={{ textAlign: 'left' }}>상품명</th>
            <th style={{ textAlign: 'left' }}>가격</th>
            <th style={{ textAlign: 'left' }}>재고</th>
            <th style={{ textAlign: 'left' }}>품절 여부</th>
            <th style={{ textAlign: 'left' }}>키오스크 노출</th>
          </ProductRow>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow key={product.id}>
              <ProductCell>
                <ProductImage src={product.file} alt={product.name} />
              </ProductCell>
              <ProductCell onClick={() => onEdit(product)}>{product.name}</ProductCell>
              <ProductCell>{product.price.toLocaleString()}</ProductCell>
              <ProductCell>{product.amount.toLocaleString()}</ProductCell>
              <ProductCell>
                <ToggleButton
                  value={product.isSoldOut === 'YES'}
                  setValue={() => handleToggle(product, 'isSoldOut')}
                />
              </ProductCell>
              <ProductCell>
                <ToggleButton
                  value={product.isScreen === 'YES'}
                  setValue={() => handleToggle(product, 'isScreen')}
                />
              </ProductCell>
              <DeleteCell>
                <DeleteButton className="delete-button" onClick={() => handleDeleteClick(product)}>
                  X
                </DeleteButton>
              </DeleteCell>
            </ProductRow>
          ))}
        </tbody>
      </ProductTable>
      {showConfirmModal && (
        <ModalBackground>
          <ModalContent>
            <p>정말 {productToDelete?.name} 상품을 삭제하시겠습니까?</p>
            <ModalButton onClick={confirmDelete}>확인</ModalButton>
            <ModalButton onClick={() => setShowConfirmModal(false)}>취소</ModalButton>
          </ModalContent>
        </ModalBackground>
      )}
    </>
  );
};

export default ProductList;
