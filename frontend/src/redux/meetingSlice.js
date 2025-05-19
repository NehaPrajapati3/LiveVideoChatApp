import { createSlice } from "@reduxjs/toolkit";

const meetingSlice = createSlice({
  name: "meeting",
  initialState: {
    meetings: null,
  },
  reducers: {
    setMeetings: (state, action) => {
      console.log("✅ Inside setMeetings reducer!");
      console.log("🚀 Payload received:", action.payload);
      state.meetings = action.payload;
      console.log("✅ Updated meetings:", state.meetings);
    },
    deleteMeeting: (state, action) => {
      state.meetings = state.meetings.filter(
        (meeting) => meeting._id !== action.payload
      );
    },
   
  },
});

export const { setMeetings, deleteMeeting } =
  meetingSlice.actions;
export default meetingSlice.reducer;
