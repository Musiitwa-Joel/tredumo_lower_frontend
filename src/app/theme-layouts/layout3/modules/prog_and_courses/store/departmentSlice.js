import { createSlice } from "@reduxjs/toolkit";
import _ from "@lodash";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialFormState = {
  id: null,
  department_code: "",
  department_title: "",
  department_head: "",
  school_id: "",
  added_by: "",
  modified_by: "",
};

const initialState = {
  department: initialFormState,
  departments: [],
  requirements: {
    schools: [],
    staff_members: [],
  },
  deleteDialogOpen: false,
  selectedDepartment: null,
};

const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {
    updateDepartmentRequirements: (state, action) => {
      state.requirements = action.payload;
    },
    updateDepartments: (state, action) => {
      state.departments = action.payload;
    },
    updateDepartment: (state, action) => {
      // this is for the individual department details
      state.department = action.payload;
    },
    updateDeleteDialogOpen: (state, action) => {
      state.deleteDialogOpen = action.payload;
    },
    updateSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    resetDepartmentSlice: (state, action) => initialState,
  },
});

/**
 * Lazy load
 * */
rootReducer.inject(departmentSlice);

export const {
  updateDepartment,
  updateDepartments,
  updateDeleteDialogOpen,
  updateDepartmentRequirements,
  updateSelectedDepartment,
  resetDepartmentSlice,
} = departmentSlice.actions;

// export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default departmentSlice.reducer;
