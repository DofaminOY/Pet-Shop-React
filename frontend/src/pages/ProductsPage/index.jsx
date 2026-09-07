import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Breadcrumbs from "../../components/Breadcrumbs";
import Filters from "../../components/Filters";
import ProductsGrid from "../../components/ProductsGrid";

import { fetchProducts } from "../../redux/thunks";

import styles from "./styles.module.css";

// Возвращаем актуальную цену товара с учетом скидки
function getProductPrice(product) {
  const hasDiscount =
    product.discont_price !== null &&
    product.discont_price !== undefined &&
    Number(product.discont_price) < Number(product.price);

  return hasDiscount ? Number(product.discont_price) : Number(product.price);
}

function ProductsPage() {
  const dispatch = useDispatch();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [discountedOnly, setDiscountedOnly] = useState(false);
  const [sortType, setSortType] = useState("default");

  const products = useSelector((state) => state.products.products);

  const status = useSelector((state) => state.products.status);

  const error = useSelector((state) => state.products.error);

  // Загружаем все товары только если они еще не были получены
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Фильтруем и сортируем копию массива, не изменяя Redux
  const filteredProducts = useMemo(() => {
    let result = [...products];

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

    if (discountedOnly) {
      result = result.filter(
        (product) =>
          product.discont_price !== null &&
          product.discont_price !== undefined &&
          Number(product.discont_price) < Number(product.price),
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
  }, [products, minPrice, maxPrice, discountedOnly, sortType]);

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: "Main page",
            to: "/",
          },
          {
            label: "All products",
          },
        ]}
      />

      <section className={`${styles.productsPage} container`}>
        <h1 className={styles.title}>All products</h1>

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
              discountedOnly={discountedOnly}
              sortType={sortType}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onDiscountedChange={setDiscountedOnly}
              onSortChange={setSortType}
            />

            {filteredProducts.length > 0 ? (
              <ProductsGrid products={filteredProducts} />
            ) : (
              <p className={styles.message}>No products found.</p>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default ProductsPage;
