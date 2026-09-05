import Hero from "../../components/Hero";
import CategoriesSection from "../../components/CategoriesSection";
import DiscountForm from "../../components/DiscountForm";

import styles from "./styles.module.css";

function HomePage() {
  return (
    <div className={styles.home}>
      <Hero />

      <CategoriesSection />

      <DiscountForm />
    </div>
  );
}

export default HomePage;
