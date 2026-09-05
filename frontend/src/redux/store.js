import { configureStore } from "@reduxjs/toolkit";

import categoriesReducer from "./categoriesSlice";
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});

export default store;
