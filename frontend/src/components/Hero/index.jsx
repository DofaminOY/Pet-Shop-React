import { Link } from "react-router-dom";

import heroImage from "../../assets/images/hero.jpg";

import styles from "./styles.module.css";

function Hero() {
  return (
    <section
      className={styles.hero}
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.title}>
            Amazing Discounts
            <br />
            on Pets Products!
          </h1>

          <Link to="/sales" className={styles.button}>
            Check out
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
