<div align="center">
  <img src="https://github.com/user-attachments/assets/521896e7-2afa-4da6-a5df-dfe230f48df1" alt="Image" width="400px">
</div>

## 개요

노인분들이 키오스크를 잘 사용하지 못하는 것을 보고 사용을 도와드리는 서비스가 있다면 좋겠다는 생각이 들어 기획하게 되었습니다.

프랜차이즈 매장에서 기존에 있던 상담원 직원을 활용하여 노년층 고객들에게 화상 통화를 통해 도움을 드리는 서비스입니다.

## 문서

Notion : [링크](https://fluffy-smell-11f.notion.site/SSAFY-PJT-5cf6c9977a6c460a98d2f81f9ae9db14)

요구사항명세서, 기능명세서, API연동규격서, GanttChart : [링크](https://docs.google.com/spreadsheets/d/16FjF0Qtb4-MWAu4Q0hWI4wvSguh9GAdlqrgbwzFRMfc/edit?gid=9229699#gid=9229699)

## 팀원 및 역할

| 이름   | 역할  | 내용                      |
| ------ | ----- | ------------------------- |
| 김준우 | FE / 팀장   | 프론트엔드 개발           |
| 문재성 | FE    | 프론트엔드 개발, Openvidu |
| 이상무 | FE    | 프론트엔드 개발           |
| 전용수 | BE    | 백엔드 개발               |
| 정연서 | BE    | 백앤드 개발, Openvidu     |
| 최장우 | Infra | CI/CD, Openvidu           |

## 기술 스택

### 백엔드(Spring Boot, Gradle)

- Spring Boot: 3.2.7
- Spring Dependency Management: 1.1.5
- Google Protobuf Plugin: 0.8.19
- Java Language Version: 21
- OpenVidu Java Client: 2.20.0
- LiveKit Server: 0.5.11
- Springdoc OpenAPI UI: 2.0.2
- JSON Library: 20230227
- Spring Cloud AWS: 2.2.6.RELEASE
- JJWT API: 0.11.5
- JJWT Impl: 0.11.4
- JJWT Jackson: 0.11.4
- gRPC Netty Shaded: 1.57.2
- gRPC Protobuf: 1.57.2
- gRPC Stub: 1.57.2
- Apache Commons Math: 3.6.1
- javax.annotation API: 1.3.2
- Protobuf Java: 3.23.4
- Protobuf Java Util: 3.23.4
- Apache HttpClient 5: 5.2.1
- Protoc-gen-grpc-java: 1.57.
- Protobuf Compiler (protoc): 3.23.4

### 프론트엔드(React, Redux)

- React: 18.2.0
- Axios: 1.7.2
- Prettier: 2.8.8
- redux: 5.0.1
- redux-persist: 6.0.0

## 아키텍처
![Pinokio 아키텍처](https://github.com/user-attachments/assets/3c7325fa-b644-4702-adc9-2c787c18b5ce)

## ERD

![Pinkio ERD다이어그램](https://github.com/user-attachments/assets/ac73acdc-8e1d-40ef-91b6-cc74ee9a9e83)


## 빌드 및 실행 방법

### FE
```
npm install
npm start
```

### BE
```

```

## 주요 개발 내용(FE)


### 1. 컴포넌트 구분 및 재활용

#### Common
```bash
components/common/
 ├── Keyboard/
 │   ├── CustomKeyboard.jsx
 │   └── koreanLayout.js
 ├── videocall/
 │   ├── AudioComponent.jsx
 │   ├── Video.css
 │   ├── Video.jsx
 │   └── VideoComponent.jsx
 ├── Logo.jsx
 ├── RoundButton.jsx
 ├── Toast.jsx
 ├── Toggle.jsx
 ├── UpDownButtons.jsx
 └── WebModal.jsx
```
- Role에 관계없이 중복 사용되는 컴포넌트는 components 폴더 내의 common 폴더로 따로 구분하였습니다.


#### Kiosk
```bash
pages/kiosk/
 ├── elder/
 │   └── ElderMenuPage.jsx
 └── younger/
     ├── MenuPage.jsx
     ├── PaymentPage.jsx
     ├── ReceiptPage.jsx
     ├── CarouselPage.jsx
     └── KioskIndex.jsx
```
- 다음과 같이 Kisok Page들을 구성하였습니다.
- MenuPage는 청년층과 노년층의 화면 구성이 달라 따로 구현하였습니다.
- 나머지 화면들은 비슷한 화면 구성을 지니고 있어 공통된 Page로 구현하였고, isElder 값을 navigate의 state로 넘겨서 구별하였습니다.



### 2. JWT
- 로그인 시 다음과 같이 jwt 토큰을 저장합니다.
```js
let accessToken;
let refreshToken;
if (usertype === 'kiosk') {
  accessToken = res.authToken?.accessToken;
  refreshToken = res.authToken?.refreshToken;
} else if (usertype === 'pos') {
  accessToken = res.accessToken;
  refreshToken = res.refreshToken;
} else {
  accessToken = res.accessToken;
  refreshToken = res.refreshToken;
}
console.log(`accessToken : ${accessToken}`);

if (accessToken) {
  console.log('yes');
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

  // accessToken을 localStorage에 저장
  localStorage.setItem('accessToken', accessToken);

  // refreshToken을 쿠키에 저장
  Cookies.set('refreshToken', refreshToken);

  // 사용자 데이터 준비
  const newUserData = {
    user: id,
    type: usertype,
    typeInfo:
      usertype === 'kiosk'
        ? await getKioskInfo()
        : usertype === 'pos'
        ? await getPosInfo()
        : null,
    token: accessToken,
  };
  console.log('userData before dispatch:', newUserData);
  console.log(`newUserData : ${newUserData.typeInfo}`);

  if (newUserData) {
    console.log(`userData : ${newUserData.user.id}`);
    dispatch(setUser(newUserData));
    console.log('Dispatch successful');
    navigate(`/${usertype}`);
  } else {
    console.error('사용자 데이터가 누락되었습니다.');
  }
} else {
console.error('토큰이 응답에 누락되었습니다.');
}
```
### 3. Redux
- 다음과 같은 파일 구조로 구성하였습니다.
```bash
app/
 ├── App.js
 └── store.js
```
- Role에 따라 다르게 Slice를 구성하였습니다.
```bash
features/
 ├── advisor/
 │   └── AdvisorSlice.js
 ├── kiosk/
 │   └── CustomerSlice.js
 ├── pos/
 │   └── posSlice.js
 └── user/
     └── userSlice.js
```
#### 3-1. Redux를 통한 User 정보 관리
- User의 Role이 세 종류이므로 Slice도 세 종류로 나누었습니다.

##### 3-1-1. Advisor

##### 3-1-2. Customer(Kiosk)

##### 3-1-3. Pos




#### 3-2. Redux-persist를 통한 새로고침 방지
리덕스의 store는 페이지를 새로고침 할 경우 state가 날아가는 것을 볼 수 있다.
이것에 대한 대응 방안으로 localStorage 또는 session에 저장하고자 하는 reducer state를 저장하여, 새로고침 하여도 저장공간에 있는 데이터를 redux에 불러오는 형식으로 이루어집니다.
위에서 말한 이 작동을 위해 redux-persist를 사용합니다.
```
// config 작성 후, rootReducer 감싸기
import { combineReducers } from 'redux';
import authReducer from './authReducer';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// config 작성
const persistConfig = {
  key: "root", // localStorage key 
  storage, // localStorage
  whitelist: ["auth"], // target (reducer name)
}

const rootReducer = combineReducers({
  auth: authReducer
});

// persistReducer로 감싸기
export default persistReducer(persistConfig, rootReducer);
```
```
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './state/Store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
```
- App을 불러오면서 Local Storage에 저장된 유저 정보를 사용한다.
- 서버에 있는 로그인 상태와 비교하며 재확인한다.
- 서버의 응답이 오면 해당 로그인 정보로 업데이트 한다.
- 토큰이 만료되었다면 재로그인을 요청한다.
### 4. OpenVidu


### 5. ProtectedRouter

```js
// 특정 Role로 로그인 되어있으면 다른 Role에 해당되는 페이지로 넘어가지 못하게 한다.
const ProtectedRoute = ({ type }) => {
  const user = useSelector((state) => state.user);
  if (!user || user.type !== type) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};
```

- 다음과 같이 User의 Role(Kiosk, Pos, Advisor)이 다르면 다른 Role에 해당되는 페이지로 넘어가지 못합니다.

- 만약 URL 입력을 통해 넘어가려고 한다면 각 Role의 root page로 넘어가게 됩니다.
