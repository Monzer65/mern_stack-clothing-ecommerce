import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./productCarousel.module.css";

const ImageThumbnail = ({ image, index, isActive, onClick }) => (
  <img
    src={image}
    alt={`Thumbnail ${index + 1}`}
    className={`${styles.thumbnailImage} ${
      isActive ? styles.thumbnailActive : styles.thumbnail
    }`}
    onClick={onClick}
  />
);

ImageThumbnail.propTypes = {
  image: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const ProductCarousel = ({ productData }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { images } = productData;

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.mainImageContainer}>
        {images && images.length > 0 && (
          <img
            src={images[currentImageIndex]}
            alt={`Product Image ${currentImageIndex + 1}`}
            className={styles.mainImage}
          />
        )}
      </div>
      <div className={styles.thumbnailsContainer}>
        {images?.map((image, index) => (
          <ImageThumbnail
            key={index}
            image={image}
            index={index}
            isActive={index === currentImageIndex}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

ProductCarousel.propTypes = {
  productData: PropTypes.object.isRequired,
};

export default ProductCarousel;
