import { createSlice } from "@reduxjs/toolkit";

const meetingSlice = createSlice({
  name: "meeting",
  initialState: {
    meetings: null,
    userMeetings: null,
  },
  reducers: {
    setMeetings: (state, action) => {
      console.log("✅ Inside setMeetings reducer!");
      console.log("🚀 Payload received:", action.payload);
      state.meetings = action.payload;
      console.log("✅ Updated meetings:", state.meetings);
    },
    setUserMeetings: (state, action) => {
      console.log("✅ Inside setUserMeetings reducer!");
      console.log("🎓 Payload received:", action.payload);
      state.userMeetings = action.payload;
      console.log("✅ Updated userMeetings:", state.userMeetings);
    },
    deleteMeeting: (state, action) => {
      state.meetings = state.meetings.filter(
        (meeting) => meeting._id !== action.payload
      );
      state.userMeetings = state.userMeetings?.filter(
        (meeting) => meeting._id !== action.payload
      );
    },
  },
});

export const { setMeetings,setUserMeetings, deleteMeeting } =
  meetingSlice.actions;
export default meetingSlice.reducer;
