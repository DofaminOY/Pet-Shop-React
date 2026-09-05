import { Outlet } from "react-router-dom";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

import styles from "./styles.module.css";

function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;
