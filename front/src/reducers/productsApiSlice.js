/** @format */

import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      keepUnusedDataFor: 10,
    }),
  }),
});

export const { useGetProductsQuery } = productsApiSlice;
