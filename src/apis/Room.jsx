import axios from './Axios'; // 인스턴스와 구분하기 위해 대문자 사용

/*
변수 네이밍 규칙
0. 카멜 케이스로 쓴다.
1. 행위를 맨 앞에 쓴다.
2. 가져오는 대상을 다음에 쓴다.
3. 가져오는 대상이 리스트라면 복수형으로 쓴다.
*/

export const makeMeetingRoom = async () => {
  try {
    const response = await axios.get('/api/meeting/teller/room');
    return response.data;
  } catch (error) {
    console.error('makeMeetingRoom 오류', error);
    throw error;
  }
};

export const deleteMeetingRoom = async () => {
  try {
    await axios.delete('/api/meeting/teller/room');
  } catch (error) {
    console.error('deleteMeetingRoom 오류', error);
    throw error;
  }
};

export const acceptMeeting = async (roomId, kioskId) => {
  try {
    await axios.post('/api/meeting/teller/accept', { roomId, kioskId });
  } catch (error) {
    console.error('acceptMeeting 오류', error);
    throw error;
  }
};

export const requestMeeting = async () => {
  try {
    await axios.post('/api/meeting/kiosk/request-enter');
  } catch (error) {
    console.error('requestMeeting 오류', error);
    throw error;
  }
};

export const rejectMeeting = async () => {
  try {
    await axios.post('/api/meeting/kiosk/reject');
  } catch (error) {
    console.error('rejectMeeting 오류', error);
    throw error;
  }
};

export const enterRoom = async (roomId, kioskId) => {
  try {
    const response = await axios.put('/api/meeting/kiosk/enter', {
      roomId: roomId,
      kioskId: kioskId,
    });
    return response.data;
  } catch (error) {
    console.error('enterRoom 오류', error);
    throw error;
  }
};

export const leaveRoom = async (roomId) => {
  try {
    await axios.put(`/api/meeting/kiosk/${roomId}/leave`);
  } catch (error) {
    console.error('leaveRoom 오류', error);
    throw error;
  }
};
