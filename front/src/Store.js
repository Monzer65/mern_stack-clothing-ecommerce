import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import { apiSlice } from "./reducers/apiSlice";
import cartReducer from "./reducers/cartSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
