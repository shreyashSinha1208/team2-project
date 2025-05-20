import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SWOTState {
  items: string[];
}

const initialState: SWOTState = {
  items: [],
};

const swotSlice = createSlice({
  name: 'swot',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<string[]>) {
      state.items = action.payload;
    },
    addItem(state, action: PayloadAction<string>) {
      state.items.push(action.payload);
    },
    clearItems(state) {
      state.items = [];
    },
  },
});

export const { setItems, addItem, clearItems } = swotSlice.actions;
export default swotSlice.reducer;
