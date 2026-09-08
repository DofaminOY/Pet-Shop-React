import { configureStore } from "@reduxjs/toolkit";

import categoriesReducer from "./categoriesSlice";
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";
import customerReducer from "./customerSlice";

const store = configureStore({
  reducer: {
    categories: categoriesReducer,
    products: productsReducer,
    cart: cartReducer,
    customer: customerReducer,
  },
});

export default store;
