import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";
// import _ from "@lodash";
// import admissions from "../theme-layouts/layout3/assets/admissions.png";

const initialState = {
  selectedRole: null,
  all_modules: [],
  selectedModules: "",
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    updateAllModules: (state, action) => {
      state.all_modules = action.payload;
    },
    updateSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    updateSelectedModules: (state, action) => {
      state.selectedModules = action.payload;
    },
  },
  selectors: {
    selectSelectedRole: (state) => state.selectedRole,
    selectAllModules: (state) => state.all_modules,
    selectSelectedModules: (state) => state.selectedModules,
  },
});

rootReducer.inject(rolesSlice);
const injectedSlice = rolesSlice.injectInto(rootReducer);

export const { updateSelectedRole, updateAllModules, updateSelectedModules } =
  rolesSlice.actions;

export const { selectSelectedRole, selectAllModules, selectSelectedModules } =
  injectedSlice.selectors;

// export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default rolesSlice.reducer;
