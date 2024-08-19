import axios from './Axios';

// export const ve = async (kioskId) => {
//   try {
//     console.log(kioskId);
//     const response = await axios.delete(`/api/pos/kiosks`, { params: { kioskId: kioskId } });
//     return response.data;
//   } catch (error) {
//     console.error('delete kiosk failed:', error);
//     throw error;
//   }
// };

// 기간 내 통계 데이터 가져오기
export const getSalesStatistics = async (startDate, endDate) => {
  console.log(startDate, endDate);
  try {
    const response = await axios.get(`/api/sales-statistics`, {
      params: {
        startDate: startDate,
        endDate: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Get sales-statistics failed:', error);
    throw error;
  }
};
