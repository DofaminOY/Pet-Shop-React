import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import styles from "./styles.module.css";

const SALE_URL = "http://localhost:3333/sale/send";

const NAME_PATTERN = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\s'._-]{1,39}$/u;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function RegistrationModal({ isOpen, onClose, onSuccess, activeCustomer }) {
  const [result, setResult] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  if (!isOpen) {
    return null;
  }

  const validatePhone = (value) => {
    const trimmedValue = value.trim();

    const allowedCharacters = /^\+?[\d\s()-]+$/.test(trimmedValue);

    const digits = trimmedValue.replace(/\D/g, "");

    if (!allowedCharacters || digits.length < 7 || digits.length > 15) {
      return "Please enter a valid phone number.";
    }

    return true;
  };

  const handleClose = () => {
    reset();
    clearErrors();
    setResult(null);

    onClose();
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(SALE_URL, {
        name: data.name.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
      });

      if (response.data?.status !== "OK") {
        throw new Error(response.data?.message || "Registration failed.");
      }

      const customer = response.data.customer;
      const customerName = customer?.name || data.name.trim();

      reset();

      if (response.data.mode === "registered") {
        setResult({
          title: `Welcome, ${customerName}!`,
          message:
            "Your account has been created. Your 5% first-order discount is ready.",
        });
      } else if (
        response.data.mode === "signedIn" &&
        response.data.eligibleForFirstOrderDiscount
      ) {
        setResult({
          title: `Welcome back, ${customerName}!`,
          message:
            "You're signed in. Your 5% first-order discount is still available.",
        });
      } else {
        setResult({
          title: `Welcome back, ${customerName}!`,
          message: "Your account has been found and you're now signed in.",
        });
      }

      onSuccess(customer, response.data);
    } catch (error) {
      setError("root.server", {
        type: "server",
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  const accountStatus =
    result ||
    (activeCustomer
      ? {
          title: "You're already signed in",
          message: `You're signed in as ${activeCustomer.name}. No registration is needed.`,
        }
      : null);

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayClick}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-title"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleClose}
          aria-label="Close registration"
        >
          ×
        </button>

        {accountStatus ? (
          <>
            <h2 id="registration-title" className={styles.title}>
              {accountStatus.title}
            </h2>

            <p className={styles.description}>{accountStatus.message}</p>

            <button
              type="button"
              className={styles.submitButton}
              onClick={handleClose}
            >
              Close
            </button>
          </>
        ) : (
          <>
            <h2 id="registration-title" className={styles.title}>
              Registration
            </h2>

            <p className={styles.description}>
              New customers will be registered. Existing customers can sign in
              using the same name, phone number and email.
            </p>

            <form
              className={styles.form}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className={styles.field}>
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

                {errors.name && (
                  <span className={styles.error}>{errors.name.message}</span>
                )}
              </div>

              <div className={styles.field}>
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

                {errors.phone && (
                  <span className={styles.error}>{errors.phone.message}</span>
                )}
              </div>

              <div className={styles.field}>
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

                {errors.email && (
                  <span className={styles.error}>{errors.email.message}</span>
                )}
              </div>

              {errors.root?.server && (
                <div className={styles.serverError}>
                  {errors.root.server.message}
                </div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Checking..." : "Continue"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default RegistrationModal;
