import PropTypes from "prop-types";
export default function StarsRating({ rating }) {
  const renderStars = (rating) => {
    const stars = [];
    const totalStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5 ? true : false;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-star-${i}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          width='20'
          height='20'
          fill='#f5b301'
        >
          <path d='M12 2L9.91 8.49H3.38L8.53 12.79L6.91 19.14L12 15.62L17.09 19.14L15.47 12.79L20.62 8.49H14.09L12 2Z' />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key='half-star'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          width='20'
          height='20'
          fill='#f5b301'
        >
          <defs>
            <mask id='halfMask'>
              <rect x='0' y='0' width='12' height='20' fill='white' />
            </mask>
          </defs>
          <path
            d='M12 2L9.91 8.49H3.38L8.53 12.79L6.91 19.14L12 15.62V2Z'
            mask='url(#halfMask)'
          />
        </svg>
      );
    }

    const remainingStars = totalStars - Math.ceil(rating);

    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <svg
          key={`empty-star-${i}`}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          width='20'
          height='20'
          fill='#ddd'
        >
          <path d='M12 2L9.91 8.49H3.38L8.53 12.79L6.91 19.14L12 15.62L17.09 19.14L15.47 12.79L20.62 8.49H14.09L12 2Z' />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      {renderStars(rating)}
    </div>
  );
}

StarsRating.propTypes = {
  rating: PropTypes.number,
};
