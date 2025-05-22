import { configureStore } from '@reduxjs/toolkit';
import swotReducer from './dataSlice'; // Your existing SWOT reducer, now including timeline data

export const store = configureStore({
  reducer: {
    swot: swotReducer, // Only one reducer needed now, as dataSlice handles both SWOT and timeline
  },
});

// Define RootState and AppDispatch types based on your store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
