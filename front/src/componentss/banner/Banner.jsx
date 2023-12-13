import PropTypes from "prop-types";
import styles from "./banner.module.css";
import { Link } from "react-router-dom";
const ImageBanner = ({ imageUrl, altText, linkUrl, bannerText }) => {
  const bannerStyle = {
    width: "100%",
    height: "200px",
    overflow: "hidden",
    position: "relative",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };

  const textStyle = {
    position: "absolute",
    zIndex: "2",
    textAlign: "center",
    color: "white",
    top: "50%",
    left: "50%",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    textStyle: "bold",
    transform: "translate(-50%, -50%)",
    fontSize: "clamp(1rem, 3vw, 2rem)",
  };

  const linkStyle = {
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
    zIndex: "3",
  };

  return (
    <div style={bannerStyle} className={styles.banner}>
      <img src={imageUrl} alt={altText} style={imageStyle} />
      <div style={textStyle}>
        <h2>{bannerText}</h2>
      </div>
      <Link to={linkUrl} style={linkStyle}></Link>
    </div>
  );
};

ImageBanner.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
  linkUrl: PropTypes.string.isRequired,
  bannerText: PropTypes.string.isRequired,
};

export default ImageBanner;
