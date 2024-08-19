/*
변수 네이밍 규칙
1. 행위를 맨 앞에 쓴다.
2. 가져오는 대상을 다음에 쓴다.
3. 가져오는 대상이 리스트라면 복수형으로 쓴다.
4. 다른 변수(parameter)를 이용해서 행위를 한다면 By를 사용하여 네이밍한다.
5. 다른 변수가 여러 개라면 그냥 붙여서 쓴다.
*/
import Axios from 'axios'; // 인스턴스와 구분하기 위해 대문자 사용
import { store } from '../app/store';
import { setUser, clearUser } from '../features/user/userSlice';
import { jwtDecode } from 'jwt-decode'; // Import without destructuring
import Cookies from 'js-cookie';

const baseURL = 'https://i11a601.p.ssafy.io';
const baselocalURL = 'http://localhost:8080';

// 별도의 axios 인스턴스를 사용하여 토큰 갱신 요청
const refreshInstance = Axios.create({
  baseURL: baselocalURL,
});

// 기존 Axios 인스턴스
const axios = Axios.create({
  baseURL: baselocalURL,
});

// Helper 함수: 토큰이 만료되었는지 확인
const isTokenExpired = (token) => {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  return exp < currentTime;
};

// Helper 함수: 쿠키에서 refreshToken 가져오기
const getRefreshTokenFromCookies = () => {
  return Cookies.get('refreshToken');
};

// Request 인터셉터 설정
axios.interceptors.request.use(
  async (config) => {
    const state = store.getState();
    const user = state.user;
    let accessToken = user?.token;

    if (accessToken && isTokenExpired(accessToken)) {
      try {
        const refreshToken = getRefreshTokenFromCookies();
        // console.log(`리프레시 토큰 받는 중 : ${refreshToken}`);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        // Refresh Token을 사용하여 새로운 Access Token 요청
        const response = await refreshInstance.get('/api/refresh', {
          headers: {
            refresh: refreshToken,
          },
        });
        accessToken = response.data.accessToken;
        // console.log(`액세스 토큰 받아옴 ${accessToken}`);

        // 새로운 Access Token을 store에 저장
        store.dispatch(
          setUser({
            ...user,
            token: accessToken,
          })
        );
      } catch (error) {
        // 인증 오류 처리
        store.dispatch(clearUser());
        localStorage.removeItem('accessToken');
        Cookies.remove('refreshToken');
        // window.location.reload();
        throw error;
      }
    }

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axios.defaults.withCredentials = true;

export default axios;
