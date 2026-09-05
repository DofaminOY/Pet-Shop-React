import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SectionHeader from "../SectionHeader";
import CategoryCard from "../CategoryCard";

import { fetchCategories } from "../../redux/thunks";

import styles from "./styles.module.css";

function CategoriesSection() {
  const dispatch = useDispatch();

  const categories = useSelector((state) => state.categories.categories);
  const status = useSelector((state) => state.categories.status);
  const error = useSelector((state) => state.categories.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const homeCategories = categories.slice(0, 4);

  return (
    <section className={`${styles.categoriesSection} container`}>
      <SectionHeader
        title="Categories"
        linkText="All categories"
        linkTo="/categories"
      />

      {status === "loading" && (
        <p className={styles.message}>Loading categories...</p>
      )}

      {status === "failed" && (
        <p className={styles.message}>Failed to load categories: {error}</p>
      )}

      {status === "succeeded" && (
        <div className={styles.categoriesList}>
          {homeCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoriesSection;
