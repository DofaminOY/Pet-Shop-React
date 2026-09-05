import { Link } from "react-router-dom";

import styles from "./styles.module.css";

function Breadcrumbs({ items }) {
  return (
    <nav className={`${styles.breadcrumbs} container`} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div className={styles.item} key={`${item.label}-${index}`}>
          {index > 0 && <span className={styles.line}></span>}

          {item.to ? (
            <Link to={item.to} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            <span className={`${styles.link} ${styles.active}`}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
