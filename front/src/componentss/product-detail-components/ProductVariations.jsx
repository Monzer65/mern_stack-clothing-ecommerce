import PropTypes from "prop-types";
import styles from "../../pages/product-detail/productDetail.module.css";
import { useState } from "react";

const ProductVariations = ({ variations }) => {
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
    ...new Set(variations?.map((variation) => variation.color)),
  ];

  return (
    <div className={styles.productVariations}>
      {uniqueColors ? (
        <h3>
          Color: <span>{selectedColor}</span>
        </h3>
      ) : (
        <h3>Color selection is not available for this product</h3>
      )}
      <div className={styles.colorsContainer}>
        {uniqueColors.map((color, index) => (
          <div
            key={index}
            onClick={() => handleColorSelect(color)}
            className={`${styles.outerColorIndicator} ${
              color === selectedColor
                ? styles.active
                : styles.outerColorIndicator
            }`}
          >
            <div
              style={{
                backgroundColor: color,
              }}
              className={styles.colorIndicator}
            ></div>
          </div>
        ))}
      </div>
      <div className={styles.sizesContainer}>
        {selectedColor && (
          <div>
            <h4>Sizes available for {selectedColor}:</h4>
            <ul>
              {variations
                ?.filter((variation) => variation.color === selectedColor)
                ?.map((variation, index) => (
                  <li
                    key={index}
                    onClick={() => handleSizeSelect(variation.size)}
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
  );
};

ProductVariations.propTypes = {
  variations: PropTypes.array,
};

export default ProductVariations;
