import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchNoQueryProducts: builder.query({
      query: () => ({
        url: "/products",
      }),
    }),

    fetchProducts: builder.query({
      query: (arg) => {
        const {
          page,
          limit,
          sortBy,
          sortOrder,
          search,
          minPrice,
          maxPrice,
          brand,
          discount,
          newArrival,
          category,
          ratings,
        } = arg;
        console.log("arg: ", arg);
        return {
          url: "/products",
          params: {
            page,
            limit,
            sortBy,
            sortOrder,
            search,
            minPrice,
            maxPrice,
            brand,
            discount,
            newArrival,
            category,
            ratings,
          },
        };
      },
    }),

    fetchProductDetail: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
      }),
    }),

    fetchBrands: builder.query({
      query: () => ({
        url: "/products/brands",
      }),
    }),
  }),
});

export const {
  useFetchNoQueryProductsQuery,
  useFetchProductsQuery,
  useFetchProductDetailQuery,
  useFetchBrandsQuery,
} = productApiSlice;
