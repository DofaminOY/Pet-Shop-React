import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:3333";

// Получаем все категории с backend
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/categories/all`);

      const categories = response.data.map((category) => ({
        ...category,
        image: `${BASE_URL}${category.image}`,
      }));

      return categories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
