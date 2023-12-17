import styles from "./cart.module.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useFetchCartQuery,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "../../reducers/cartApiSlice";
import { GrTrash, GrUpdate, GrClearOption } from "react-icons/gr";
import { TbLoader } from "react-icons/tb";
import { setCart } from "../../reducers/cartSlice";
import LoadingGrid from "../../componentss/spinners/LoadingGrid";
import { FaCartPlus } from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  const [cartData, setCartData] = useState({});
  const { data, isLoading, refetch } = useFetchCartQuery();
  const [updatedQuantity, setUpdatedQuantity] = useState({});
  const [updateQuantity] = useUpdateCartItemQuantityMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (data) {
      setCartData(data);
    }
    refetch();
  }, [data, refetch, cartData]);

  useEffect(() => {
    if (errMsg) {
      setTimeout(() => {
        setErrMsg("");
      }, 1500);
    }
    if (successMsg) {
      setTimeout(() => {
        setSuccessMsg("");
      }, 1500);
    }
  }, [errMsg, successMsg]);

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      setUpdateLoading(true);

      const res = await updateQuantity({
        productId,
        quantity: parseInt(quantity),
      }).unwrap();
      refetch();
      if (Object.keys(updatedQuantity).length === 0) {
        dispatch(setCart({ ...cartData, products: [] }));
      } else {
        dispatch(setCart(res));
      }

      console.log("Updated quantity:", quantity);
      setUpdateLoading(false);
      setSuccessMsg("Quantity updated successfully!!");
    } catch (error) {
      setUpdateLoading(false);
      setErrMsg("Failed to update quantity");
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setRemoveLoading(true);
      const response = await removeItem(productId).unwrap();
      setUpdatedQuantity((prevQuantity) => {
        const { [productId]: _, ...rest } = prevQuantity;
        console.log("_:", _);
        return rest;
      });
      refetch();
      if (Object.keys(updatedQuantity).length === 0) {
        dispatch(setCart({ ...cartData, products: [] }));
      } else {
        dispatch(setCart(response));
      }

      console.log("Removed item:", response);
      setRemoveLoading(false);
      setSuccessMsg("Item removed successfully!!");
    } catch (error) {
      setRemoveLoading(false);
      setErrMsg("Failed to remove item");
      console.error("Failed to remove item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      setClearLoading(true);
      await clearCart().unwrap();
      refetch();
      dispatch(setCart({ ...cartData, products: [] }));
      console.log("Response from clearCart API:", cartData);
      console.log("Cart cleared successfully!!");
      setClearLoading(false);
      setSuccessMsg("Cart cleared successfully!!");
    } catch (error) {
      setClearLoading(false);
      setErrMsg("Failed to clear cart");
      console.error("Failed to clear cart:", error);
    }
  };

  const calculateTotal = (items) => {
    let total = 0;

    if (items && items.length > 0) {
      items.forEach((item) => {
        total += item.productId.price * item?.quantity;
      });
    }

    return total.toFixed(2);
  };

  const totalAmount = calculateTotal(cartData?.products || []);

  if (isLoading) {
    return (
      <div>
        <LoadingGrid />
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <h1 className={styles.pageTitle}>Shopping Cart</h1>
      {errMsg && <p className={styles.errorMsg}>{errMsg}</p>}
      {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
      {cartData && cartData.products && cartData.products.length > 0 ? (
        <>
          <div className={styles.cartContainer}>
            <div className={styles.cartItems}>
              {cartData.products.map((item) => (
                <div key={item._id} className={styles.cartItem}>
                  <Link
                    to={`/products/${item.productId._id}`}
                    className={styles.productInfo}
                  >
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      className={styles.cartImage}
                    />
                    <div className={styles.productDetails}>
                      <p className={styles.productName}>
                        {item.productId.name}
                      </p>
                      <p className={styles.productPrice}>
                        <span className={styles.priceLabel}>price: </span>$
                        {item.productId.price}
                      </p>
                      <p className={styles.productQuantity}>
                        <span className={styles.quantityLabel}>
                          sub-total:{" "}
                        </span>
                        ${item.productId.price * item?.quantity}
                      </p>
                    </div>
                  </Link>
                  <div className={styles.quantityActions}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p className={styles.quantityLabel}>Quantity:</p>
                      <input
                        type='number'
                        value={
                          updatedQuantity[item.productId._id] || item.quantity
                        }
                        onChange={(e) => {
                          setUpdatedQuantity((prevQuantity) => ({
                            ...prevQuantity,
                            [item.productId._id]: e.target.value,
                          }));
                        }}
                      />
                    </div>

                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId._id,
                          parseInt(updatedQuantity[item.productId._id] || "0")
                        )
                      }
                      className={styles.updateButton}
                      disabled={updateLoading || removeLoading || clearLoading}
                    >
                      {updateLoading ? (
                        <GrUpdate className={styles.spin} />
                      ) : (
                        <>
                          <GrUpdate className={styles.update} /> Update
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.productId._id)}
                      className={styles.removeButton}
                      disabled={removeLoading || updateLoading || clearLoading}
                    >
                      {removeLoading ? (
                        <TbLoader className={styles.spin} />
                      ) : (
                        <>
                          <GrTrash /> Remove{" "}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to='/checkout'>
            <div className={styles.cartActions}>
              <button
                onClick={handleClearCart}
                className={styles.clearButton}
                disabled={clearLoading || updateLoading || removeLoading}
              >
                {clearLoading ? (
                  <TbLoader calssName={styles.spin} />
                ) : (
                  <>
                    <GrClearOption /> Clear Cart
                  </>
                )}
              </button>
            </div>
            <p className={styles.total}>Total: ${totalAmount}</p>
            <button disabled={true} className={styles.checkoutButton}>
              {updateLoading || removeLoading || clearLoading ? (
                <>
                  <TbLoader />
                </>
              ) : (
                <p>
                  <FaCartPlus /> Checkout
                </p>
              )}
            </button>
          </Link>
        </>
      ) : (
        <p className={styles.emptyCartMessage}>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
