import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bill } from '@/components/organisms/table/data-table';
const initialState: { bills: Bill[]; favourites: Bill[]; total: number } = {
  bills: [],
  favourites: [],
  total: 0,
};

const legislationSlice = createSlice({
  name: 'legislation',
  initialState: initialState,
  reducers: {
    addBills: (state, action) => {
      state.bills = action.payload.bills;
      state.total = action.payload.total;
    },
    addFavourite: (state, action: PayloadAction<Bill>) => {
      if (!state.favourites.some((bill) => bill.uri === action.payload.uri)) {
        state.favourites.push(action.payload);
      } else {
        state.favourites = state.favourites.filter(
          (bill: Bill) => bill.type !== action.payload.type,
        );
      }
    },
    removeFavourite: (state, action: PayloadAction<Bill>) => {
      state.favourites = state.favourites.filter((bill) => bill.uri !== action.payload.uri);
    },
  },
});

export const { addBills, addFavourite, removeFavourite } = legislationSlice.actions;
export default legislationSlice.reducer;
