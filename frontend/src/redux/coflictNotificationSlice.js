import { createSlice } from "@reduxjs/toolkit";

const conflictNotificationSlice = createSlice({
  name: "conflictNotification",
  initialState: {
    conflictNotifications: null,
  },
  reducers: {
    setConflictNotifications: (state, action) => {
      console.log("✅ Inside setConflictNotifications reducer!");
      console.log("🚀 Payload received:", action.payload);
      state.conflictNotifications = action.payload;
      console.log("✅ Updated conflictNotifications:", state.conflictNotifications);
    },
    deleteConflictNotification: (state, action) => {
      state.conflictNotifications = state.conflictNotifications.filter(
        (conflictNotification) => conflictNotification._id !== action.payload
      );
    },
   
  },
});

export const { setConflictNotifications, deleteConflictNotification } =
  conflictNotificationSlice.actions;
export default conflictNotificationSlice.reducer;
