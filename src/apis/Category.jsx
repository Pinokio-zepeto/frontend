import axios from './Axios';

/*
변수 네이밍 규칙
0. 카멜 케이스로 쓴다.
1. 행위를 맨 앞에 쓴다.
2. 가져오는 대상을 다음에 쓴다.
3. 가져오는 대상이 리스트라면 복수형으로 쓴다.
*/

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`/api/pos/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('delete category failed:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`/api/pos/categories`);
    return response.data;
  } catch (error) {
    console.error('get categories failed:', error);
    throw error;
  }
};

export const createCategory = async (name) => {
  try {
    const response = await axios.post('/api/pos/categories', {
      name: name,
    });
    return response.data;
  } catch (error) {
    console.error('create categories failed:', error);
    throw error;
  }
};

export const modifyCategory = async (categoryId, name) => {
  try {
    const response = await axios.put(`/api/pos/categories/${categoryId}`, { name: name });
    return response.data;
  } catch (error) {
    console.error('modify category failed:', error);
    throw error;
  }
};
