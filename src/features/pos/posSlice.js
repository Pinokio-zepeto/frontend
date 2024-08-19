import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchItems } from '../../apis/Item';

export const fetchPos = createAsyncThunk('pos/fetchPos', async (posId) => {
  const data = await fetchItems(posId);
  return data.responseList;
});

const posSlice = createSlice({
  name: 'pos',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default posSlice.reducer;
