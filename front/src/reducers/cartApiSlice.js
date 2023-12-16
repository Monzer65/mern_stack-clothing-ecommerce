import { apiSlice } from "./apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCart: builder.query({
      query: () => ({
        url: "/cart",
      }),
    }),

    postToCart: builder.mutation({
      query: (cartData) => ({
        url: "/cart",
        method: "POST",
        body: cartData,
      }),
    }),

    updateCartItemQuantity: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: "PUT",
        body: { quantity },
      }),
    }),

    removeCartItem: builder.mutation({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: "DELETE",
      }),
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchCartQuery,
  usePostToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApiSlice;
