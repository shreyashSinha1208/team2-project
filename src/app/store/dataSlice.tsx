import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SWOTState {
  items: string[]; // Your existing SWOT items
  timelineData: string; // New: Timeline data added to SWOTState
}

const initialState: SWOTState = {
  items: [],
  // Initial dummy data for the timeline
  timelineData: `
    1990: Founded the company
    1995: Launched first product
    2000: Expanded to international markets
    2005: Reached 1 million customers
    2010: Introduced new technology
    2015: Acquired a competitor
    2020: Celebrated 30 years in business
    2025: Planned future innovations
  `,
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
    // New reducer to set timeline data
    setTimelineData: (state, action: PayloadAction<string>) => {
      state.timelineData = action.payload;
    },
  },
});

export const { setItems, addItem, clearItems, setTimelineData } = swotSlice.actions;
export default swotSlice.reducer;