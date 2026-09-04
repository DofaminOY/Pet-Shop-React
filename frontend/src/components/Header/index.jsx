import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/icons/logo.svg";
import cart from "../../assets/icons/cart.svg";

import styles from "./styles.module.css";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Временно количество товаров равно нулю.
  // Позже это значение будем получать из Redux.
  const cartCount = 0;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link
          to="/"
          className={styles.logo}
          onClick={closeMenu}
          aria-label="Main page"
        >
          <img src={logo} alt="Pet Shop" />
        </Link>

        <nav
          id="main-navigation"
          className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}
        >
          <Link to="/" className={styles.navLink} onClick={closeMenu}>
            Main Page
          </Link>

          <Link to="/categories" className={styles.navLink} onClick={closeMenu}>
            Categories
          </Link>

          <Link to="/products" className={styles.navLink} onClick={closeMenu}>
            All products
          </Link>

          <Link to="/sales" className={styles.navLink} onClick={closeMenu}>
            All sales
          </Link>
        </nav>

        <Link
          to="/cart"
          className={styles.cartLink}
          onClick={closeMenu}
          aria-label="Shopping cart"
        >
          <img src={cart} alt="" className={styles.cartIcon} />

          {cartCount > 0 && (
            <span className={styles.cartCount}>
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </Link>

        <button
          type="button"
          className={`${styles.menuButton} ${
            isMenuOpen ? styles.menuButtonOpen : ""
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
        >
          <span className={styles.menuLine}></span>
          <span className={styles.menuLine}></span>
          <span className={styles.menuLine}></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
