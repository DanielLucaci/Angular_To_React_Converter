import { createSlice } from "@reduxjs/toolkit";

const conversionInitialState = {
  message: "",
  percentage: 0,
  error: null,
  isRunning: false
};

const conversionSlice = createSlice({
  name: "cart",
  initialState: conversionInitialState,
  reducers: {
    start(state) { 
      state.isRunning = true;
    },
    update(state, action) {
      state.message = action.payload.message;
      state.percentage = action.payload.percentage;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    cancel(state) {
      state.isRunning = false;
    },
    
  },
});

export const conversionSliceReducer = conversionSlice.reducer;
const conversionSliceActions = conversionSlice.actions;
export default conversionSliceActions;
