import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "petShopCustomer";

function getSavedCustomer() {
  try {
    const savedCustomer = localStorage.getItem(STORAGE_KEY);

    return savedCustomer ? JSON.parse(savedCustomer) : null;
  } catch {
    return null;
  }
}

const initialState = {
  customer: getSavedCustomer(),
};

const customerSlice = createSlice({
  name: "customer",

  initialState,

  reducers: {
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },

    logoutCustomer: (state) => {
      state.customer = null;
    },
  },
});

export const { setCustomer, logoutCustomer } = customerSlice.actions;

export default customerSlice.reducer;
