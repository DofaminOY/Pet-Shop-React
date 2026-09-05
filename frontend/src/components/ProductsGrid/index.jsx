import ProductCard from "../ProductCard";

import styles from "./styles.module.css";

function ProductsGrid({ products }) {
  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductsGrid;
