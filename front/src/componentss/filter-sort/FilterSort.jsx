import propTypes from "prop-types";
import styles from "./filterSort.module.css"; // Import your styles if needed

function FilterSort({
  category,
  minPrice,
  maxPrice,
  ratings,
  brand,
  newArrival,
  discount,
  sortBy,
  sortOrder,
  handleFilterChange,
}) {
  return (
    <div className={styles.filterContainer}>
      {/* filter */}
      <div className={styles.filterContainer}>
        <div className={styles.filter}>
          <label htmlFor='category'>Category:</label>
          <select
            id='category'
            name='category'
            value={category || ""}
            onChange={(e) => handleFilterChange(e)}
          >
            <option value=''>All</option>
            <option value='shoes'>shoes</option>
            <option value='clothing'>clothing</option>
          </select>
        </div>

        <div className={styles.filter}>
          <label htmlFor='minPrice'>Min Price:</label>
          <input
            type='number'
            id='minPrice'
            name='minPrice'
            value={minPrice || ""}
            onChange={(e) => handleFilterChange(e)}
          />
          <label htmlFor='maxPrice'>Max Price:</label>
          <input
            type='number'
            id='maxPrice'
            name='maxPrice'
            value={maxPrice || ""}
            onChange={(e) => handleFilterChange(e)}
          />
        </div>

        <div className={styles.filter}>
          <label htmlFor='ratings'>Ratings:</label>
          <input
            type='number'
            id='ratings'
            name='ratings'
            value={ratings || ""}
            onChange={(e) => handleFilterChange(e)}
          />
        </div>

        <div className={styles.filter}>
          <label htmlFor='brand'>Brand:</label>
          <input
            type='text'
            id='brand'
            name='brand'
            value={brand || ""}
            onChange={(e) => handleFilterChange(e)}
          />
        </div>

        <div className={styles.filter}>
          <label htmlFor='newArrival'>New Arrival:</label>
          <input
            type='checkbox'
            id='newArrival'
            name='newArrival'
            checked={newArrival}
            onChange={(e) => handleFilterChange(e)}
          />
        </div>

        <div className={styles.filter}>
          <label htmlFor='discount'>Discount:</label>
          <input
            type='checkbox'
            id='discount'
            name='discount'
            checked={discount}
            onChange={(e) => handleFilterChange(e)}
          />
        </div>
      </div>
      {/* sort */}
      <div className={styles.sort}>
        <label htmlFor='sort'>Sort By:</label>
        <select
          id='sort'
          name='sortBy'
          value={sortBy || ""}
          onChange={(e) => handleFilterChange(e)}
        >
          <option value=''>None</option>
          <option value='price'>Price</option>
          <option value='averageRating'>Ratings</option>
          {discount && (
            <option value='discount.discountPercentage'>discount</option>
          )}
        </select>

        <label htmlFor='order'>Order:</label>
        <select
          id='order'
          name='sortOrder'
          value={sortOrder || "asc"}
          onChange={(e) => handleFilterChange(e)}
        >
          <option value='asc'>Ascending</option>
          <option value='desc'>Descending</option>
        </select>
      </div>
    </div>
  );
}

FilterSort.propTypes = {
  category: propTypes.string,
  minPrice: propTypes.number,
  maxPrice: propTypes.number,
  ratings: propTypes.number,
  brand: propTypes.string,
  newArrival: propTypes.bool,
  discount: propTypes.bool,
  sortBy: propTypes.string,
  sortOrder: propTypes.string,
  handleFilterChange: propTypes.func,
};

export default FilterSort;
