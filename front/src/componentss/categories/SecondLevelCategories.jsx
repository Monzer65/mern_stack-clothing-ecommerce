import { useEffect, useState } from "react";
import { useFetchCategoriesQuery } from "../../reducers/categoriesApiSlice";
import styles from "./secondLevelCategories.module.css";

export default function SecondLevelCategories() {
  // const [categoriesData, setCategoriesData] = useState([]);
  const [secondLevelCategories, setSecondLevelCategories] = useState([]);

  const {
    data: categories,
    // isLoading,
    isError,
    refetch,
  } = useFetchCategoriesQuery();

  useEffect(() => {
    if (categories) {
      // Filter categories to display only second-level categories
      const secondLevel = categories.filter((category) => category.level === 1);

      setSecondLevelCategories(secondLevel);
    }
  }, [categories]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className={styles.categoriesWrapper}>
      {isError && <p>Error fetching categories</p>}
      <h2>Discover by category</h2>
      <div className={styles.categories}>
        {secondLevelCategories?.map((category) => (
          <div key={category._id} className={styles.categoryCard}>
            {category.image && (
              <img
                src={category.image}
                alt={category.name}
                className={styles.categoryImage}
              />
            )}
            <div className={styles.categoryDetails}>
              <p>{category.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
