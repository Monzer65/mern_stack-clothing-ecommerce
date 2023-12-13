import PropTypes from "prop-types";
import { useRef, useState } from "react";
import styles from "./searchInput.module.css";

const SearchInput = ({ setSearchParams }) => {
  const inputRef = useRef(null);
  const overlayRef = useRef(null);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const updatedSearchParams = new URLSearchParams();
    updatedSearchParams.set("search", search);
    setSearchParams(updatedSearchParams);
    inputRef.current.blur();
    overlayRef.current.style.display = "none";
  };

  return (
    <>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        <input
          type='text'
          placeholder='Search products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
          ref={inputRef}
          onFocus={() => {
            overlayRef.current.style.display = "block";
          }}
          onBlur={() => {
            overlayRef.current.style.display = "none";
          }}
        />

        <button type='submit' className={styles.searchButton}>
          Search
        </button>
      </form>
      <div className={styles.searchOverlay} ref={overlayRef}></div>
    </>
  );
};

SearchInput.propTypes = {
  setSearchParams: PropTypes.func.isRequired,
  search: PropTypes.string,
  onSubmit: PropTypes.func, // onSubmit function for handling search on submit
};

export default SearchInput;
