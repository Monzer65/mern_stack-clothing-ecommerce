import { apiSlice } from "./apiSlice";

// Define your profile API slice
export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchUserProfile: builder.query({
      query: () => "/profile",
    }),

    updateUserProfile: builder.mutation({
      query: (updatedProfileData) => ({
        url: "/profile",
        method: "PUT",
        body: updatedProfileData,
      }),
    }),

    deleteUserProfile: builder.mutation({
      query: () => ({
        url: "/profile",
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useFetchUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
} = profileApiSlice;
