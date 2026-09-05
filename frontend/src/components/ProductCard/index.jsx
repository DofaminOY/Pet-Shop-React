import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { addToCart } from "../../redux/cartSlice";

import styles from "./styles.module.css";

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const isInCart = useSelector((state) =>
    state.cart.items.some((item) => item.id === product.id),
  );

  const hasDiscount =
    product.discont_price !== null &&
    product.discont_price !== undefined &&
    Number(product.discont_price) < Number(product.price);

  const currentPrice = hasDiscount ? product.discont_price : product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.price) - Number(product.discont_price)) /
          Number(product.price)) *
          100,
      )
    : 0;

  const handleAddToCart = () => {
    dispatch(addToCart(product));
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
        className={`${styles.addButton} ${isInCart ? styles.addedButton : ""}`}
        onClick={handleAddToCart}
        disabled={isInCart}
      >
        {isInCart ? "Added" : "Add to cart"}
      </button>
    </article>
  );
}

export default ProductCard;
