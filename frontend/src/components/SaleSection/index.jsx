import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import SectionHeader from "../SectionHeader";
import ProductsGrid from "../ProductsGrid";

import { fetchSaleProducts } from "../../redux/thunks";

import styles from "./styles.module.css";

function SaleSection() {
  const dispatch = useDispatch();

  const saleProducts = useSelector((state) => state.products.saleProducts);

  const saleStatus = useSelector((state) => state.products.saleStatus);

  const saleError = useSelector((state) => state.products.saleError);

  useEffect(() => {
    if (saleStatus === "idle") {
      dispatch(fetchSaleProducts());
    }
  }, [dispatch, saleStatus]);

  return (
    <section className={`${styles.saleSection} container`}>
      <SectionHeader title="Sale" linkText="All sales" linkTo="/sales" />

      {saleStatus === "loading" && (
        <p className={styles.message}>Loading products...</p>
      )}

      {saleStatus === "failed" && (
        <p className={styles.message}>Failed to load products: {saleError}</p>
      )}

      {saleStatus === "succeeded" && <ProductsGrid products={saleProducts} />}
    </section>
  );
}

export default SaleSection;
