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
    setUsers: (state, action) => {
      console.log("✅ Inside setUsers reducer!");
      console.log("🚀 Payload received:", action.payload);
      state.users = action.payload;
      console.log("✅ Updated users:", state.users);
    },
  },
});

export const { login, logout, setAuthStatus, setUsers } = authSlice.actions;

export default authSlice.reducer;
