import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  type: null,
  typeInfo: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user; // state.user를 업데이트합니다.
      state.type = action.payload.type;
      state.typeInfo = action.payload.typeInfo;
      state.token = action.payload.token;
    },
    clearUser: (state) => {
      state.user = null;
      state.type = null;
      state.typeInfo = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
