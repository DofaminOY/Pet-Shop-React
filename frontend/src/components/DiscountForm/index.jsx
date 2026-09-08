import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";

import discountPets from "../../assets/images/discount-pets.svg";

import FormStatusModal from "../FormStatusModal";

import { setCustomer } from "../../redux/customerSlice";

import styles from "./styles.module.css";

const SALE_URL = "http://localhost:3333/sale/send";

const CUSTOMER_STORAGE_KEY = "petShopCustomer";

const NAME_PATTERN = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\s'._-]{1,39}$/u;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function DiscountForm() {
  const dispatch = useDispatch();

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [notification, setNotification] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showNotification = ({ title, message, duration = 4000 }) => {
    setNotification({
      title,
      message,
      duration,
    });
  };

  const validatePhone = (value) => {
    const trimmedValue = value.trim();

    const allowedCharacters = /^\+?[\d\s()-]+$/.test(trimmedValue);

    const digits = trimmedValue.replace(/\D/g, "");

    if (!allowedCharacters || digits.length < 7 || digits.length > 15) {
      return "Please enter a valid phone number.";
    }

    return true;
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(SALE_URL, {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
      });

      if (response.data?.status !== "OK") {
        throw new Error(response.data?.message || "Request was not processed.");
      }

      const customer = response.data.customer;

      if (customer) {
        dispatch(setCustomer(customer));

        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
      }

      reset();
      setIsSubmitted(true);

      if (response.data.eligibleForFirstOrderDiscount) {
        showNotification({
          title: "5% discount activated!",
          message: "Your first order will receive an additional 5% discount.",
        });

        return;
      }

      showNotification({
        title: "Discount already used",
        message:
          "Your account was found, but the 5% first-order discount has already been used.",
      });
    } catch (error) {
      const backendMessage = error.response?.data?.message;

      if (error.response?.status === 409 || error.response?.status === 400) {
        showNotification({
          title: "Check your data",
          message: backendMessage || "Please check the entered information.",
        });

        return;
      }

      showNotification({
        title: "Something went wrong",
        message: "The request could not be sent. Please try again.",
      });
    }
  };

  const onInvalid = (formErrors) => {
    const errorMessages = [
      formErrors.name?.message,
      formErrors.phone?.message,
      formErrors.email?.message,
    ].filter(Boolean);

    showNotification({
      title: "Check your data",

      message:
        errorMessages.length === 1
          ? errorMessages[0]
          : "Please check the entered information. Some fields contain invalid data.",
    });
  };

  return (
    <>
      <section className={styles.discountSection}>
        <h2 className={styles.title}>5% off on the first order</h2>

        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            <img src={discountPets} alt="Pets" className={styles.image} />
          </div>

          <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            noValidate
          >
            <input
              type="text"
              placeholder="Name"
              autoComplete="name"
              className={`${styles.input} ${
                errors.name ? styles.inputError : ""
              }`}
              {...register("name", {
                required: "Please enter your name.",

                minLength: {
                  value: 2,
                  message: "Name must contain at least 2 characters.",
                },

                maxLength: {
                  value: 40,
                  message: "Name must contain no more than 40 characters.",
                },

                pattern: {
                  value: NAME_PATTERN,
                  message: "Please enter a valid name.",
                },
              })}
            />

            <input
              type="tel"
              placeholder="Phone number"
              autoComplete="tel"
              className={`${styles.input} ${
                errors.phone ? styles.inputError : ""
              }`}
              {...register("phone", {
                required: "Please enter your phone number.",
                validate: validatePhone,
              })}
            />

            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              className={`${styles.input} ${
                errors.email ? styles.inputError : ""
              }`}
              {...register("email", {
                required: "Please enter your email.",

                pattern: {
                  value: EMAIL_PATTERN,
                  message: "Please enter a valid email address.",
                },
              })}
            />

            <button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className={`${styles.button} ${
                isSubmitted ? styles.buttonSubmitted : ""
              }`}
            >
              {isSubmitted
                ? "Request Submitted"
                : isSubmitting
                  ? "Sending..."
                  : "Get a discount"}
            </button>
          </form>
        </div>
      </section>

      <FormStatusModal
        isOpen={Boolean(notification)}
        title={notification?.title || ""}
        message={notification?.message || ""}
        duration={notification?.duration || 4000}
        onClose={closeNotification}
      />
    </>
  );
}

export default DiscountForm;
