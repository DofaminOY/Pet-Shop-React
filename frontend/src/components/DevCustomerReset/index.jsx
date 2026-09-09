import { cloneElement } from "react";
import axios from "axios";

const CLEAR_CUSTOMERS_URL = "http://localhost:3333/dev/customers";

function DevCustomerReset({ children, onCleared }) {
  const handleClick = async (event) => {
    // Срабатывает только при зажатом Ctrl и обычном левом клике
    if (!event.ctrlKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    try {
      const response = await axios.delete(CLEAR_CUSTOMERS_URL);

      if (response.data?.status !== "OK") {
        throw new Error("Customers were not cleared.");
      }

      onCleared?.();

      window.alert(
        `Customers database cleared. Deleted: ${response.data.deletedCount}`,
      );
    } catch (error) {
      console.error("Failed to clear customers:", error);

      window.alert(
        error.response?.data?.message || "Failed to clear customers database.",
      );
    }
  };

  return cloneElement(children, {
    onClick: handleClick,
  });
}

export default DevCustomerReset;
