import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import { apiSlice } from "./reducers/apiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
