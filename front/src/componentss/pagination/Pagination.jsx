import propTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from "./pagination.module.css";
function Pagination({ currentPage, totalPages, handlePageChange }) {
  const PAGE_RANGE = 2;

  // Define a helper function to generate the page buttons
  function generatePageButtons(currentPage, totalPages, handlePageChange) {
    // Create an empty array to store the page buttons
    const pageButtons = [];

    // Loop through the page range
    for (let i = currentPage - PAGE_RANGE; i <= currentPage + PAGE_RANGE; i++) {
      // Check if the page number is valid
      if (i > 0 && i <= totalPages) {
        pageButtons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? styles.active : ""}
          >
            {i}
          </button>
        );
      }
    }

    // Return the page buttons array
    return pageButtons;
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <FaChevronLeft />
      </button>

      {/* Render the first currentPage button conditionally */}
      {currentPage > PAGE_RANGE + 1 ? (
        <button
          onClick={() => handlePageChange(1)}
          aria-label='Go to first page'
        >
          1
        </button>
      ) : null}

      {/* Render the first ellipsis conditionally */}
      {currentPage > PAGE_RANGE + 2 ? (
        <span aria-label='Page range omitted'>...</span>
      ) : null}

      {/* Render the page buttons using the helper function */}
      {generatePageButtons(currentPage, totalPages, handlePageChange)}

      {/* Render the second ellipsis conditionally */}
      {currentPage < totalPages - PAGE_RANGE - 1 ? <span>...</span> : null}

      {/* Render the last page button conditionally */}
      {currentPage < totalPages - PAGE_RANGE ? (
        <button
          onClick={() => handlePageChange(totalPages)}
          aria-label={`Go to last page: ${totalPages}`}
        >
          {totalPages}
        </button>
      ) : null}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

Pagination.propTypes = {
  currentPage: propTypes.number.isRequired,
  totalPages: propTypes.number.isRequired,
  handlePageChange: propTypes.func.isRequired,
};

export default Pagination;
