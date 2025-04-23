import { createSlice } from "@reduxjs/toolkit";
import _ from "@lodash";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialFormState = {
  id: null,
  college_code: "",
  college_title: "",
};

const initialState = {
  school: initialFormState,
  schools: [],
  requirements: {
    colleges: [],
    staff_members: [],
  },
  deleteDialogOpen: false,
  selectedSchool: null,
};

const schoolSlice = createSlice({
  name: "school",
  initialState,
  reducers: {
    updateSchoolRequirements: (state, action) => {
      state.requirements = action.payload;
    },
    updateSchools: (state, action) => {
      state.schools = action.payload;
    },
    updateSchool: (state, action) => {
      // this is for the individual school details
      state.school = action.payload;
    },
    updateDeleteDialogOpen: (state, action) => {
      state.deleteDialogOpen = action.payload;
    },
    updateSelectedSchool: (state, action) => {
      // this is for the individual school details
      state.selectedSchool = action.payload;
    },
    resetSchoolSlice: (state, action) => initialState,
  },
});

/**
 * Lazy load
 * */
rootReducer.inject(schoolSlice);

export const {
  updateSchoolRequirements,
  updateSchools,
  updateSchool,
  updateDeleteDialogOpen,
  updateSelectedSchool,
  resetSchoolSlice,
} = schoolSlice.actions;

// export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default schoolSlice.reducer;
