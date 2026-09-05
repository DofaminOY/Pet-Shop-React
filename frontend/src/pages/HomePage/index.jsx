import Hero from "../../components/Hero";
import CategoriesSection from "../../components/CategoriesSection";
import DiscountForm from "../../components/DiscountForm";
import SaleSection from "../../components/SaleSection";

import styles from "./styles.module.css";

function HomePage() {
  return (
    <div className={styles.home}>
      <Hero />

      <CategoriesSection />

      <DiscountForm />

      <SaleSection />
    </div>
  );
}

export default HomePage;