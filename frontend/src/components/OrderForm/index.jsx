import { useForm } from "react-hook-form";
import axios from "axios";

import styles from "./styles.module.css";

function OrderForm({
  items,
  itemsCount,
  totalPrice,
  isOrderPlaced,
  onSuccess,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const orderProducts = items.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      discont_price: item.discont_price,
      quantity: item.quantity,
    }));

    const orderData = {
      ...data,
      products: orderProducts,
      total: totalPrice,
    };

    try {
      await axios.post("http://localhost:3333/order/send", orderData);

      onSuccess();
    } catch (error) {
      console.error("Ошибка отправки заказа:", error);
    }
  };

  return (
    <aside className={styles.orderForm}>
      <div className={styles.details}>
        <h2 className={styles.title}>Order details</h2>

        <div className={styles.summary}>
          <p className={styles.items}>
            {itemsCount} {itemsCount === 1 ? "item" : "items"}
          </p>

          <div className={styles.total}>
            <span className={styles.totalLabel}>Total</span>

            <strong className={styles.totalPrice}>
              ${totalPrice.toFixed(2)}
            </strong>
          </div>
        </div>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className={styles.inputs}>
          <div className={styles.field}>
            <input
              type="text"
              placeholder="Name"
              className={`${styles.input} ${
                errors.name ? styles.inputError : ""
              }`}
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Enter at least 2 characters",
                },
              })}
            />

            {errors.name && (
              <span className={styles.error}>{errors.name.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <input
              type="tel"
              placeholder="Phone number"
              className={`${styles.input} ${
                errors.phone ? styles.inputError : ""
              }`}
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[+\d][\d\s()-]{6,}$/,
                  message: "Enter a valid phone number",
                },
              })}
            />

            {errors.phone && (
              <span className={styles.error}>{errors.phone.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <input
              type="email"
              placeholder="Email"
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <span className={styles.error}>{errors.email.message}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={`${styles.button} ${
            isOrderPlaced ? styles.placedButton : ""
          }`}
          disabled={isSubmitting || isOrderPlaced}
        >
          {isOrderPlaced
            ? "The Order is Placed"
            : isSubmitting
              ? "Sending..."
              : "Order"}
        </button>
      </form>
    </aside>
  );
}

export default OrderForm;
