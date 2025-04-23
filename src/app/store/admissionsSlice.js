import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "@lodash";

const initialModuleState = {
  activeTab: "applicants",
  acc_yr: "",
  scheme: "",
  intake: "",
};

const initialState = {
  id: 3,
  title: "Admissions",
  route: "admissions",
  data: [],
  module_state: initialModuleState,
  // logo: admissions,
  admitStdsModalOpen: false,
  studeentToBeAdmitted: [],
};

export const admissionsSlice = createSlice({
  name: "admissions",
  initialState,
  reducers: {
    updateActiveTab: (state, action) => {
      state.module_state.activeTab = action.payload;
    },
    updateAccYr: (state, action) => {
      state.module_state.acc_yr = action.payload;
    },
    updateScheme: (state, action) => {
      state.module_state.scheme = action.payload;
    },
    updateIntake: (state, action) => {
      state.module_state.intake = action.payload;
    },
    updateAdmitStdsModalOpen: (state, action) => {
      state.admitStdsModalOpen = action.payload;
    },
    updateStudentsToBeAdmitted: (state, action) => {
      state.studeentToBeAdmitted = action.payload;
    },
    resetModuleState: (state, action) => {
      if (action.payload == 3) {
        state.module_state = initialModuleState;
      }
    },
  },
});

export const {
  updateActiveTab,
  updateAccYr,
  updateIntake,
  updateScheme,
  resetModuleState,
  updateAdmitStdsModalOpen,
  updateStudentsToBeAdmitted,
} = admissionsSlice.actions;

// export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default admissionsSlice.reducer;
