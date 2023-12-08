import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: localStorage.getItem("username")
    ? JSON.parse(localStorage.getItem("username"))
    : null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials(state, action) {
      const { username, accessToken } = action.payload;
      state.username = username;
      state.token = accessToken;
      localStorage.setItem("username", JSON.stringify(username));
    },

    logout(state) {
      state.username = null;
      state.token = null;
      localStorage.removeItem("username");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
