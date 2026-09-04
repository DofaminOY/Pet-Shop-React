import Hero from "../../components/Hero";

import styles from "./styles.module.css";

function HomePage() {
  return (
    <div className={styles.home}>
      <Hero />

      <section className={`${styles.categories} container`}>
        <h2 className={styles.title}>Categories</h2>

        {/* Здесь позже будут первые четыре категории с backend */}
      </section>

      <section className={`${styles.sales} container`}>
        <h2 className={styles.title}>Sale</h2>

        {/* Здесь позже будут четыре товара со скидкой */}
      </section>
    </div>
  );
}

export default HomePage;
