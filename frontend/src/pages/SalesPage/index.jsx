import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumbs from "../../components/Breadcrumbs";
import Filters from "../../components/Filters";
import ProductsGrid from "../../components/ProductsGrid";

import { fetchProducts } from "../../redux/thunks";

import { getProductPrice, hasProductDiscount } from "../../utils/productPrice";

import styles from "./styles.module.css";

function SalesPage() {
  const dispatch = useDispatch();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortType, setSortType] = useState("default");

  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  // Загружаем товары, если они еще не были получены
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Оставляем только товары со скидкой,
  // затем применяем фильтрацию по цене и сортировку
  const discountedProducts = useMemo(() => {
    let result = products.filter((product) => hasProductDiscount(product));

    if (minPrice !== "") {
      result = result.filter(
        (product) => getProductPrice(product) >= Number(minPrice),
      );
    }

    if (maxPrice !== "") {
      result = result.filter(
        (product) => getProductPrice(product) <= Number(maxPrice),
      );
    }

    if (sortType === "newest") {
      result.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }

        return Number(b.id) - Number(a.id);
      });
    }

    if (sortType === "price-high-low") {
      result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    }

    if (sortType === "price-low-high") {
      result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    }

    return result;
  }, [products, minPrice, maxPrice, sortType]);

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: "Main page",
            to: "/",
          },
          {
            label: "All sales",
          },
        ]}
      />

      <section className={`${styles.salesPage} container`}>
        <h1 className={styles.title}>Discounted items</h1>

        {status === "loading" && (
          <p className={styles.message}>Loading products...</p>
        )}

        {status === "failed" && (
          <p className={styles.message}>Failed to load products: {error}</p>
        )}

        {status === "succeeded" && (
          <>
            <Filters
              minPrice={minPrice}
              maxPrice={maxPrice}
              discountedOnly={false}
              sortType={sortType}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onDiscountedChange={() => {}}
              onSortChange={setSortType}
              showDiscounted={false}
            />

            {discountedProducts.length > 0 ? (
              <ProductsGrid products={discountedProducts} />
            ) : (
              <p className={styles.message}>No discounted products found.</p>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default SalesPage;
