import React, { useState } from 'react';
import styled from 'styled-components';
import { deleteCategory, modifyCategory } from '../../apis/Category'; // API 함수 import
import RoundButton from '../common/RoundButton';

const CategoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: 'fixed';
`;

const CategoryRow = styled.tr`
  border-bottom: 1px solid #ddd;
  &:hover .delete-button {
    opacity: 1;
  }
`;

const CategoryCell = styled.td`
  padding: 10px;
  text-align: center;
  vertical-align: middle;
`;

const DeleteCell = styled(CategoryCell)`
  width: 30px;
`;

const DeleteButton = styled.button`
  opacity: 0;
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  transition: opacity 0.3s ease;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: blue;
  cursor: pointer;
  margin-left: 10px;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

const ModalButton = styled.button`
  margin: 5px;
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const CategoryList = ({ products, categories, onEdit, onDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [editName, setEditName] = useState('');

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowConfirmModal(true);
  };

  const handleEditClick = (category) => {
    setCategoryToEdit(category);
    setEditName(category.name);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(categoryToDelete.id);
      onDelete(categoryToDelete.id); // 부모 컴포넌트에 삭제 알림
      setShowConfirmModal(false);
    } catch (error) {
      console.error('카테고리 삭제 실패:', error);
      alert('카테고리 삭제에 실패했습니다.');
    }
  };

  const confirmEdit = async () => {
    try {
      await modifyCategory(categoryToEdit.id, editName);
      console.log(categoryCounts);
      onEdit(editName); // 부모 컴포넌트에 수정 알림
      setShowEditModal(false);
    } catch (error) {
      console.error('카테고리 수정 실패:', error);
      alert('카테고리 수정에 실패했습니다.');
    }
  };

  const categoryCounts = categories.map((category) => {
    const count = products.filter((product) => product.categoryId === category.id).length;
    return {
      productCount: count,
    };
  });

  return (
    <>
      <CategoryTable style={{ width: '100%' }}>
        <thead>
          <CategoryRow>
            <th style={{ textAlign: 'center', width: '33.33%' }}>카테고리명</th>
            <th style={{ textAlign: 'center', width: '33.33%' }}>보유 상품 수</th>
          </CategoryRow>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <CategoryRow key={category.id}>
              <CategoryCell>{category.name}</CategoryCell>
              <CategoryCell>{categoryCounts[index].productCount}</CategoryCell>
              <DeleteCell>
                <EditButton onClick={() => handleEditClick(category)}>수정</EditButton>
                <DeleteButton className="delete-button" onClick={() => handleDeleteClick(category)}>
                  X
                </DeleteButton>
              </DeleteCell>
            </CategoryRow>
          ))}
        </tbody>
      </CategoryTable>

      {showConfirmModal && (
        <ModalBackground>
          <ModalContent>
            <p>{categoryToDelete.name} 카테고리를 삭제하시겠습니까?</p>
            <ModalButton onClick={confirmDelete}>확인</ModalButton>
            <ModalButton onClick={() => setShowConfirmModal(false)}>취소</ModalButton>
          </ModalContent>
        </ModalBackground>
      )}

      {showEditModal && (
        <ModalBackground>
          <ModalContent>
            <p>카테고리 이름 수정:</p>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <RoundButton onClick={confirmEdit} text={'확인'} theme="colored" />
            <RoundButton onClick={() => setShowEditModal(false)} text={'취소'} />
          </ModalContent>
        </ModalBackground>
      )}
    </>
  );
};

export default CategoryList;
