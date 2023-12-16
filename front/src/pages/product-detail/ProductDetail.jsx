import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetchProductDetailQuery } from "../../reducers/productsApiSlice";
import LoadingGrid from "../../componentss/spinners/LoadingGrid";
import styles from "./productDetail.module.css";
import ProductCarousel from "../../componentss/product-carousel/ProductCarousel";
import { BiCartAdd } from "react-icons/bi";
import ProductInformation from "../../componentss/product-detail-components/ProductInformation";
import ProductVariations from "../../componentss/product-detail-components/ProductVariations";
import ProductReviews from "../../componentss/product-detail-components/ProductReviews";
import { useSelector, useDispatch } from "react-redux";
import { usePostToCartMutation } from "../../reducers/cartApiSlice";
import { setCart } from "../../reducers/cartSlice";

const ProductDetail = () => {
  const { productId } = useParams();

  const { data, isLoading, isError, refetch } =
    useFetchProductDetailQuery(productId);

  const [productData, setProductData] = useState([]);

  const [addToCart, { isSuccess }] = usePostToCartMutation();
  const token = useSelector((state) => state.auth.token);
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    if (!token) {
      setErrMsg("Please login first to add product to your cart");
      return;
    }

    try {
      const res = await addToCart({ productId, quantity: 1 }).unwrap();
      dispatch(setCart(res));
    } catch (err) {
      setErrMsg(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setProductData(data[0]);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { reviews } = productData;

  return (
    <div className={styles.productDetailContainer}>
      {isLoading ? (
        <LoadingGrid />
      ) : isError ? (
        <p>Error fetching product data</p>
      ) : (
        <>
          {productData && (
            <>
              <div className={styles.productDetail}>
                <ProductCarousel images={productData.images} />
                <div>
                  <ProductInformation
                    name={productData.name}
                    averageRating={productData.averageRating}
                    reviewsCount={productData.reviewsCount}
                    brand={productData.brand}
                    discount={productData.discount}
                    price={productData.price}
                  />
                  <ProductVariations variations={productData.variations} />
                  <button className={styles.button} onClick={handleAddToCart}>
                    <BiCartAdd /> Add to Cart
                  </button>
                  {errMsg && <p className={styles.errMessage}>{errMsg}</p>}
                  {isSuccess && (
                    <p className={styles.successMessage}>Added to cart</p>
                  )}
                </div>
              </div>

              <p className={styles.description}>
                <span className={styles.bold}>Description:</span>{" "}
                {productData.longDescription}
              </p>

              <ProductReviews reviews={reviews} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductDetail;
