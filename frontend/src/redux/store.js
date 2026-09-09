import { configureStore } from "@reduxjs/toolkit";

import categoriesReducer from "./categoriesSlice";
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";
import customerReducer from "./customerSlice";

import { saveStoredCart } from "../utils/cartStorage";

export const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
    customer: customerReducer,
  },
});

// Запоминаем последнее состояние корзины,
// чтобы не записывать localStorage при изменении других Redux-состояний
let previousCartItems = store.getState().cart.items;

// Следим за изменениями Redux store
store.subscribe(() => {
  const currentCartItems = store.getState().cart.items;

  // Сохраняем только если корзина действительно изменилась
  if (currentCartItems !== previousCartItems) {
    saveStoredCart(currentCartItems);

    previousCartItems = currentCartItems;
  }
});

// Сохраняем существующий default export для main.jsx
export default store;
