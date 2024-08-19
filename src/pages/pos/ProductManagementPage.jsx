import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductList from '../../components/pos/ProductList';
import ProductModal from '../../components/pos/ProductModal';
import CategoryList from '../../components/pos/CategoryList';
import CategoryModal from '../../components/pos/CategoryModal';
import Toast from '../../components/common/Toast';
import { getItems, getItemsByKeyword } from '../../apis/Item'; // Import the API functions
import { getCategories } from '../../apis/Category'; // Import the API function
import { useSelector } from 'react-redux'; // Assuming you use Redux to get posId
import Navbar from '../../components/pos/Navbar';
import Select from 'react-select';

const ProductManagementPageStyle = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductManagementBodyStyle = styled.div`
  width: 80%;
`;

const CategoryTabStyle = styled.div``;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? '#007bff' : '#f8f9fa')};
  color: ${(props) => (props.isActive ? 'white' : 'black')};
`;

const TabBelowContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  height: 2rem;
  margin-bottom: 1rem;
`;

const ProductCreateButton = styled.button`
  width: 5rem;
  height: 2.2rem;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: white;
`;

const StyledSelect = styled(Select)`
  width: 14rem;
  margin: 10px 0;
  margin-right: 32rem;
`;

const SearchForm = styled.form`
  display: inline;
  position: relative;
`;

const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SearchButton = styled.button`
  margin-left: 8px;
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ProductManagementPage = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('상품');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');

  const userData = useSelector((store) => store.user);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems(userData.typeInfo.posId);
        setProducts(data.responseList);
        const categoryList = await getCategories();
        setCategories(categoryList.responseList);
      } catch (error) {
        setToastMessage('상품 및 카테고리 데이터를 가져오는 데 실패했습니다.');
      }
    };

    fetchItems();
  }, [userData.typeInfo.posId, isProductModalOpen, isCategoryModalOpen, selectedCategory]);

  const handleSearch = async (e) => {
    e.preventDefault(); // This prevents the form from being submitted the traditional way (refreshing the page)
    try {
      const result = await getItemsByKeyword(searchKeyword);
      setProducts(result.responseList);
    } catch (error) {
      setToastMessage('상품 검색에 실패했습니다.');
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((p) => p.itemId !== productId));
    setToastMessage(`${products.find((p) => p.itemId === productId).name} 상품 삭제 완료!`);
  };

  const handleSaveProduct = (product) => {
    if (product.id) {
      setProducts(products.map((p) => (p.itemId === product.itemId ? product : p)));
      setToastMessage(`${product.name} 상품 수정 완료!`);
    } else {
      const newProduct = { ...product, itemId: Date.now() };
      setProducts([...products, newProduct]);
      setToastMessage(`${product.name} 상품 추가 완료!`);
    }
    setIsProductModalOpen(false);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    console.log(`category : ${category}`);
  };

  const handleDeleteCategory = (categoryId) => {
    setCategories(categories.filter((c) => c.id !== categoryId));
    setToastMessage(`${categories.find((c) => c.id === categoryId).name} 카테고리 삭제 완료!`);
  };

  const handleSaveCategory = (category) => {
    if (category.id) {
      setCategories(categories.map((c) => (c.id === category.id ? category : c)));
      setToastMessage(`${category.name} 카테고리 수정 완료!`);
    } else {
      const newCategory = { ...category, id: Date.now() };
      setCategories([...categories, newCategory]);
      setToastMessage(`${category.name} 카테고리 추가 완료!`);
    }
    setIsCategoryModalOpen(false);
  };

  const filteredProducts =
    selectedCategoryFilter === '전체'
      ? products
      : products.filter((product) => product.categoryId === selectedCategoryFilter);

  const categoryOptions = [
    { value: '전체', label: '전체' },
    ...categories.map((category) => ({
      value: category.id,
      label: category.name,
    })),
  ];

  const selectedOption = categoryOptions.find((option) => option.value === selectedCategoryFilter);

  return (
    <ProductManagementPageStyle>
      <Navbar isOpen={isNavbarOpen} toggleNavbar={() => setIsNavbarOpen(!isNavbarOpen)} />
      <ProductManagementBodyStyle>
        <TabContainer>
          <Tab isActive={activeTab === '상품'} onClick={() => setActiveTab('상품')}>
            상품
          </Tab>
          <Tab isActive={activeTab === '카테고리'} onClick={() => setActiveTab('카테고리')}>
            카테고리
          </Tab>
        </TabContainer>
        {activeTab === '상품' && (
          <>
            <TabBelowContainer>
              <ProductCreateButton onClick={handleAddProduct}>상품 추가</ProductCreateButton>
              <StyledSelect
                value={selectedOption}
                onChange={(selectedOption) => setSelectedCategoryFilter(selectedOption.value)}
                options={categoryOptions}
              />
              <SearchForm onSubmit={handleSearch}>
                <SearchInput
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="상품 검색"
                />
                <SearchButton type="submit">검색</SearchButton>
              </SearchForm>
            </TabBelowContainer>
            <ProductList
              products={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              setToastMessage={setToastMessage}
              setProducts={setProducts}
            />
            {isProductModalOpen && (
              <ProductModal
                product={selectedProduct}
                categories={categories}
                onSave={handleSaveProduct}
                onClose={() => setIsProductModalOpen(false)}
              />
            )}
          </>
        )}
        {activeTab === '카테고리' && (
          <CategoryTabStyle>
            <button onClick={handleAddCategory}>카테고리 추가</button>
            <CategoryList
              products={products}
              categories={categories}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
            {isCategoryModalOpen && (
              <CategoryModal
                category={selectedCategory}
                categories={categories}
                onSave={handleSaveCategory}
                onClose={() => setIsCategoryModalOpen(false)}
              />
            )}
          </CategoryTabStyle>
        )}
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
      </ProductManagementBodyStyle>
    </ProductManagementPageStyle>
  );
};

export default ProductManagementPage;
