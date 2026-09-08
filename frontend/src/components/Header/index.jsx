import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import logo from "../../assets/icons/logo.svg";
import cartIcon from "../../assets/icons/cart.svg";

import RegistrationModal from "../RegistrationModal";

import { logoutCustomer, setCustomer } from "../../redux/customerSlice";

import styles from "./styles.module.css";

const CUSTOMER_STORAGE_KEY = "petShopCustomer";

function Header() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.quantity, 0),
  );

  const customer = useSelector((state) => state.customer.customer);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openRegistration = () => {
    closeMenu();
    setIsRegistrationOpen(true);
  };

  const handleRegistrationSuccess = (registeredCustomer) => {
    dispatch(setCustomer(registeredCustomer));

    localStorage.setItem(
      CUSTOMER_STORAGE_KEY,
      JSON.stringify(registeredCustomer),
    );

    setIsRegistrationOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutCustomer());

    localStorage.removeItem(CUSTOMER_STORAGE_KEY);

    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={styles.header}>
        <div className={`${styles.headerContent} container`}>
          <Link to="/" className={styles.logoLink} onClick={closeMenu}>
            <img src={logo} alt="Pet Shop" className={styles.logo} />
          </Link>

          <nav className={styles.desktopNav}>
            <Link
              to="/"
              className={`${styles.navLink} ${
                isActive("/") ? styles.active : ""
              }`}
            >
              Main Page
            </Link>

            <Link
              to="/categories"
              className={`${styles.navLink} ${
                isActive("/categories") ? styles.active : ""
              }`}
            >
              Categories
            </Link>

            <Link
              to="/products"
              className={`${styles.navLink} ${
                isActive("/products") ? styles.active : ""
              }`}
            >
              All products
            </Link>

            <Link
              to="/sales"
              className={`${styles.navLink} ${
                isActive("/sales") ? styles.active : ""
              }`}
            >
              All sales
            </Link>

            <button
              type="button"
              className={styles.navButton}
              onClick={openRegistration}
            >
              Registration
            </button>
          </nav>

          <div className={styles.rightSide}>
            {customer && (
              <div className={styles.account}>
                <div className={styles.emailWrapper} title={customer.email}>
                  <svg
                    className={styles.userIcon}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />

                    <path
                      d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <span className={styles.email}>{customer.email}</span>
                </div>

                <button
                  type="button"
                  className={styles.logout}
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            )}

            <Link to="/cart" className={styles.cartLink} onClick={closeMenu}>
              <img
                src={cartIcon}
                alt="Shopping cart"
                className={styles.cartIcon}
              />

              {cartCount > 0 && (
                <span className={styles.cartCount}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              className={styles.burger}
              onClick={() => setIsMenuOpen((current) => !current)}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          {isMenuOpen && (
            <div className={styles.mobileMenu}>
              <Link to="/" className={styles.mobileLink} onClick={closeMenu}>
                Main Page
              </Link>

              <Link
                to="/categories"
                className={styles.mobileLink}
                onClick={closeMenu}
              >
                Categories
              </Link>

              <Link
                to="/products"
                className={styles.mobileLink}
                onClick={closeMenu}
              >
                All products
              </Link>

              <Link
                to="/sales"
                className={styles.mobileLink}
                onClick={closeMenu}
              >
                All sales
              </Link>

              <button
                type="button"
                className={styles.mobileButton}
                onClick={openRegistration}
              >
                Registration
              </button>

              {customer && (
                <div className={styles.mobileAccount}>
                  <span className={styles.mobileEmail} title={customer.email}>
                    {customer.email}
                  </span>

                  <button
                    type="button"
                    className={styles.mobileLogout}
                    onClick={handleLogout}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onSuccess={handleRegistrationSuccess}
      />
    </>
  );
}

export default Header;
