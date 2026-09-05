import { Link } from "react-router-dom";

import styles from "./styles.module.css";

function CategoryCard({ category }) {
  return (
    <Link to={`/categories/${category.id}`} className={styles.categoryCard}>
      <img src={category.image} alt={category.title} className={styles.image} />

      <h3 className={styles.title}>{category.title}</h3>
    </Link>
  );
}

export default CategoryCard;
