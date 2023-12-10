import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchProductDetailQuery } from "../../reducers/productsApiSlice";
import LoadingGrid from "../../componentss/spinners/LoadingGrid";
import styles from "./productDetail.module.css";
import ProductCarousel from "../../componentss/product-carousel/ProductCarousel";
import { BiCartAdd } from "react-icons/bi";

const ProductDetail = () => {
  const { productId } = useParams();

  const { data, isLoading, isError, refetch } =
    useFetchProductDetailQuery(productId);

  const [productData, setProductData] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const uniqueColors = [
    ...new Set(productData.variations?.map((variation) => variation.color)),
  ];

  useEffect(() => {
    if (data && data.length > 0) {
      setProductData(data[0]);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const calculateDiscountedPrice = (price, discountPercentage) => {
    return price - (price * discountPercentage) / 100;
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return 0; // Return 0 if there are no reviews or reviews array is empty
    }

    const totalRatings = reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRatings / reviews.length;
    return averageRating;
  };

  // Function to render stars based on the average rating
  const renderStars = (averageRating) => {
    const totalStars = 5; // Total number of stars to display
    const fullStars = Math.floor(averageRating); // Number of full stars
    const remainder = averageRating - fullStars; // Fractional part of the rating

    const starIcons = [];

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      starIcons.push("★"); // Unicode character for a full star
    }

    // Half star if the remainder is between 0.25 and 0.75
    if (remainder >= 0.25 && remainder <= 0.75) {
      starIcons.push("☆"); // Unicode character for a half star
    }

    // Add empty stars to make a total of 5 stars
    while (starIcons.length < totalStars) {
      starIcons.push("☆"); // Unicode character for an empty star
    }

    return (
      <span className={styles.ratingStars}>
        {starIcons.map((icon, index) => (
          <span key={index}>{icon}</span>
        ))}
      </span>
    );
  };

  return (
    <div className={styles.productDetailContainer}>
      {isLoading ? (
        <LoadingGrid />
      ) : (
        <>
          {productData && (
            <>
              <div className={styles.productDetail}>
                <ProductCarousel productData={productData} />
                <div>
                  <h2>{productData.name}</h2>
                  <p>
                    {productData?.reviews?.length || null}{" "}
                    {productData?.reviews?.length > 0
                      ? productData?.reviews?.length > 1
                        ? "Reviews"
                        : "Review"
                      : ""}
                    {renderStars(calculateAverageRating(productData.reviews))}
                  </p>

                  <div className={styles.productInfo}>
                    <p className={styles.brand}>Brand: {productData.brand}</p>
                    {productData.discount && productData.discount.isActive ? (
                      <>
                        <p className={styles.price}>
                          <span className={styles.discountedPrice}>
                            $
                            {calculateDiscountedPrice(
                              productData.price,
                              productData.discount.discountPercentage
                            ).toFixed(2)}
                          </span>{" "}
                          <span className={styles.originalPrice}>
                            ${productData?.price?.toFixed(2)}
                          </span>
                          <span className={styles.saveAmount}>
                            Save $
                            {(
                              productData?.price -
                              calculateDiscountedPrice(
                                productData.price,
                                productData.discount.discountPercentage
                              )
                            ).toFixed(2)}
                          </span>
                          <span className={styles.discountText}>
                            Until {productData?.discount?.endDate.split("T")[0]}
                          </span>
                        </p>
                      </>
                    ) : (
                      <p className={styles.price}>
                        ${productData?.price?.toFixed(2)}
                      </p>
                    )}{" "}
                  </div>

                  <div className={styles.productVariations}>
                    <h3>Select Color:</h3>
                    <div className={styles.colorsContainer}>
                      {uniqueColors.map((color, index) => (
                        <button
                          key={index}
                          style={{
                            backgroundColor: color,
                            marginRight: "5px",
                            marginBottom: "5px",
                          }}
                          onClick={() => handleColorSelect(color)}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                    <div className={styles.sizesContainer}>
                      {selectedColor && (
                        <div>
                          <h4>Sizes available for {selectedColor}:</h4>
                          <ul>
                            {productData.variations
                              ?.filter(
                                (variation) => variation.color === selectedColor
                              )
                              ?.map((variation, index) => (
                                <li
                                  key={index}
                                  onClick={() =>
                                    handleSizeSelect(variation.size)
                                  }
                                >
                                  <input
                                    type='radio'
                                    name='size'
                                    value={variation.size}
                                    checked={selectedSize === variation.size}
                                  />
                                  <label className={styles.sizeLabel}>
                                    Size: {variation.size}{" "}
                                    {variation.quantity <= 5
                                      ? `- only (${variation.quantity}) left`
                                      : ""}
                                  </label>
                                </li>
                              ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {selectedSize && (
                      <div>
                        <h4>Selected Size: {selectedSize}</h4>
                      </div>
                    )}
                  </div>
                  <button className={styles.button}>
                    <BiCartAdd /> Add to Cart
                  </button>
                </div>
              </div>
              <p className={styles.description}>
                Description: {productData.longDescription}
              </p>

              {productData.reviews?.map((review, index) => (
                <div key={index} className={styles.reviewContainer}>
                  <div className={styles.reviewHeader}>
                    <p className={styles.reviewAuthor}>User: {review.author}</p>
                    <p className={styles.reviewDate}>
                      {review.createdAt.slice(0, 10)}
                    </p>
                  </div>
                  <p className={styles.reviewRating}>
                    Rating: {renderStars(review.rating)}
                  </p>
                  <p className={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </>
          )}
        </>
      )}
      {isError && <p>Error</p>}
    </div>
  );
};

export default ProductDetail;
