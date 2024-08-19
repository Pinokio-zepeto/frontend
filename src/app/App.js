import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate, Outlet } from 'react-router-dom';

import MainPage from '../pages/MainPage';

import Login from '../pages/loginsignup/Login';
import SignUp from '../pages/loginsignup/SignUp';
import FindPassword1 from '../pages/loginsignup/FindPassword1';
import FindPassword2 from '../pages/loginsignup/FindPassword2';

import KioskIndex from '../pages/kiosk/KioskIndex';
import PosIndex from '../pages/pos/PosIndex';
import AdvIndex from '../pages/advisor/AdvIndex';

import { useSelector } from 'react-redux';

// 특정 Role로 로그인 되어있으면 다른 Role에 해당되는 페이지로 넘어가지 못하게 한다.
const ProtectedRoute = ({ type }) => {
  const user = useSelector((state) => state.user);
  if (!user || user.type !== type) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="findpassword1" element={<FindPassword1 />} />
          <Route path="findpassword2" element={<FindPassword2 />} />
          <Route path="/kiosk/*" element={<ProtectedRoute type="kiosk" />}>
            <Route path="*" element={<KioskIndex />} />
          </Route>
          <Route path="/pos/*" element={<ProtectedRoute type="pos" />}>
            <Route path="*" element={<PosIndex />} />
          </Route>
          <Route path="/advisor/*" element={<ProtectedRoute type="advisor" />}>
            <Route path="*" element={<AdvIndex />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
