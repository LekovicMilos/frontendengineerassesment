import { configureStore } from '@reduxjs/toolkit';
import legislationSlice from './slices/legislationSlice';

export const store = configureStore({
  reducer: {
    legislation: legislationSlice,
  },
});
