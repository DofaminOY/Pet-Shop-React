import Hero from "../../components/Hero";
import CategoriesSection from "../../components/CategoriesSection";

import styles from "./styles.module.css";

function HomePage() {
  return (
    <div className={styles.home}>
      <Hero />

      <CategoriesSection />
    </div>
  );
}

export default HomePage;