import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import discountPets from "../../assets/images/discount-pets.svg";

import styles from "./styles.module.css";

function DiscountForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitError("");

      await axios.post("http://localhost:3333/sale/send", data);

      setIsSubmitted(true);
      reset();
    } catch (error) {
      setSubmitError("Failed to send request.");
      console.error(error);
    }
  };

  return (
    <section className={styles.discountSection}>
      <h2 className={styles.title}>5% off on the first order</h2>

      <div className={styles.content}>
        <div className={styles.imageWrapper}>
          <img src={discountPets} alt="Pets" className={styles.image} />
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className={styles.field}>
            <input
              type="text"
              placeholder="Name"
              className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
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
              className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
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
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
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

          <button
            type="submit"
            className={`${styles.button} ${isSubmitted ? styles.buttonSubmitted : ""}`}
            disabled={isSubmitting || isSubmitted}
          >
            {isSubmitted
              ? "Request Submitted"
              : isSubmitting
                ? "Sending..."
                : "Get a discount"}
          </button>

          {submitError && <p className={styles.submitError}>{submitError}</p>}
        </form>
      </div>
    </section>
  );
}

export default DiscountForm;
