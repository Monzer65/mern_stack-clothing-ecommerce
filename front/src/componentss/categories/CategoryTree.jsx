import styles from "./categoryTree.module.css";
import { useState, useEffect } from "react";
import { useFetchCategoriesQuery } from "../../reducers/categoriesApiSlice";
import PropTypes from "prop-types";
import LoadingSpinner from "../spinners/LoadingGrid";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function CustomCategoryTree({ category, handleFilterChange }) {
  const { data, isLoading } = useFetchCategoriesQuery();
  const [openCategories, setOpenCategories] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    if (category) {
      const selectedCategory = data?.find((cat) => cat.slug === category);

      const getPathToCategory = (selectedCategory) => {
        const pathToCategory = [];
        let currentCategory = selectedCategory;
        while (currentCategory && currentCategory.parentCategory) {
          pathToCategory.unshift(currentCategory.parentCategory);
          currentCategory = data?.find(
            (cat) => cat._id === currentCategory.parentCategory
          );
        }
        return pathToCategory;
      };

      if (selectedCategory) {
        setSelectedItemId(selectedCategory._id);
        const pathToCategory = getPathToCategory(selectedCategory);
        setOpenCategories([...pathToCategory, selectedCategory._id]);
      }
    }
  }, [category, data]);

  const toggleCategory = (categoryId) => {
    setSelectedItemId(categoryId);
    setOpenCategories((prevOpenCategories) =>
      prevOpenCategories.includes(categoryId)
        ? prevOpenCategories.filter((id) => id !== categoryId)
        : [...prevOpenCategories, categoryId]
    );
  };

  const clearCategoryParams = () => {
    handleFilterChange({
      target: { name: "category", value: "" }, // Clear category value
    });
  };

  const renderCategories = (categories, level = 0) =>
    categories.map((cat) => {
      const hasChildren = cat.children && cat.children.length > 0;
      const isOpen = openCategories.includes(cat._id);
      const isSelected = selectedItemId === cat._id;

      const toggleCategoryClick = () => toggleCategory(cat._id);

      const handleCategoryClick = () =>
        handleFilterChange({
          target: { name: "category", value: cat.slug },
          className: styles.selected,
        });

      const handleClick = () => handleCategoryClick();

      return (
        <div key={cat._id} className={styles.dropdownItem}>
          <div className={styles.dropdownItemContainer}>
            <span
              onClick={handleClick}
              className={`${styles.dropdownItemText} ${
                isSelected ? styles.selected : ""
              }`}
              style={{ paddingLeft: `${20 * level}px` }}
            >
              {cat.name}
            </span>

            {hasChildren && (
              <span
                onClick={toggleCategoryClick}
                className={styles.dropdownItemIcon}
                style={{
                  visibility: cat.children.length > 0 ? "visible" : "hidden",
                }}
              >
                {isOpen ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            )}
            {!hasChildren && (
              <span
                style={{
                  paddingLeft: "10px",
                  visibility: "hidden",
                }}
              />
            )}
          </div>
          {isOpen && cat.children && (
            <ul className={styles.dropdownList}>
              {renderCategories(cat.children, level + 1)}
            </ul>
          )}
        </div>
      );
    });

  const topLevelCategories = data?.filter((cat) => cat.level === 1) || [];
  const hierarchicalCategories = topLevelCategories.map((cat) => ({
    ...cat,
    children:
      data?.filter((subCategory) => subCategory.parentCategory === cat._id) ||
      [],
  }));

  return (
    <div className={styles.deopdownWrapper}>
      <label
        htmlFor='category'
        aria-label='Category'
        className={styles.deopdownTitle}
      ></label>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ul className={styles.dropdownList}>
          <li className={styles.dropdownItem}>
            <div className={styles.dropdownItemContainer}>
              <span
                onClick={clearCategoryParams}
                className={styles.dropdownItemText}
                style={{ paddingLeft: "0" }}
              >
                Select All
              </span>
            </div>
          </li>
          <li className={styles.dropdownItem}>
            {renderCategories(hierarchicalCategories)}
          </li>
        </ul>
      )}
    </div>
  );
}

CustomCategoryTree.propTypes = {
  category: PropTypes.string,
  handleFilterChange: PropTypes.func,
};
