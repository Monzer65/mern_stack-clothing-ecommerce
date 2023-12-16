import propTypes from "prop-types";
import styles from "./filterSort.module.css"; // Import your styles if needed
import CustomCategoryTree from "../categories/CategoryTree";
import TwoWayRangeInput from "../two-ways-range-input/TwoWaysRangeInput";
import { useFetchBrandsQuery } from "../../reducers/productsApiSlice";
import { TbCategory } from "react-icons/tb";
import { useEffect, useState } from "react";
import {
  AiOutlineClear,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineSortAscending,
  AiOutlineClose,
} from "react-icons/ai";
import { MdSort, MdOutlineCheck } from "react-icons/md";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
};

function FilterSort({
  category,
  minPrice,
  maxPrice,
  brand,
  discount,
  sortBy,
  sortOrder,
  handleFilterChange,
  setSearchParams,
  isFilterOpen,
  setIsFilterOpen,
}) {
  const { data } = useFetchBrandsQuery();
  const width = useWindowWidth();
  const [showFilters, setShowFilters] = useState({
    category: false,
    price: false,
    brand: false,
  });

  const toggleFilter = (filter) => {
    setShowFilters((prevShowFilters) => ({
      ...prevShowFilters,
      [filter]: !prevShowFilters[filter],
    }));
  };

  let isMobile = width < 768;

  const handleToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  useEffect(() => {
    if (isMobile) {
      setIsFilterOpen(false);
    } else {
      setIsFilterOpen(true);
    }

    console.log(isMobile, width);
  }, [isMobile, width, setIsFilterOpen]);

  return (
    <div className={styles.filterSortContainer}>
      <div className={styles.filterContainer}>
        <button
          className={styles.clearButtonDesktop}
          onClick={() => setSearchParams({})}
          aria-label='clear filters'
        >
          <AiOutlineClear /> Clear Filters
        </button>
        {isMobile && (
          <div className={styles.toggleFilterButton} onClick={handleToggle}>
            <TbCategory />
          </div>
        )}
        {isFilterOpen && (
          <div className={styles.filters}>
            <div className={styles.closeAndclearButtonsContainer}>
              <button
                className={styles.clearButtonMobile}
                onClick={() => {
                  setSearchParams({});
                  handleToggle();
                }}
                aria-label='clear filters'
              >
                <AiOutlineClear /> Clear Filters
              </button>
              <button
                className={styles.closeButtonCross + " " + styles.closeButton}
                onClick={handleToggle}
              >
                <AiOutlineClose />
              </button>
            </div>
            <div className={styles.filter}>
              <div
                className={styles.filterHeader}
                onClick={() => toggleFilter("category")}
              >
                {showFilters.category ? (
                  <p
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "4px",
                      padding: "4px 8px",
                    }}
                  >
                    Category
                  </p>
                ) : (
                  <p>Category</p>
                )}
                {showFilters.category ? (
                  <AiOutlineMinus style={{ color: "red" }} />
                ) : (
                  <AiOutlinePlus />
                )}
              </div>
              {showFilters.category && (
                <CustomCategoryTree
                  category={category}
                  handleFilterChange={handleFilterChange}
                />
              )}
            </div>
            <div className={styles.filter}>
              <div
                className={styles.filterHeader}
                onClick={() => toggleFilter("price")}
              >
                {showFilters.price ? (
                  <p
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "4px",
                      padding: "4px 8px",
                    }}
                  >
                    Price
                  </p>
                ) : (
                  <p>Price</p>
                )}
                {showFilters.price ? (
                  <AiOutlineMinus style={{ color: "red" }} />
                ) : (
                  <AiOutlinePlus />
                )}
              </div>
              {showFilters.price && (
                <TwoWayRangeInput
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  handleFilterChange={handleFilterChange}
                />
              )}
            </div>
            <div className={`${styles.filter} ${styles.brand}`}>
              <div
                className={styles.filterHeader}
                onClick={() => toggleFilter("brand")}
              >
                {showFilters.brand ? (
                  <p
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "4px",
                      padding: "4px 8px",
                    }}
                  >
                    Brand
                  </p>
                ) : (
                  <p>Brand</p>
                )}

                {showFilters.brand ? (
                  <AiOutlineMinus style={{ color: "red" }} />
                ) : (
                  <AiOutlinePlus />
                )}
              </div>
              {showFilters.brand && (
                <div>
                  <label htmlFor='brand' aria-label='brand'></label>
                  <select
                    id='brand'
                    name='brand'
                    value={brand || ""}
                    onChange={(e) => handleFilterChange(e)}
                  >
                    <option value=''>All</option>
                    {data?.map((brand) => (
                      <option key={brand.name} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <button className={styles.applyButton} onClick={handleToggle}>
              <MdOutlineCheck /> apply and close
            </button>
          </div>
        )}
      </div>

      {/* sort */}
      <div className={styles.sortContainer}>
        <div className={styles.sortGroup}>
          <label htmlFor='sort' aria-label='sort by'>
            <span className={styles.sortLabelDesktop}>Sort By:</span>{" "}
            <span className={styles.sortLabelMobile}>
              <MdSort /> sort
            </span>
          </label>

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
        </div>
        <div className={styles.sortGroup}>
          <label htmlFor='order' aria-label='sorting order'>
            <span className={styles.sortLabelDesktop}>Order:</span>
            <span className={styles.sortLabelMobile}>
              <AiOutlineSortAscending /> order
            </span>
          </label>
          <select
            id='order'
            name='sortOrder'
            value={sortOrder || "asc"}
            onChange={(e) => handleFilterChange(e)}
          >
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>{" "}
        </div>
      </div>
    </div>
  );
}

FilterSort.propTypes = {
  category: propTypes.string,
  minPrice: propTypes.number,
  maxPrice: propTypes.number,
  brand: propTypes.string,
  newArrival: propTypes.bool,
  discount: propTypes.bool,
  sortBy: propTypes.string,
  sortOrder: propTypes.string,
  handleFilterChange: propTypes.func,
  setSearchParams: propTypes.func,
  setIsFilterOpen: propTypes.func,
  isFilterOpen: propTypes.bool,
};

export default FilterSort;
