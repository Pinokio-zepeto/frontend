import axios from './Axios';

// 키오스크 삭제
export const deleteKiosk = async (kioskId) => {
  try {
    console.log(kioskId);
    const response = await axios.delete(`/api/pos/kiosks`, { params: { kioskId: kioskId } });
    return response.data;
  } catch (error) {
    console.error('delete kiosk failed:', error);
    throw error;
  }
};

// 포스의 통계 정보 조회
export const getPosStatistics = async () => {
  try {
    const response = await axios.get(`/api/pos/statistics/`);
    return response.data;
  } catch (error) {
    console.error('Get kiosks failed:', error);
    throw error;
  }
};

// 포스의 키오스크 정보 조회
export const getKiosks = async () => {
  try {
    const response = await axios.get(`/api/pos/kiosks`);
    return response.data;
  } catch (error) {
    console.error('Get kiosks failed:', error);
    throw error;
  }
};
