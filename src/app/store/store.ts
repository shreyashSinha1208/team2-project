import { configureStore } from '@reduxjs/toolkit';
import chartsReducer from './chartsSlice';
import swotReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    charts: chartsReducer,
    swot: swotReducer,

  },
});

// Define RootState and AppDispatch types based on your store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
