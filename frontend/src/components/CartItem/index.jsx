import { useDispatch } from "react-redux";

import QuantityControl from "../QuantityControl";

import { removeFromCart } from "../../redux/cartSlice";

import styles from "./styles.module.css";

function CartItem({ item }) {
  const dispatch = useDispatch();

  const hasDiscount =
    item.discont_price !== null &&
    item.discont_price !== undefined &&
    Number(item.discont_price) < Number(item.price);

  const currentPrice = hasDiscount
    ? Number(item.discont_price)
    : Number(item.price);

  return (
    <article className={styles.cartItem}>
      <div className={styles.imageWrapper}>
        <img src={item.image} alt={item.title} className={styles.image} />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{item.title}</h3>

          <button
            type="button"
            className={styles.removeButton}
            onClick={() => dispatch(removeFromCart(item.id))}
            aria-label="Remove product from cart"
          >
            ×
          </button>
        </div>

        <div className={styles.bottom}>
          <QuantityControl productId={item.id} quantity={item.quantity} />

          <div className={styles.price}>
            <span className={styles.currentPrice}>${currentPrice}</span>

            {hasDiscount && (
              <span className={styles.oldPrice}>${item.price}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default CartItem;
