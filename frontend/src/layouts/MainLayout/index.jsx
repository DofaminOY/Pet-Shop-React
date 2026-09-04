import { Outlet } from "react-router-dom";

import Header from "../../components/Header";

import styles from "./styles.module.css";

function MainLayout() {
  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
