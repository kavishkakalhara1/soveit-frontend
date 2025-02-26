import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  readNotificationIds: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    markAsRead: (state, action) => {
      state.readNotificationIds.push(action.payload);
    },
    markAllAsRead: (state) => {
      state.readNotificationIds = state.notifications.map(
        (notification) => notification._id
      );
    },
  },
});

export const { setNotifications, markAsRead, markAllAsRead } =
  notificationSlice.actions;

export const selectUnreadCount = (state) =>
  (state.notification.notifications || []).filter(
    (notification) =>
      !state.notification?.readNotificationIds.includes(notification._id)
  ).length;

export const selectNotifications = (state) =>
  state.notification?.notifications || [];

export default notificationSlice.reducer;
