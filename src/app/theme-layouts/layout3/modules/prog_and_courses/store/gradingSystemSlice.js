import { createSlice } from "@reduxjs/toolkit";
import _ from "@lodash";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialGradingFormState = {
  id: null,
  grading_title: "",
  description: "",
};

const initialGradingDetailsFormState = {
  id: null,
  min_value: null,
  max_value: null,
  grade_point: null,
  grade_letter: "",
  added_by: "",
};

const initialState = {
  grading: initialGradingFormState,
  gradingDetails: initialGradingDetailsFormState,
  gradingSystems: [],
  gradingSystemDetails: [],
  selectedGrading: null,
  selectedGradingDetail: null,
  deleteDialogOpen: false,
  addGradingSystemDialogOpen: false,
  addGradingSystemDetailsDialogOpen: false,
};

const gradingSystemSlice = createSlice({
  name: "grading",
  initialState,
  reducers: {
    updateGrading: (state, action) => {
      state.grading = action.payload;
    },
    updateGradingDetails: (state, action) => {
      state.gradingDetails = action.payload;
    },
    updateGradingSystems: (state, action) => {
      state.gradingSystems = action.payload;
    },
    updateGradingSystemDetails: (state, action) => {
      state.gradingSystemDetails = action.payload;
    },
    updateDeleteDialogOpen: (state, action) => {
      state.deleteDialogOpen = action.payload;
    },
    updateSelectedGrading: (state, action) => {
      state.selectedGrading = action.payload;
    },
    updateSelectedGradingDetail: (state, action) => {
      state.selectedGradingDetail = action.payload;
    },
    updateAddGradingSystemDialogOpen: (state, action) => {
      state.addGradingSystemDialogOpen = action.payload;
    },
    updateAddGradingSystemDetailsDialogOpen: (state, action) => {
      state.addGradingSystemDetailsDialogOpen = action.payload;
    },
    resetGradingSlice: (state, action) => initialState,
  },
});

/**
 * Lazy load
 * */
rootReducer.inject(gradingSystemSlice);

export const {
  updateGrading,
  updateGradingDetails,
  updateGradingSystems,
  updateGradingSystemDetails,
  updateDeleteDialogOpen,
  updateSelectedGrading,
  updateSelectedGradingDetail,
  updateAddGradingSystemDialogOpen,
  updateAddGradingSystemDetailsDialogOpen,
  resetGradingSlice,
} = gradingSystemSlice.actions;

// export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default gradingSystemSlice.reducer;
