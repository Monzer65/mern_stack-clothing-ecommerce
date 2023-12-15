import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./twoWaysRangeInput.module.css";
import Slider from "react-slider";

const TwoWayRangeInput = ({ minPrice, maxPrice, handleFilterChange }) => {
  const [timer, setTimer] = useState(null);
  const [value, setValue] = useState([minPrice || 0, maxPrice || 9999]);

  const handleSliderChange = (values) => {
    setValue(values);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      handleFilterChange({
        target: {
          name: "priceRange",
          value: { minPrice: values[0], maxPrice: values[1] },
        },
      });
    }, 1000);

    setTimer(newTimer);
  };

  const formatValue = (value) => {
    if (value === null) {
      return "";
    }
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <div className={styles.rangeContainer}>
      <div className={styles.rangeGroup}>
        <Slider
          value={value}
          min={0}
          max={9999}
          onChange={handleSliderChange}
          ariaLabel={["Lower price", "Upper price"]}
          ariaValuetext={(state) => `price range ${state.valueNow}`}
          className={styles.slider}
          trackClassName='track' // module css not working on children of this classname
          thumbClassName={styles.thumb}
          thumbActiveClassName={styles.activeThumb}
          minDistance={50}
          snapDragDisabled
          pearling
          // render value of each handle inside the thumb
          // renderThumb={(props, state) => (
          //   <div className='range-value' {...props}>
          //     {state.valueNow}
          //   </div>
          // )}
        />
      </div>
      <div>
        min price: {formatValue(value[0])} - max price: {formatValue(value[1])}
      </div>
    </div>
  );
};

TwoWayRangeInput.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  handleFilterChange: PropTypes.func.isRequired,
};

export default TwoWayRangeInput;
