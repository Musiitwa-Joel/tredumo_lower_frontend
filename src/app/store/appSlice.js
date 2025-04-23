import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "@lodash";

const initialState = {
  visible: false,
  activeApp: { id: 0, title: "home", route: "home" },
  apps: [],
  taskBarApps: [],
  exists: false,
  isLocked: false,
};

export const appsSlice = createSlice({
  name: "apps",
  initialState,
  reducers: {
    viewApps: (state, action) => {
      return { ...state, visible: action.payload };
    },
    updateApps: (state, action) => {
      state.apps = action.payload;
    },
    addAppToTaskBar: (state, action) => {
      return { ...state, taskBarApps: action.payload };
    },
    updateActiveApp: (state, action) => {
      return { ...state, activeApp: action.payload };
    },
    filterApps: (state, action) => {
      return { ...state, apps: action.payload };
    },
    appExistsInTaskBar: (state, action) => {
      return { ...state, exists: action.payload };
    },
    setIsLocked: (state, action) => {
      state.isLocked = action.payload;
    },
    admissionsTabChanged: (state, action) => {
      return {
        ...state,
        apps: state.apps.map((app, index) =>
          index === 2
            ? {
                ...app,
                data: [
                  {
                    selectedTab: action.payload, // Update the selectedTab value as needed
                  },
                ],
              }
            : app
        ),
      };
    },
    saveStaffMembers: (state, action) => {
      return {
        ...state,
        apps: state.apps.map((app, index) =>
          index === 10
            ? {
                ...app,
                data: [
                  {
                    staff_members: action.payload.staff_members, // Update the staff members value as needed
                    roles: action.payload.user_roles,
                  },
                ],
              }
            : app
        ),
      };
    },
  },
});

export const {
  viewApps,
  updateApps,
  addAppToTaskBar,
  updateActiveApp,
  filterApps,
  appExistsInTaskBar,
  admissionsTabChanged,
  saveStaffMembers,
  setIsLocked,
} = appsSlice.actions;

export const appsVisible = ({ apps }) => apps;

export const selectIsLocked = (state) => state.apps.isLocked;
export const selectActiveApp = (state) => state.apps.activeApp;

// export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default appsSlice.reducer;
