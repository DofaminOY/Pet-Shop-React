import { createSlice } from "@reduxjs/toolkit";

import { fetchProducts, fetchSaleProducts } from "./thunks";

const initialState = {
  products: [],
  status: "idle",
  error: null,

  saleProducts: [],
  saleStatus: "idle",
  saleError: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchSaleProducts.pending, (state) => {
        state.saleStatus = "loading";
        state.saleError = null;
      })
      .addCase(fetchSaleProducts.fulfilled, (state, action) => {
        state.saleStatus = "succeeded";
        state.saleProducts = action.payload;
      })
      .addCase(fetchSaleProducts.rejected, (state, action) => {
        state.saleStatus = "failed";
        state.saleError = action.payload;
      });
  },
});

export default productsSlice.reducer;
