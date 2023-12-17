import { createSlice } from "@reduxjs/toolkit";

const loadCartFromLocalStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      return undefined;
    }
    return JSON.parse(serializedCart);
  } catch (error) {
    console.error("Error loading cart from local storage:", error);
    return undefined;
  }
};

const saveCartToLocalStorage = (cartData) => {
  try {
    const serializedCart = JSON.stringify(cartData);
    localStorage.setItem("cart", serializedCart);
  } catch (error) {
    console.error("Error saving cart to local storage:", error);
  }
};

const initialState = {
  cart: loadCartFromLocalStorage() || null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.cart = action.payload;
      saveCartToLocalStorage(action.payload);
    },
  },
});

export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;
