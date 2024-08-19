import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  phoneNumber: null,
  customerId: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      state.phoneNumber = action.payload.phoneNumber; // state.user를 업데이트합니다.
      state.customerId = action.payload.customerId;
    },
    clearCustomer: (state) => {
      state.phoneNumber = null;
      state.customerId = null;
    },
  },
});

export const { setCustomer, clearCustomer } = customerSlice.actions;

export default customerSlice.reducer;
