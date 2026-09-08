export function hasProductDiscount(product) {
  return (
    product.discont_price !== null &&
    product.discont_price !== undefined &&
    Number(product.discont_price) < Number(product.price)
  );
}

export function getProductPrice(product) {
  return hasProductDiscount(product)
    ? Number(product.discont_price)
    : Number(product.price);
}

export function getDiscountPercent(product) {
  if (!hasProductDiscount(product)) {
    return 0;
  }

  return Math.round(
    ((Number(product.price) - Number(product.discont_price)) /
      Number(product.price)) *
      100,
  );
}
