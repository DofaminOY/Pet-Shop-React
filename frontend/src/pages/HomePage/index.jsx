import Hero from "../../components/Hero";

import styles from "./styles.module.css";

function HomePage() {
  return (
    <div className={styles.home}>
      <Hero />
    </div>
  );
}

export default HomePage;
