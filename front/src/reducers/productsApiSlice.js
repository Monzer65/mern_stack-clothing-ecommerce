import { apiSlice } from "./apiSlice";

// Define your profile API slice
export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: () => "/products",
    }),

    fetchProductDetail: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
      }),
    }),
  }),
});

export const { useFetchProductsQuery, useFetchProductDetailQuery } =
  productApiSlice;
