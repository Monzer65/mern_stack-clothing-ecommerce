import { useEffect, useMemo, useState } from "react";
import { useFetchProductsQuery } from "../../reducers/productsApiSlice";
import { Link } from "react-router-dom";
import styles from "./productsList.module.css";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../../componentss/search/SearchInput";
import Pagination from "../../componentss/pagination/Pagination";
import FilterSort from "../../componentss/filter-sort/FilterSort";
import StarsRating from "../../componentss/starsRating/StarsRating";
import LoadingSpinner from "../../componentss/spinners/LoadingGrid";

export default function ProductsList() {
  // const [minPriceRange, setMinPriceRange] = useState(0);
  // const [maxPriceRange, setMaxPriceRange] = useState(1000);
  // const [categories, setCategories] = useState("");
  // const [brands, setBrands] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  let filterParams = useMemo(() => {
    const params = new URLSearchParams();
    const filterValues = [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "search",
      "category",
      "minPrice",
      "maxPrice",
      "ratings",
      "brand",
      "newArrival",
      "discount",
    ];

    filterValues.forEach((filter) => {
      const value = searchParams.get(filter);
      if (value) {
        params.set(filter, value);
      } else {
        params.delete(filter);
      }
    });

    return params;
  }, [searchParams]);

  const handleFilterChange = (event) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    let newFilterParams = new URLSearchParams(filterParams);

    if (name === "search") {
      newFilterParams = new URLSearchParams();
      newFilterParams.set("page", "1");
    } else {
      if (newValue) {
        newFilterParams.set(name, newValue);

        if (name === "sortBy") {
          const defaultSortOrder = value === "price" ? "asc" : "desc";
          newFilterParams.set("sortOrder", defaultSortOrder);
        }
      } else {
        newFilterParams.delete(name);
      }
      newFilterParams.set("page", "1");
    }

    setSearchParams(newFilterParams, { replace: true });
  };

  const page = parseInt(filterParams.get("page")) || 1;
  const limit = parseInt(filterParams.get("limit")) || 2;
  const sortBy = filterParams.get("sortBy");
  const sortOrder = filterParams.get("sortOrder");
  const search = filterParams.get("search");
  const category = filterParams.get("category");
  const minPrice = filterParams.get("minPrice");
  const maxPrice = filterParams.get("maxPrice");
  const ratings = filterParams.get("ratings");
  const brand = filterParams.get("brand");
  const newArrival = filterParams.get("newArrival");
  const discount = filterParams.get("discount");

  const [productsData, setProductsData] = useState([]);
  const queryParams = {
    ...(page && { page }),
    ...(limit && { limit }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
    ...(search && { search }),
    ...(category && { category }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(ratings && { ratings }),
    ...(brand && { brand }),
    ...(newArrival && { newArrival }),
    ...(discount && { discount }),
  };

  const { data, isLoading, isError, error, refetch } =
    useFetchProductsQuery(queryParams);

  useEffect(() => {
    if (data) {
      setProductsData(data);
      // setMinPriceRange(data.minMaxPrice[0]);
      // setMaxPriceRange(data.maxPrice);
      // setCategories(data.category?.name || "");
      // setBrands(data.brand?.name || "");
    }
    refetch();
  }, [data, refetch]);

  const handlePageChange = (newPage) => {
    filterParams.set("page", newPage);
    setSearchParams(filterParams, { replace: true });
  };

  const clearFilters = () => {
    const filterParams = new URLSearchParams();
    setSearchParams(filterParams, { replace: true });
  };

  if (isError) {
    console.error(error);
    return (
      <div>Error: {error?.data?.message || "An unknown error occurred"}</div>
    );
  }

  return (
    <div className={styles.productsListContainer}>
      <SearchInput setSearchParams={setSearchParams} />
      <button onClick={clearFilters}>Clear Filters</button>
      <FilterSort
        handleFilterChange={handleFilterChange}
        category={category}
        minPrice={minPrice}
        maxPrice={maxPrice}
        ratings={ratings}
        brand={brand}
        newArrival={newArrival}
        discount={discount}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      {/* result data*/}
      <h1>Products</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.productsList}>
          {productsData?.totalProducts === 0 && (
            <p>No products found for the selected filters.</p>
          )}
          {productsData?.products?.map((product) => (
            <Link
              to={`/products/${product._id}`}
              key={product._id}
              className={styles.productItem}
            >
              <img src={product.images[0]} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.shortDescription}</p>
              <span>${product.price}</span>
              <StarsRating rating={product.averageRating} />
              <p className={styles.discount}>
                {" "}
                {product.discount.discountPercentage}%
              </p>
            </Link>
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        totalPages={data?.totalPages}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}
