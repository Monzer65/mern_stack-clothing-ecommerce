import styles from "./cart.module.css";
import {
  useFetchCartQuery,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from "../../reducers/cartApiSlice";
import { useState, useEffect } from "react";

const Cart = () => {
  const { data: cartData, isLoading, refetch } = useFetchCartQuery();
  const [updatedQuantity, setUpdatedQuantity] = useState({});
  const [updateQuantity] = useUpdateCartItemQuantityMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  // useEffect(() => {
  //   if (cartData) {
  //     setUpdatedQuantity(
  //       cartData.products.reduce((acc, item) => {
  //         acc[item.productId._id] = item.quantity;
  //         return acc;
  //       }, {})
  //     );
  //   }
  // }, [cartData]);

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await updateQuantity({
        productId,
        quantity: parseInt(quantity),
      }).unwrap();

      // No need to update local state here as it's already updated by input change
      refetch();
      console.log("Updated quantity:", quantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await removeItem(productId).unwrap();
      setUpdatedQuantity((prevQuantity) => {
        const { [productId]: _, ...rest } = prevQuantity;
        return rest;
      });
      refetch();
      console.log("Removed item:", response);
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      setUpdatedQuantity({});
      refetch();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const calculateTotal = (cartData) => {
    let total = 0;

    if (cartData && cartData.products && cartData.products.length > 0) {
      cartData.products.forEach((item) => {
        total += item.productId.price * item.quantity;
      });
    }

    return total.toFixed(2);
  };

  const totalAmount = calculateTotal(cartData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.cartPage}>
      <h1 className={styles.pageTitle}>Shopping Cart</h1>
      {cartData && cartData.products && cartData.products.length > 0 ? (
        <div className={styles.cartContainer}>
          <table className={styles.cartTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Sub total</th>
              </tr>
            </thead>
            <tbody>
              {cartData.products.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name}
                      className={styles.cartImage}
                    />
                    {item.productId.name}
                  </td>
                  <td>${item.productId.price}</td>
                  <td>
                    <input
                      type='number'
                      value={updatedQuantity[item.productId._id] || ""}
                      onChange={(e) => {
                        setUpdatedQuantity((prevQuantity) => ({
                          ...prevQuantity,
                          [item.productId._id]: e.target.value,
                        }));
                      }}
                    />
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId._id,
                          parseInt(updatedQuantity[item.productId._id] || "0")
                        )
                      }
                    >
                      Update
                    </button>
                  </td>
                  <td>${item.productId.price * item.quantity}</td>
                  <td>
                    <button
                      onClick={() => handleRemoveItem(item.productId._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <button onClick={handleClearCart}>Clear Cart</button>
          </table>
          <p className={styles.total}>Total: ${totalAmount}</p>
        </div>
      ) : (
        <p className={styles.emptyCartMessage}>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
