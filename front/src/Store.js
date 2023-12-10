import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import { apiSlice } from "./reducers/apiSlice";
import productsReducer from "./reducers/productsSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
