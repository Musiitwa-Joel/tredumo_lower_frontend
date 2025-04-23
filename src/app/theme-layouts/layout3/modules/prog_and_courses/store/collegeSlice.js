import { createSlice } from "@reduxjs/toolkit";
import _ from "@lodash";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialFormState = {
  id: null,
  college_code: "",
  college_title: "",
};

const initialState = {
  college: initialFormState,
  colleges: [],
};

const collegeSlice = createSlice({
  name: "college",
  initialState,
  reducers: {
    updateColleges: (state, action) => {
      state.colleges = action.payload;
    },
    updateCollege: (state, action) => {
      // this is for the individual college details
      state.college = action.payload;
    },
    resetCollegeSlice: (state, action) => initialState,
  },
});

/**
 * Lazy load
 * */
rootReducer.inject(collegeSlice);

export const { updateCollege, updateColleges, resetCollegeSlice } =
  collegeSlice.actions;

// export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default collegeSlice.reducer;
