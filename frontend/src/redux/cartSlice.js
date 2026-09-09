import { createSlice } from "@reduxjs/toolkit";

import { getStoredCart } from "../utils/cartStorage";

// При запуске приложения восстанавливаем корзину из localStorage
const initialState = {
  items: getStoredCart(),
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;

      const existingProduct = state.items.find(
        (item) => item.id === product.id,
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        state.items.push({
          ...product,
          quantity: 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;

      state.items = state.items.filter((item) => item.id !== productId);
    },

    increaseQuantity: (state, action) => {
      const productId = action.payload;

      const product = state.items.find((item) => item.id === productId);

      if (product) {
        product.quantity += 1;
      }
    },

    decreaseQuantity: (state, action) => {
      const productId = action.payload;

      const product = state.items.find((item) => item.id === productId);

      if (!product) {
        return;
      }

      if (product.quantity > 1) {
        product.quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
