import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: null,
};

const productsSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    latestProducts(state, action) {
      state.products = action.payload;
    },
  },
});

export const { latestProducts } = productsSlice.actions;
export default productsSlice.reducer;
