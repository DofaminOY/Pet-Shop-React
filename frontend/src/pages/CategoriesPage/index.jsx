import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumbs from "../../components/Breadcrumbs";
import CategoryCard from "../../components/CategoryCard";

import { fetchCategories } from "../../redux/thunks";

import styles from "./styles.module.css";

function CategoriesPage() {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.categories.categories);

  const status = useSelector((state) => state.categories.status);

  const error = useSelector((state) => state.categories.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

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
          },
        ]}
      />

      <section className={`${styles.categoriesPage} container`}>
        <h1 className={styles.title}>Categories</h1>

        {status === "loading" && (
          <p className={styles.message}>Loading categories...</p>
        )}

        {status === "failed" && (
          <p className={styles.message}>Failed to load categories: {error}</p>
        )}

        {status === "succeeded" && (
          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default CategoriesPage;
