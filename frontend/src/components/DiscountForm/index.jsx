import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import discountPets from "../../assets/images/discount-pets.svg";

import FormStatusModal from "../FormStatusModal";

import styles from "./styles.module.css";

const SALE_URL = "http://localhost:3333/sale/send";

// Проверка имени:
// буквы, пробел, дефис и апостроф
const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'-]{1,39}$/u;

// Базовая проверка формата электронной почты
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function DiscountForm() {
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

  // Проверяем номер телефона без чрезмерно жесткого формата
  const validatePhone = (value) => {
    const trimmedValue = value.trim();

    const allowedCharacters = /^\+?[\d\s()-]+$/.test(trimmedValue);

    const digits = trimmedValue.replace(/\D/g, "");

    if (!allowedCharacters) {
      return "Please enter a valid phone number.";
    }

    if (digits.length < 7 || digits.length > 15) {
      return "Please enter a valid phone number.";
    }

    return true;
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(SALE_URL, data);

      // Проверяем не только HTTP-запрос,
      // но и ответ самого backend
      if (response.data?.status && response.data.status !== "OK") {
        throw new Error("Request was not processed");
      }

      reset();

      setIsSubmitted(true);

      showNotification({
        title: "Success!",
        message: "Your discount request has been submitted successfully.",
        duration: 4000,
      });
    } catch {
      showNotification({
        title: "Something went wrong",
        message: "The discount request could not be sent. Please try again.",
        duration: 4000,
      });
    }
  };

  const onInvalid = (formErrors) => {
    const errorMessages = [
      formErrors.name?.message,
      formErrors.phone?.message,
      formErrors.email?.message,
    ].filter(Boolean);

    const message =
      errorMessages.length === 1
        ? errorMessages[0]
        : "Please check the entered information. Some fields contain invalid data.";

    showNotification({
      title: "Check your data",
      message,
      duration: 4000,
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
              aria-invalid={errors.name ? "true" : "false"}
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
              aria-invalid={errors.phone ? "true" : "false"}
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
              aria-invalid={errors.email ? "true" : "false"}
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
