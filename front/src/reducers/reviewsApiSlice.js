import { apiSlice } from "./apiSlice";

export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchReviews: builder.query({
      query: (id) => ({
        url: `/reviews/${id}`,
      }),
    }),

    postReview: builder.mutation({
      query: ({ id, comment, rating }) => ({
        url: `/reviews/${id}`,
        method: "POST",
        body: {
          comment,
          rating,
        },
      }),
    }),

    updateReview: builder.mutation({
      query: ({ id, comment, rating }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body: {
          comment,
          rating,
        },
      }),
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchReviewsQuery,
  usePostReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApiSlice;
