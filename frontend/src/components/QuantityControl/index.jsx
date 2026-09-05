import { useDispatch } from "react-redux";

import { increaseQuantity, decreaseQuantity } from "../../redux/cartSlice";

import styles from "./styles.module.css";

function QuantityControl({ productId, quantity }) {
  const dispatch = useDispatch();

  return (
    <div className={styles.quantity}>
      <button
        type="button"
        className={styles.button}
        onClick={() => dispatch(decreaseQuantity(productId))}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <div className={styles.value}>{quantity}</div>

      <button
        type="button"
        className={styles.button}
        onClick={() => dispatch(increaseQuantity(productId))}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantityControl;
