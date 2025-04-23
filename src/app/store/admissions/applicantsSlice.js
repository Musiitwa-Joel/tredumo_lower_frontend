import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProgram: {},
  applicationPreviewOpen: false,
  applicantFormsLoading: false,
  applicantReqs: null, //applicant requirements to use the appliacants sub module
  programChoices: [],
  applicantForms: [],
};

export const applicantsSlice = createSlice({
  name: "applicants",
  initialState,
  reducers: {
    programSelected: (state, action) => {
      state.selectedProgram = action.payload;
    },
    applicationPreviewOpened: (state, action) => {
      state.applicationPreviewOpen = action.payload;
    },
    applicantReqsLoaded: (state, action) => {
      state.applicantReqs = action.payload;
    },
    saveProgramChoices: (state, action) => {
      state.programChoices = action.payload;
    },
    loadApplicantForms: (state, action) => {
      state.applicantFormsLoading = action.payload;
    },
    applicantFormsLoaded: (state, action) => {
      state.applicantForms = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  programSelected,
  applicationPreviewOpened,
  applicantReqsLoaded,
  saveProgramChoices,
  loadApplicantForms,
  applicantFormsLoaded,
} = applicantsSlice.actions;

export default applicantsSlice.reducer;
