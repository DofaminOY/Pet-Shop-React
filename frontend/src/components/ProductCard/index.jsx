import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const [isAdded, setIsAdded] = useState(false);

  const hasDiscount = hasProductDiscount(product);
  const currentPrice = getProductPrice(product);
  const discountPercent = getDiscountPercent(product);

  useEffect(() => {
    if (!isAdded) {
      return undefined;
    }

    // Через 1.5 секунды снова разрешаем добавлять товар
    const timer = setTimeout(() => {
      setIsAdded(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [isAdded]);

  const handleAddToCart = () => {
    // Пока отображается Added, повторное добавление блокируем
    if (isAdded) {
      return;
    }

    dispatch(addToCart(product));

    setIsAdded(true);
  };

  return (
    <article className={styles.productCard}>
      <Link
        to={`/products/${product.id}`}
        state={{ from: location.pathname }}
        className={styles.productLink}
      >
        <div className={styles.imageWrapper}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.image}
          />

          {hasDiscount && (
            <span className={styles.discountBadge}>-{discountPercent}%</span>
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
