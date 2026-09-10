import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";

import Breadcrumbs from "../../components/Breadcrumbs";

import { addToCart } from "../../redux/cartSlice";

import styles from "./styles.module.css";

const BASE_URL = "http://localhost:3333";

function ProductPage() {
  const { id } = useParams();
  const location = useLocation();

  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);

  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  const descriptionRef = useRef(null);

  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isDescriptionOverflowing, setIsDescriptionOverflowing] =
    useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setStatus("loading");
        setError("");
        setQuantity(1);
        setIsDescriptionOpen(false);
        setIsDescriptionOverflowing(false);

        const response = await axios.get(`${BASE_URL}/products/${id}`);

        // Backend возвращает продукт в массиве
        const productData = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        if (!productData || productData.status === "ERR") {
          throw new Error("Product not found");
        }

        const normalizedProduct = {
          ...productData,
          image: productData.image?.startsWith("http")
            ? productData.image
            : `${BASE_URL}${productData.image}`,
        };

        setProduct(normalizedProduct);
        setSelectedImage(normalizedProduct.image);

        // Если backend передает id категории,
        // получаем название категории для breadcrumbs
        const categoryId =
          productData.categoryId ||
          productData.category_id ||
          productData.category?.id;

        if (categoryId) {
          try {
            const categoryResponse = await axios.get(
              `${BASE_URL}/categories/${categoryId}`,
            );

            setCategory(categoryResponse.data.category || null);
          } catch {
            setCategory(null);
          }
        } else {
          setCategory(null);
        }

        setStatus("succeeded");
      } catch (requestError) {
        setProduct(null);
        setCategory(null);
        setStatus("failed");

        setError(requestError.message || "Failed to load product");
      }
    }

    loadProduct();
  }, [id]);

  useEffect(() => {
    const checkDescriptionOverflow = () => {
      const descriptionElement = descriptionRef.current;

      if (!descriptionElement || isDescriptionOpen) {
        return;
      }

      // Проверяем, скрывает ли ограничение строк часть текста
      const hasHiddenText =
        descriptionElement.scrollHeight > descriptionElement.clientHeight + 1;

      setIsDescriptionOverflowing(hasHiddenText);
    };

    // Ждем, пока браузер рассчитает реальные размеры текста
    const frameId = requestAnimationFrame(checkDescriptionOverflow);

    // Повторно проверяем при изменении ширины окна
    window.addEventListener("resize", checkDescriptionOverflow);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", checkDescriptionOverflow);
    };
  }, [product?.description, isDescriptionOpen]);

  if (status === "loading") {
    return (
      <section className={`${styles.productPage} container`}>
        <p className={styles.message}>Loading product...</p>
      </section>
    );
  }

  if (status === "failed" || !product) {
    return (
      <section className={`${styles.productPage} container`}>
        <p className={styles.message}>Failed to load product: {error}</p>
      </section>
    );
  }

  const hasDiscount =
    product.discont_price !== null &&
    product.discont_price !== undefined &&
    Number(product.discont_price) < Number(product.price);

  const currentPrice = hasDiscount
    ? Number(product.discont_price)
    : Number(product.price);

  const oldPrice = Number(product.price);

  const discountPercent = hasDiscount
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  // Backend проекта содержит одно основное изображение товара.
  // Структура уже готова для массива изображений,
  // если позже добавим экспортированные изображения из Figma.
  const galleryImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.map((image) =>
          image.startsWith("http") ? image : `${BASE_URL}${image}`,
        )
      : [product.image];

  const handleDecrease = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const handleIncrease = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleAddToCart = () => {
    // Добавляем выбранное количество товара
    for (let index = 0; index < quantity; index += 1) {
      dispatch(addToCart(product));
    }
  };

  // Определяем страницу, с которой пользователь открыл товар
  const sourcePath = location.state?.from;

  const breadcrumbItems = [
    {
      label: "Main page",
      to: "/",
    },
  ];

  if (sourcePath === "/sales") {
    breadcrumbItems.push({
      label: "All sales",
      to: "/sales",
    });
  } else if (sourcePath === "/products") {
    breadcrumbItems.push({
      label: "All products",
      to: "/products",
    });
  } else {
    breadcrumbItems.push({
      label: "Categories",
      to: "/categories",
    });

    if (category) {
      breadcrumbItems.push({
        label: category.title,
        to: `/categories/${category.id}`,
      });
    }
  }

  breadcrumbItems.push({
    label: product.title,
  });

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <section className={`${styles.productPage} container`}>
        <div className={styles.productContent}>
          <div className={styles.gallery}>
            <div className={styles.thumbnails}>
              {galleryImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`${styles.thumbnailButton} ${
                    selectedImage === image ? styles.thumbnailActive : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className={styles.thumbnailImage}
                  />
                </button>
              ))}
            </div>

            <div className={styles.mainImageWrapper}>
              <img
                src={selectedImage}
                alt={product.title}
                className={styles.mainImage}
              />
            </div>
          </div>

          <div className={styles.productInfo}>
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.priceRow}>
              <div className={styles.prices}>
                <span className={styles.currentPrice}>${currentPrice}</span>

                {hasDiscount && (
                  <span className={styles.oldPrice}>${oldPrice}</span>
                )}
              </div>

              {hasDiscount && (
                <span className={styles.discount}>-{discountPercent}%</span>
              )}
            </div>

            <div className={styles.actions}>
              <div className={styles.quantity}>
                <button
                  type="button"
                  className={styles.quantityButton}
                  onClick={handleDecrease}
                  disabled={quantity === 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <div className={styles.quantityValue}>{quantity}</div>

                <button
                  type="button"
                  className={styles.quantityButton}
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className={styles.addButton}
                onClick={handleAddToCart}
              >
                Add to cart
              </button>
            </div>

            <div className={styles.description}>
              <h2 className={styles.descriptionTitle}>Description</h2>

              <p
                ref={descriptionRef}
                className={`${styles.descriptionText} ${
                  isDescriptionOpen ? styles.descriptionOpen : ""
                }`}
              >
                {product.description}
              </p>

              {isDescriptionOverflowing && (
                <button
                  type="button"
                  className={styles.readMore}
                  onClick={() =>
                    setIsDescriptionOpen((currentValue) => !currentValue)
                  }
                >
                  {isDescriptionOpen ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductPage;
