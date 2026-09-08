import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { addToCart } from "../../redux/cartSlice";

import {
  getDiscountPercent,
  getProductPrice,
  hasProductDiscount,
} from "../../utils/productPrice";

import styles from "./styles.module.css";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const [isAdded, setIsAdded] = useState(false);

  const hasDiscount = hasProductDiscount(product);
  const currentPrice = getProductPrice(product);
  const discountPercent = getDiscountPercent(product);

  useEffect(() => {
    if (!isAdded) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setIsAdded(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [isAdded]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));

    setIsAdded(true);
  };

  return (
    <article className={styles.productCard}>
      <Link to={`/products/${product.id}`} className={styles.productLink}>
        <div className={styles.imageWrapper}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.image}
          />

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

      <button
        type="button"
        className={`${styles.addButton} ${isAdded ? styles.addedButton : ""}`}
        onClick={handleAddToCart}
        disabled={isAdded}
      >
        {isAdded ? "Added" : "Add to cart"}
      </button>
    </article>
  );
}

export default ProductCard;
