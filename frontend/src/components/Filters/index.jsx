import styles from "./styles.module.css";

function Filters({
  minPrice,
  maxPrice,
  discountedOnly,
  sortType,
  onMinPriceChange,
  onMaxPriceChange,
  onDiscountedChange,
  onSortChange,
  showDiscounted = true,
}) {
  return (
    <div className={styles.filters}>
      <div className={styles.priceFilter}>
        <span className={styles.label}>Price</span>

        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(event) => onMinPriceChange(event.target.value)}
          className={styles.priceInput}
          placeholder="from"
          aria-label="Minimum price"
        />

        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          className={styles.priceInput}
          placeholder="to"
          aria-label="Maximum price"
        />
      </div>

      {showDiscounted && (
        <label className={styles.discountFilter}>
          <span className={styles.label}>Discounted items</span>

          <input
            type="checkbox"
            checked={discountedOnly}
            onChange={(event) => onDiscountedChange(event.target.checked)}
            className={styles.checkbox}
          />
        </label>
      )}

      <div className={styles.sortFilter}>
        <label htmlFor="products-sort" className={styles.label}>
          Sorted
        </label>

        <select
          id="products-sort"
          value={sortType}
          onChange={(event) => onSortChange(event.target.value)}
          className={styles.select}
        >
          <option value="default">by default</option>
          <option value="newest">newest</option>
          <option value="price-high-low">price: high-low</option>
          <option value="price-low-high">price: low-high</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;
