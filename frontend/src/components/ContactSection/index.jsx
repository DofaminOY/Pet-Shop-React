import instagramIcon from "../../assets/icons/ic-instagram.svg";
import whatsappIcon from "../../assets/icons/ic-whatsapp.svg";

import styles from "./styles.module.css";

function ContactSection() {
  // Точная ссылка на место в Google Maps
  const addressUrl = "https://maps.app.goo.gl/P3e35vc8APRhgCfM8";

  // Официальный embed-код, созданный Google Maps
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d151.76416370502307!2d13.403309832126109!3d52.511237763229786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e27dade5561%3A0x2454d91ffab308fa!2sWallstra%C3%9Fe%209-13%2C%2010179%20Berlin!5e0!3m2!1sru!2sde!4v1788646196336!5m2!1sru!2sde";

  return (
    <section className={styles.contactSection}>
      <div className="container">
        <h2 className={styles.title}>Contact</h2>

        <div className={styles.contactsGrid}>
          <div className={styles.contactCard}>
            <span className={styles.label}>Phone</span>

            <a href="tel:+493091588492" className={styles.value}>
              +49 30 915-88492
            </a>
          </div>

          <div className={styles.contactCard}>
            <span className={styles.label}>Socials</span>

            <div className={styles.socials}>
              <img
                src={instagramIcon}
                alt="Instagram"
                className={styles.socialIcon}
              />

              <img
                src={whatsappIcon}
                alt="WhatsApp"
                className={styles.socialIcon}
              />
            </div>
          </div>

          <div className={styles.contactCard}>
            <span className={styles.label}>Address</span>

            <a
              href={addressUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.value}
            >
              Wallstraße 9-13, 10179 Berlin,
              <br />
              Deutschland
            </a>
          </div>

          <div className={styles.contactCard}>
            <span className={styles.label}>Working Hours</span>

            <p className={styles.value}>24 hours a day</p>
          </div>
        </div>

        <div className={styles.mapWrapper}>
          <iframe
            className={styles.map}
            src={mapEmbedUrl}
            title="Wallstraße 9-13, 10179 Berlin"
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
