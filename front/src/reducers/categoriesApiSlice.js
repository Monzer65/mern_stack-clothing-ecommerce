import { apiSlice } from "./apiSlice";

export const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchCategories: builder.query({
      query: () => "/categories",
    }),

    fetchCategoryDetail: builder.query({
      query: (id) => ({
        url: `/categories/${id}`,
      }),
    }),
  }),
});

export const { useFetchCategoriesQuery, useFetchCategoryDetailQuery } =
  categoryApiSlice;
