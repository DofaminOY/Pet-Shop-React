import styles from "./styles.module.css";

function SuccessModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
      >
        <div className={styles.content}>
          <h2 id="success-title" className={styles.title}>
            Congratulations!
          </h2>

          <p className={styles.text}>
            Your order has been successfully placed on the website.
            <br />A manager will contact you shortly to confirm your order.
          </p>
        </div>

        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;
