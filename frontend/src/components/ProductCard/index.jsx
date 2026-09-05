import { Link } from "react-router-dom";

import styles from "./styles.module.css";

function ProductCard({ product }) {
  const hasDiscount =
    product.discont_price !== null && product.discont_price < product.price;

  const currentPrice = hasDiscount ? product.discont_price : product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discont_price) / product.price) * 100,
      )
    : 0;

  return (
    <Link to={`/products/${product.id}`} className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.title} className={styles.image} />

        {hasDiscount && (
          <span className={styles.discount}>-{discountPercent}%</span>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>

        <div className={styles.price}>
          <span className={styles.currentPrice}>${currentPrice}</span>

          {hasDiscount && (
            <span className={styles.oldPrice}>${product.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
