import PropTypes from "prop-types";
import { useRef, useState } from "react";
import styles from "./searchInput.module.css";
import { FaSearch } from "react-icons/fa";

const SearchInput = ({ setSearchParams }) => {
  const formRef = useRef(null);
  const overlayRef = useRef(null);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      const updatedSearchParams = new URLSearchParams();
      updatedSearchParams.set("search", search);
      setSearchParams(updatedSearchParams);
      document.querySelectorAll("input").forEach((input) => {
        input.blur();
      });
      document.querySelectorAll("button").forEach((button) => {
        button.blur();
      });
    }
  };

  return (
    <>
      <form
        className={styles.searchForm}
        onSubmit={handleSearch}
        ref={formRef}
        onFocus={() => {
          overlayRef.current.style.display = "block";
        }}
        onBlur={() => {
          overlayRef.current.style.display = "none";
        }}
      >
        <label
          htmlFor='search'
          aria-label='Search products'
          className={styles.searchLabel}
        ></label>
        <input
          type='text'
          placeholder='Search products...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <button type='submit' className={styles.searchButton}>
          <FaSearch /> Search
        </button>
      </form>
      <div className={styles.searchOverlay} ref={overlayRef}></div>
    </>
  );
};

SearchInput.propTypes = {
  setSearchParams: PropTypes.func.isRequired,
};

export default SearchInput;
