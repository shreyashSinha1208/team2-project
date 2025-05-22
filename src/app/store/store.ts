import { configureStore } from '@reduxjs/toolkit';
import chartsReducer from './chartsSlice';
import swotReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    charts: chartsReducer,
    swot: swotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
