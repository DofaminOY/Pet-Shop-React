import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";
import Filters from "../../components/Filters";
import ProductsGrid from "../../components/ProductsGrid";

import { fetchCategoryById } from "../../redux/thunks";

import styles from "./styles.module.css";

// Возвращаем актуальную цену товара с учетом скидки
function getProductPrice(product) {
  const hasDiscount =
    product.discont_price !== null &&
    product.discont_price !== undefined &&
    Number(product.discont_price) < Number(product.price);

  return hasDiscount ? Number(product.discont_price) : Number(product.price);
}

function CategoryPage() {
  const { id } = useParams();

  const dispatch = useDispatch();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [sortType, setSortType] = useState("default");

  const currentCategory = useSelector(
    (state) => state.categories.currentCategory,
  );

  const categoryProducts = useSelector(
    (state) => state.categories.categoryProducts,
  );

  const categoryStatus = useSelector(
    (state) => state.categories.categoryStatus,
  );

  const categoryError = useSelector((state) => state.categories.categoryError);

  // Получаем выбранную категорию и ее товары
  useEffect(() => {
    dispatch(fetchCategoryById(id));
  }, [dispatch, id]);

  // Фильтруем и сортируем товары без изменения данных в Redux
  const filteredProducts = useMemo(() => {
    let result = [...categoryProducts];

    if (minPrice !== "") {
      result = result.filter(
        (product) => getProductPrice(product) >= Number(minPrice),
      );
    }

    if (maxPrice !== "") {
      result = result.filter(
        (product) => getProductPrice(product) <= Number(maxPrice),
      );
    }

    if (discountedOnly) {
      result = result.filter(
        (product) =>
          product.discont_price !== null &&
          product.discont_price !== undefined &&
          Number(product.discont_price) < Number(product.price),
      );
    }

    if (sortType === "newest") {
      result.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        return Number(b.id) - Number(a.id);
      });
    }

    if (sortType === "price-high-low") {
      result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    }

    if (sortType === "price-low-high") {
      result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    }

    return result;
  }, [categoryProducts, minPrice, maxPrice, discountedOnly, sortType]);

  const categoryTitle = currentCategory?.title || "Category";

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: "Main page",
            to: "/",
          },
          {
            label: "Categories",
            to: "/categories",
          },
          {
            label: categoryTitle,
          },
        ]}
      />

      <section className={`${styles.categoryPage} container`}>
        <h1 className={styles.title}>{categoryTitle}</h1>

        {categoryStatus === "loading" && (
          <p className={styles.message}>Loading products...</p>
        )}

        {categoryStatus === "failed" && (
          <p className={styles.message}>
            Failed to load category: {categoryError}
          </p>
        )}

        {categoryStatus === "succeeded" && (
          <>
            <Filters
              minPrice={minPrice}
              maxPrice={maxPrice}
              discountedOnly={discountedOnly}
              sortType={sortType}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onDiscountedChange={setDiscountedOnly}
              onSortChange={setSortType}
            />

            {filteredProducts.length > 0 ? (
              <ProductsGrid products={filteredProducts} />
            ) : (
              <p className={styles.message}>No products found.</p>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default CategoryPage;
