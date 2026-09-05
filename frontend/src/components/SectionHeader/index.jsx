import { Link } from "react-router-dom";

import styles from "./styles.module.css";

function SectionHeader({ title, linkText, linkTo }) {
  return (
    <div className={styles.sectionHeader}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.navigation}>
        <Link to={linkTo} className={styles.link}>
          {linkText}
        </Link>
      </div>
    </div>
  );
}

export default SectionHeader;
