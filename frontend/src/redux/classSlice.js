import { createSlice } from "@reduxjs/toolkit";

const classroomSlice = createSlice({
  name: "classroom",
  initialState: {
    classrooms: null,
  },
  reducers: {
    setClassrooms: (state, action) => {
      console.log("✅ Inside setClassrooms reducer!");
      console.log("🚀 Payload received:", action.payload);
      state.classrooms = action.payload;
      console.log("✅ Updated classrooms:", state.classrooms);
    },
    deleteClassroom: (state, action) => {
      state.classrooms = state.classrooms.filter(
        (classroom) => classroom._id !== action.payload
      );
    },
   
  },
});

export const { setClassrooms, deleteClassroom } =
  classroomSlice.actions;
export default classroomSlice.reducer;
