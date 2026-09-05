import { createSlice } from "@reduxjs/toolkit";

import { fetchCategories, fetchCategoryById } from "./thunks";

const initialState = {
  categories: [],
  status: "idle",
  error: null,

  currentCategory: null,
  categoryProducts: [],
  categoryStatus: "idle",
  categoryError: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchCategoryById.pending, (state) => {
        state.categoryStatus = "loading";
        state.categoryError = null;
        state.currentCategory = null;
        state.categoryProducts = [];
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.categoryStatus = "succeeded";
        state.currentCategory = action.payload.category;
        state.categoryProducts = action.payload.products;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.categoryStatus = "failed";
        state.categoryError = action.payload;
      });
  },
});

export default categoriesSlice.reducer;
