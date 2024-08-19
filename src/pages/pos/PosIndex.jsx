import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import PosMainPage from './PosMainPage';
import OrderListPage from './OrderListPage';
import KioskManagementPage from './KioskManagementPage';
import ProductManagementPage from './ProductManagementPage';
import SalesReportPage from './SalesReportPage';
import styled from 'styled-components';
import '../../styles/pos/pos.css';

const PosIndexStyle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #efefef;
  font-family: 'CafeOhsquareAir';
  /* width: 80%; */
  min-height: 100vh;
`;

function PosIndex() {
  return (
    <PosIndexStyle>
      <Routes>
        <Route path="/" element={<ProductManagementPage />} />
        <Route path="order-list" element={<OrderListPage />} />
        <Route path="kiosk-management" element={<KioskManagementPage />} />
        <Route path="sales-report" element={<SalesReportPage />} />
      </Routes>
    </PosIndexStyle>
  );
}

export default PosIndex;
