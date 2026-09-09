const CUSTOMER_STORAGE_KEY = "petShopCustomer";

export function getStoredCustomer() {
  try {
    const storedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY);

    return storedCustomer ? JSON.parse(storedCustomer) : null;
  } catch {
    return null;
  }
}

export function saveStoredCustomer(customer) {
  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
}

export function clearStoredCustomer() {
  localStorage.removeItem(CUSTOMER_STORAGE_KEY);
}
