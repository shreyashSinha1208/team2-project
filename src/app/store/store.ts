import { configureStore } from '@reduxjs/toolkit';
import swotReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    swot: swotReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
