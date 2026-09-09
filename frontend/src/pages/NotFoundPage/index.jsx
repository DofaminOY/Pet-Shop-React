import { Link } from "react-router-dom";

import notFoundDog from "../../assets/images/not-found-dog.png";

import styles from "./styles.module.css";

function NotFoundPage() {
  return (
    <section className={`${styles.notFound} container`}>
      <div className={styles.errorCode}>
        <span className={styles.number}>4</span>

        <img src={notFoundDog} alt="Dog" className={styles.dog} />

        <span className={styles.number}>4</span>
      </div>

      <h1 className={styles.title}>Page Not Found</h1>

      <p className={styles.text}>
        We're sorry, the page you requested could not be found.
        <br />
        Please go back to the homepage.
      </p>

      <Link to="/" className={styles.homeButton}>
        Go Home
      </Link>
    </section>
  );
}

export default NotFoundPage;
