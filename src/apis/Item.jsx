import axios from './Axios'; // 인스턴스와 구분하기 위해 대문자 사용

/*
변수 네이밍 규칙
0. camelCase를 사용한다.
1. 행위를 맨 앞에 쓴다.
2. 가져오는 item을 다음에 쓴다.
3. 가져오는 item이 리스트라면 복수형(items)으로 쓴다.
4. 다른 변수(parameter)를 이용해서 행위를 한다면 By를 사용하여 네이밍한다.
4-1. 다만 pos는 필수이므로 By에 적지 않는다.
5. 다른 변수가 여러 개라면 그냥 붙여서 쓴다.
*/

// 아이템 삭제
export const deleteItem = async (itemId) => {
  try {
    const response = await axios.delete(`/api/pos/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Delete items fail');
    throw error;
  }
};

// 아이템 상세 조회
export const getItemByItemId = async (itemId) => {
  try {
    const response = await axios.get(`/api/pos/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch item detail fail');
    throw error;
  }
};

export const getItems = async () => {
  try {
    const response = await axios.get(`/api/pos/items`); // Adjust endpoint as needed
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch items:', error);
    throw error;
  }
};

export const getItemsByKeyword = async (keyWord) => {
  try {
    const response = await axios.get('/api/pos/items/search', {
      params: { keyWord: keyWord },
    });
    console.log(`keyWord : ${keyWord}`);
    return response.data;
  } catch (error) {
    console.error('Cannot get items by keyword');
  }
};

export const getItemsByCategoryId = async (categoryId) => {
  try {
    const response = await axios.get(`/api/pos/items/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('get menus by category failed:', error);
    throw error;
  }
};

// 아이템 추가
export const postItem = async (formData) => {
  try {
    console.log(formData);
    const response = await axios.post('/api/pos/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Product added:', response.data);
    return response.data;
  } catch (error) {
    throw error; // 에러를 호출한 곳에서 처리할 수 있도록 던집니다.
  }
};

// 아이템 수정
export const putItem = async (itemId, formData) => {
  console.log(formData);
  try {
    const response = await axios.put(`/api/pos/items/${itemId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Post Item fail');
    throw error;
  }
};

// 키오스크에 특정 아이템 표출 여부
export const itemScreenToggle = async (itemId) => {
  try {
    const response = await axios.put(`/api/pos/items/${itemId}/toggle/screen`);
    return response.data;
  } catch (error) {
    console.error('get Kiosk info failed:', error);
    throw error;
  }
};

// 키오스크에 특정 아이템 품절 여부
export const itemSoldOutToggle = async (itemId) => {
  try {
    const response = await axios.put(`/api/pos/items/${itemId}/toggle/sold-out`);
    return response.data;
  } catch (error) {
    console.error('get Kiosk info failed:', error);
    throw error;
  }
};

export const kioskMyInfo = async () => {
  try {
    const response = await axios.get(`/api/kiosk/my-info`);
    return response.data;
  } catch (error) {
    console.error('kiosk MyInfo Failed');
    throw error;
  }
};
