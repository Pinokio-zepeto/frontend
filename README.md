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
리덕스의 store는 페이지를 새로고침 할 경우 state가 날아가는 것을 볼 수 있습니다.
이것에 대한 대응 방안으로 localStorage 또는 session에 저장하고자 하는 reducer state를 저장하여, 새로고침 하여도 저장공간에 있는 데이터를 redux에 불러오는 형식으로 이루어집니다.
위에서 말한 이 작동을 위해 redux-persist를 사용합니다.
```js
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
```js
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
- App을 불러오면서 Local Storage에 저장된 유저 정보를 사용합니다.
- 서버에 있는 로그인 상태와 비교하며 재확인합니다.
- 서버의 응답이 오면 해당 로그인 정보로 업데이트 합니다.
- 토큰이 만료되었다면 재로그인을 요청합니다.

### 4. SSE(Server-Sent Events)

> SSE를 사용한 이유

- 클라이언트와 서버의 통신은 기본적으로 클라이언트의 요청으로 시작됩니다. 하지만 고객이 키오스크 앞에 있음을 감지하고 서버에서 클라이언트로 고객의 정보를 보내주어야 합니다. 이를 위해서는 클라이언트가 계속해서 서버로 Request를 보내야 합니다. 하지만 이 방법은 너무 계속해서 Request를 보낸다는 오버헤드를 수반하기에 SSE로 구현하였습니다.
- **단순성**: SSE는 클라이언트 측에서 별도의 라이브러리 없이 `EventSource` 객체를 사용해 쉽게 구현할 수 있으며, 웹소켓보다 가볍습니다.
- **브라우저 지원**: 대부분의 최신 브라우저에서 기본적으로 지원되어 추가적인 설정 없이 사용할 수 있습니다.

> 구현 기능

- **SSE 연결 관리**:
    - 클라이언트에서 SSE(EventSource)를 사용해 서버에서 발생하는 이벤트를 실시간으로 수신합니다.
    - 서버에서 전송하는 `waitingStatus`, `faceDetectionResult`, `analysisResult` 등의 이벤트를 받아서 상태를 관리합니다.
- **이벤트 핸들링**:
    - `waitingStatus`: 고객이 대기 중인지 여부를 전달받고 `isWaiting` 상태를 업데이트합니다.
    - `faceDetectionResult`: 얼굴이 감지되지 않은 경우, 대기 상태를 해제하고 모달 창을 닫습니다.
    - `analysisResult`: 얼굴 분석 결과(나이, 성별, 고객 여부, 회원 정보)를 수신하여 화면에 결과를 표시합니다.
- **재연결 로직**:
    - SSE 연결이 오류로 인해 종료된 경우, 5초 후에 자동으로 재연결 시도를 하도록 구현되었습니다.


```js
useEffect(() => {
  if (isFirstRender.current) {
    const connectEventSource = () => {
      const url = 'https://i11a601.p.ssafy.io/api/customer/face-recognition-events';
      console.log('Connecting to:', url);

      const eventSource = new EventSource(url);

      // 대기 상태 이벤트 수신
      eventSource.addEventListener('waitingStatus', (event) => {
        const data = JSON.parse(event.data);
        console.log('Received waitingStatus event:', data);
        setIsWaiting(data.waiting);
        setShowModal(data.waiting);
      });

      // 얼굴 감지 결과 이벤트 수신
      eventSource.addEventListener('faceDetectionResult', (event) => {
        const data = JSON.parse(event.data);
        console.log('Received faceDetectionResult event:', data);
        if (!data.isFace) {
          setIsWaiting(false);
          setShowModal(false);
          setResult(null);
        }
      });

      // 얼굴 분석 결과 이벤트 수신
      eventSource.addEventListener('analysisResult', (event) => {
        const data = JSON.parse(event.data);
        console.log('Received analysisResult event:', data);
        setResult({
          age: data.age,
          gender: data.gender,
          isFace: data.isFace,
          isCustomer: data.isCustomer,
          customerId: data.customerId,
          customerAge: data.customerAge,
          customerGender: data.customerGender,
          faceEmbeddingData: data.faceEmbeddingData,
        });
        setIsWaiting(false);
        setShowModal(true);
      });

      eventSource.onerror = (error) => {

```

### 5. OpenVidu

#### 요약

> ElderMenuPage.jsx

- **OpenVidu**와 **WebSocket**을 사용해 고객이 상담을 요청하고 비디오 세션을 생성, 종료할 수 있는 기능을 구현.
- `useCallback`, `useEffect`로 세션과 WebSocket 연결을 효율적으로 관리.

> AdvMainPage.jsx

- 상담원이 다수의 고객과 화상 통화를 관리할 수 있는 기능을 **OpenVidu**로 구현.
- **WebSocket**을 통해 실시간 상담 요청을 받고, **Redux**로 상담원과 고객의 상태를 관리


#### 1. **ElderMenuPage.jsx**

- **비디오 상담 기능**:
    - **기술**: `OpenVidu`, `useWebSocket`
    - **설명**:
        - `OpenVidu`를 이용해 실시간 화상 상담 기능을 구현.
        - `useWebSocket` 훅을 사용해 실시간 상담 요청 및 상태를 관리하며, 비디오 연결 상태를 유지함.


- **세션 관리 및 스트림 처리**:
    - **기술**: `OpenVidu`, `useCallback`, `useEffect`
    - **설명**:
        - OpenVidu 세션을 초기화하고, 카메라와 화면 공유 세션을 설정. `useCallback`으로 세션 초기화 함수 효율화.
        - WebSocket으로부터 받은 `roomId`를 기반으로 상담 방에 입장.


- **세션 종료**:
    - **기술**: `useCallback`
    - **설명**: 상담 종료 시 세션을 종료하고 WebSocket 연결을 정리.


#### 2. **AdvMainPage.jsx**

- **다중 화상 상담 관리 기능**:
    - **기술**: `OpenVidu`, `useWebSocket`, `Redux`
    - **설명**:
        - 상담원이 여러 키오스크 사용자와 동시에 상담할 수 있도록 `OpenVidu`로 다중 스트림을 관리.
        - WebSocket을 통해 실시간으로 상담 요청을 처리하고, Redux로 상담 상태를 관리.


- **세션 및 스트림 관리**:
    - **기술**: `OpenVidu`, `useCallback`
    - **설명**: 각 사용자의 비디오 스트림을 구독하여 상담원 화면에 표시하고, 세션이 생성되거나 종료될 때 이를 처리함.


- **세션 종료 및 연결 관리**:
    - **기술**: `useCallback`, `Redux`
    - **설명**: 세션이 종료되거나 연결된 사용자가 상담을 마칠 때 `streamDestroyed` 이벤트를 통해 해당 연결을 종료하고, Redux 상태를 업데이트함.


- **상담 요청 처리 및 스트림 관리**:
    - **기술**: `useCallback`, `Redux`, `OpenVidu`
    - **설명**: 상담 요청이 들어왔을 때, 요청을 수락하거나 거절하는 로직을 처리하며, 수락 시 상담을 시작하고 스트림을 관리함.


- **다중 스트림 관리**:
    - **기술**: `useState`, `useEffect`, `useCallback`
    - **설명**: 여러 고객이 동시에 연결된 상태에서 각 고객의 스트림을 관리하고, 특정 고객의 스트림을 활성화하거나 비활성화함.


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

- 만약 URL 입력을 통해 넘어가려고 한다면 현재 로그인 되어있는 Role의 root page로 넘어가게 됩니다.
