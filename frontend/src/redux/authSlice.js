import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
    setAuthStatus: (state, action) => {
      state.status = action.payload.status;
      state.userData = action.payload.userData || null;
    },
  },
});

export const { login, logout, setAuthStatus } = authSlice.actions;

export default authSlice.reducer;
