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
  }),
});

export const { useFetchUserProfileQuery, useUpdateUserProfileMutation } =
  profileApiSlice;
