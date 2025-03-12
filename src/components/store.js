import { configureStore } from "@reduxjs/toolkit";
import idReducer from "./idSlice"; // ✅ Correct path
import chartHistoryReducer from "./chartHistorySlice"; // ✅ Correct path

const store = configureStore({
  reducer: {
    userId: idReducer,
    chartHistory: chartHistoryReducer,
  },
});

export default store;
