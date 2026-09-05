import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import CartItem from "../../components/CartItem";
import OrderForm from "../../components/OrderForm";
import SuccessModal from "../../components/SuccessModal";

import { clearCart } from "../../redux/cartSlice";

import styles from "./styles.module.css";

function CartPage() {
  const dispatch = useDispatch();

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const items = useSelector((state) => state.cart.items);

  const itemsCount = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce((total, item) => {
    const hasDiscount =
      item.discont_price !== null &&
      item.discont_price !== undefined &&
      Number(item.discont_price) < Number(item.price);

    const price = hasDiscount ? Number(item.discont_price) : Number(item.price);

    return total + price * item.quantity;
  }, 0);

  const handleOrderSuccess = () => {
    setIsOrderPlaced(true);
    setIsSuccessModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    setIsOrderPlaced(false);

    dispatch(clearCart());
  };

  return (
    <>
      <section className={`${styles.cartPage} container`}>
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping cart</h1>

          <Link to="/products" className={styles.backLink}>
            Back to the store
          </Link>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>
              Looks like you have no items in your basket currently.
            </p>

            <Link to="/products" className={styles.continueButton}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.list}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <OrderForm
              items={items}
              itemsCount={itemsCount}
              totalPrice={totalPrice}
              isOrderPlaced={isOrderPlaced}
              onSuccess={handleOrderSuccess}
            />
          </div>
        )}
      </section>

      <SuccessModal isOpen={isSuccessModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default CartPage;
