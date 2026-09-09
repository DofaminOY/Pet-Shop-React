import { createSlice } from "@reduxjs/toolkit";

import { getStoredCustomer } from "../utils/customerStorage";

const initialState = {
  customer: getStoredCustomer(),
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
