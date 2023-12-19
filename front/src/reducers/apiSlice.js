import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../reducers/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://mern-shop-api-tau.vercel.app",
  credentials: "same-origin",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    console.log(result.error);
  }

  if (result?.error?.status === 403) {
    console.log("sending refresh token");
    const refreshResult = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      api.dispatch(setCredentials({ ...refreshResult.data }));
      console.log({ ...refreshResult.data });
      result = await baseQuery(args, api, extraOptions);
    } else {
      refreshResult.error.data.message = "your login expired";
      console.log(refreshResult.error.data.message);

      api.dispatch(logout());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Product", "Category", "Review", "Cart"],
  endpoints: (builder) => ({}),
});
