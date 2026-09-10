import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";

import { setCustomer } from "../../redux/customerSlice";

import styles from "./styles.module.css";

const ORDER_URL = "http://localhost:3333/order/send";

const CUSTOMER_STORAGE_KEY = "petShopCustomer";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function getItemPrice(item) {
  const price = Number(item.price);

  const discountPrice =
    item.discont_price !== null && item.discont_price !== undefined
      ? Number(item.discont_price)
      : null;

  if (discountPrice !== null && discountPrice < price) {
    return discountPrice;
  }

  return price;
}

function OrderForm({ items, isOrderPlaced, onOrderSuccess }) {
  const dispatch = useDispatch();

  const customer = useSelector((state) => state.customer.customer);

  const subtotal = items.reduce(
    (total, item) => total + getItemPrice(item) * item.quantity,
    0,
  );

  const hasFirstOrderDiscount =
    Boolean(customer) && customer.hasCompletedFirstPurchase === false;

  const discountAmount = hasFirstOrderDiscount ? subtotal * 0.05 : 0;

  const finalTotal = subtotal - discountAmount;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: customer?.name || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
    },
  });

  useEffect(() => {
    reset({
      name: customer?.name || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
    });
  }, [customer, reset]);

  const validatePhone = (value) => {
    const digits = value.replace(/\D/g, "");

    const allowedCharacters = /^\+?[\d\s()-]+$/.test(value.trim());

    return allowedCharacters && digits.length >= 7 && digits.length <= 15;
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(ORDER_URL, {
        // Передаем id аккаунта отдельно от контактных данных заказа
        customerId: customer?.id || null,

        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),

        products: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      });

      if (response.data?.status !== "OK") {
        throw new Error(response.data?.message || "Order failed.");
      }

      if (response.data.customer) {
        dispatch(setCustomer(response.data.customer));

        localStorage.setItem(
          CUSTOMER_STORAGE_KEY,
          JSON.stringify(response.data.customer),
        );
      }

      onOrderSuccess(response.data);
    } catch (error) {
      window.alert(
        error.response?.data?.message ||
          "The order could not be placed. Please check your data.",
      );
    }
  };

  return (
    <div className={styles.orderDetails}>
      <h2 className={styles.title}>Order details</h2>

      <p className={styles.itemsCount}>
        {items.reduce((total, item) => total + item.quantity, 0)} items
      </p>

      <div className={styles.priceBlock}>
        <div className={styles.priceRow}>
          <span>Subtotal</span>

          <strong>${subtotal.toFixed(2)}</strong>
        </div>

        {hasFirstOrderDiscount && (
          <div className={`${styles.priceRow} ${styles.discountRow}`}>
            <span>First order discount</span>

            <strong>-${discountAmount.toFixed(2)} (-5%)</strong>
          </div>
        )}

        {!customer && (
          <p className={styles.discountInfo}>
            Register to activate an additional 5% discount on your first order.
          </p>
        )}

        {customer && customer.hasCompletedFirstPurchase && (
          <p className={styles.discountUsed}>
            First order discount has already been used.
          </p>
        )}

        <div className={`${styles.priceRow} ${styles.totalRow}`}>
          <span>Total</span>

          <strong>${finalTotal.toFixed(2)}</strong>
        </div>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div>
          <input
            type="text"
            placeholder="Name"
            className={`${styles.input} ${
              errors.name ? styles.inputError : ""
            }`}
            {...register("name", {
              required: "Name is required.",
              minLength: 2,
            })}
          />

          {errors.name && (
            <span className={styles.error}>Please enter your name.</span>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone number"
            className={`${styles.input} ${
              errors.phone ? styles.inputError : ""
            }`}
            {...register("phone", {
              required: "Phone is required.",
              validate: validatePhone,
            })}
          />

          {errors.phone && (
            <span className={styles.error}>
              Please enter a valid phone number.
            </span>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            readOnly={Boolean(customer)}
            className={`${styles.input} ${
              errors.email ? styles.inputError : ""
            }`}
            {...register("email", {
              required: "Email is required.",

              pattern: {
                value: EMAIL_PATTERN,
                message: "Invalid email.",
              },
            })}
          />

          {errors.email && (
            <span className={styles.error}>
              Please enter a valid email address.
            </span>
          )}
        </div>

        <button
          type="submit"
          className={`${styles.orderButton} ${
            isOrderPlaced ? styles.orderButtonPlaced : ""
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
    </div>
  );
}

export default OrderForm;
