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

// Получаем все товары с backend
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/all`);

      const products = response.data.map((product) => ({
        ...product,
        image: `${BASE_URL}${product.image}`,
      }));

      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Получаем четыре случайных товара со скидкой для главной страницы
export const fetchSaleProducts = createAsyncThunk(
  "products/fetchSaleProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/all`);

      const products = response.data.map((product) => ({
        ...product,
        image: `${BASE_URL}${product.image}`,
      }));

      const discountedProducts = products.filter(
        (product) =>
          product.discont_price !== null &&
          product.discont_price !== undefined &&
          Number(product.discont_price) < Number(product.price),
      );

      const shuffledProducts = [...discountedProducts];

      // Перемешиваем товары вне рендера компонента
      for (let i = shuffledProducts.length - 1; i > 0; i -= 1) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        [shuffledProducts[i], shuffledProducts[randomIndex]] = [
          shuffledProducts[randomIndex],
          shuffledProducts[i],
        ];
      }

      return shuffledProducts.slice(0, 4);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
