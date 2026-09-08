import { useEffect } from "react";

import styles from "./styles.module.css";

function FormStatusModal({ isOpen, title, message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    // Автоматически закрываем сообщение через заданное время
    const timer = window.setTimeout(() => {
      onClose();
    }, duration);

    // Позволяем закрыть окно клавишей Escape
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, duration, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={handleOverlayClick}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="form-status-title"
        aria-describedby="form-status-message"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close message"
        >
          ×
        </button>

        <h2 id="form-status-title" className={styles.title}>
          {title}
        </h2>

        <p id="form-status-message" className={styles.message}>
          {message}
        </p>

        <div className={styles.timerTrack}>
          <div
            className={styles.timerBar}
            style={{
              animationDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default FormStatusModal;
