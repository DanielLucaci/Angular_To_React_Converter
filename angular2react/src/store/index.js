import { configureStore } from "@reduxjs/toolkit";
import { conversionSliceReducer } from "./conversion-slice";

const store = configureStore({
  reducer: conversionSliceReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
