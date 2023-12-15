import propTypes from "prop-types";
import styles from "./filterSort.module.css"; // Import your styles if needed
import CustomCategoryTree from "../categories/CategoryTree";
import TwoWayRangeInput from "../two-ways-range-input/TwoWaysRangeInput";

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
    <div className={styles.filterSortContainer}>
      <div className={styles.filterContainer}>
        <CustomCategoryTree
          category={category}
          handleFilterChange={handleFilterChange}
        />
        <div className={styles.filter}>
          <TwoWayRangeInput
            minPrice={minPrice}
            maxPrice={maxPrice}
            handleFilterChange={handleFilterChange}
          />
          {/* <label htmlFor='minPrice'>Min Price:</label>
          <input
            type='range'
            id='minPrice'
            name='minPrice'
            value={minPrice || ""}
            onChange={(e) => handleFilterChange(e)}
            onInput={(e) => {
              updateRangeValue(e, "minRangeValue");
              updateMaxPriceRange();
            }}
          />

          <span id='minRangeValue'>0</span>

          <label htmlFor='maxPrice'>Max Price:</label>
          <input
            type='range'
            id='maxPrice'
            name='maxPrice'
            value={maxPrice || ""}
            onChange={(e) => handleFilterChange(e)}
            onInput={(e) => updateRangeValue(e, "maxRangeValue")}
            min={minPrice}
          /> 
          <span id='maxRangeValue'>0</span>
          */}
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
      <div className={styles.sortContainer}>
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
