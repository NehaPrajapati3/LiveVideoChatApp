import { createSelector } from "reselect";

const selectClassroomState = (state) => state.classroom || { classrooms: [] };

export const selectClassrooms = createSelector(
  [selectClassroomState],
  (classroom) => classroom.classrooms || [] // <-- Fallback to empty array
);
const selectConflictNotificationState = (state) =>
  state.conflictNotification || { conflictNotifications: [] };

export const selectConflictNotifications = createSelector(
  [selectConflictNotificationState],
  (conflictNotification) => conflictNotification.conflictNotifications || [] // <-- Fallback to empty array
);
