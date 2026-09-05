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

// Получаем выбранную категорию и товары этой категории с backend
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/categories/${id}`);

      const category = response.data.category;

      const products = response.data.data.map((product) => ({
        ...product,
        image: `${BASE_URL}${product.image}`,
      }));

      return {
        category,
        products,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
