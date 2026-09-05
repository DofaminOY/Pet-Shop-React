import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs";
import ProductsGrid from "../../components/ProductsGrid";

import { fetchCategoryById } from "../../redux/thunks";

import styles from "./styles.module.css";

function CategoryPage() {
  const { id } = useParams();

  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(fetchCategoryById(id));
  }, [dispatch, id]);

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

        {(categoryStatus === "idle" || categoryStatus === "loading") && (
          <p className={styles.message}>Loading products...</p>
        )}

        {categoryStatus === "failed" && (
          <p className={styles.message}>
            Failed to load category: {categoryError}
          </p>
        )}

        {categoryStatus === "succeeded" && (
          <ProductsGrid products={categoryProducts} />
        )}
      </section>
    </>
  );
}

export default CategoryPage;
