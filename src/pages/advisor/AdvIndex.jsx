import React from 'react';
import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import AdvMainPage from './AdvMainPage';

// 추후 확장 가능성을 위해 Index 컴포넌트를 따로 만들었습니다.
function AdvIndex() {
  return (
    <div className="Adv">
      <Routes>
        <Route path="/" element={<AdvMainPage />} />
      </Routes>
    </div>
  );
}

export default AdvIndex;
