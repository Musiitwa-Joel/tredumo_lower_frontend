import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";
import _ from "@lodash";

const initialFormState = {
  id: null,
  university_code: "",
  university_title: "",
  university_logo: "",
  contact_info: "",
  entry_yrs: null,
  semeters_per_acc_yr: null,
  university_x_account: "",
  university_facebook_account: "",
  university_instagram_account: "",
  favicon: "",
  primary_color: "",
  secondary_color: "",
};

const initialCampusFormState = {
  id: null,
  campus_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

const initialIntakeFormState = {
  id: null,
  intake_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

const initialLevelFormState = {
  id: null,
  level_code: "",
  level_title: "",
  study_times: [],
  added_by: "",
  modified_by: "",
  modified_on: "",
};

const initialAwardFormState = {
  id: null,
  level_id: "",
  award_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

const initialStudyTimeFormState = {
  id: null,
  level_id: "",
  award_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

const initialAccYrFormState = {
  id: null,
  level_id: "",
  award_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

const initialState = {
  activeTab: 0,
  universityDetails: initialFormState,
  campuses: [],
  selectedCampus: initialCampusFormState,
  intakes: [],
  selectedIntake: initialIntakeFormState,
  levels: [],
  selectedLevel: initialLevelFormState,
  awards: [],
  selectedAward: initialAwardFormState,
  study_times: [],
  selectedStudyTime: initialStudyTimeFormState,
  acc_yrs: [],
  selectedAccYr: initialAccYrFormState,
  selectedEvent: null,
};

const setUpSlice = createSlice({
  name: "setUp",
  initialState,
  reducers: {
    // university
    updateActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    updateUniversityDetails: (state, action) => {
      state.universityDetails = action.payload;
    },

    // campuses
    updateCampuses: (state, action) => {
      state.campuses = action.payload;
    },
    updateSelectedCampus: (state, action) => {
      state.selectedCampus = action.payload;
    },
    resetCampusFormState: (state, action) => {
      state.selectedCampus = initialCampusFormState;
    },
    // intakes
    updateIntakes: (state, action) => {
      state.intakes = action.payload;
    },
    updateSelectedIntake: (state, action) => {
      state.selectedIntake = action.payload;
    },
    resetIntakeFormState: (state, action) => {
      state.selectedIntake = initialCampusFormState;
    },

    // levels
    updateLevels: (state, action) => {
      state.levels = action.payload;
    },
    updateSelectedLevel: (state, action) => {
      state.selectedLevel = action.payload;
    },
    resetLevelFormState: (state, action) => {
      state.selectedLevel = initialLevelFormState;
    },

    // awards
    updateAwards: (state, action) => {
      state.awards = action.payload;
    },
    updateSelectedAward: (state, action) => {
      state.selectedAward = action.payload;
    },
    resetAwardFormState: (state, action) => {
      state.selectedAward = initialLevelFormState;
    },

    // study times
    updateStudyTimes: (state, action) => {
      state.study_times = action.payload;
    },
    updateSelectedStudyTime: (state, action) => {
      state.selectedStudyTime = action.payload;
    },
    resetStudyTimeFormState: (state, action) => {
      state.selectedStudyTime = initialLevelFormState;
    },

    // acc yrs
    updateAccYrs: (state, action) => {
      state.acc_yrs = action.payload;
    },
    updateSelectedAccYr: (state, action) => {
      state.selectedAccYr = action.payload;
    },
    resetAccYrFormState: (state, action) => {
      state.selectedAccYr = initialLevelFormState;
    },

    // reset entire module
    resetSetUpSlice: (state, action) => initialState,

    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
  },

  selectors: {
    selectActiveTab: (state) => state.activeTab,
    selectUniversityDetails: (state) => state.universityDetails,
    selectAccYrs: (state) => state.acc_yrs,
    selectSelectedEvent: (state) => state.selectedEvent,
  },
});

/**
 * Lazy load
 * */
rootReducer.inject(setUpSlice);
const injectedSlice = setUpSlice.injectInto(rootReducer);

export const {
  updateActiveTab,
  updateUniversityDetails,
  resetSetUpSlice,
  updateCampuses,
  updateSelectedCampus,
  resetCampusFormState,
  updateIntakes,
  updateSelectedIntake,
  resetIntakeFormState,
  updateLevels,
  updateSelectedLevel,
  resetLevelFormState,
  updateAwards,
  updateSelectedAward,
  resetAwardFormState,
  updateStudyTimes,
  updateSelectedStudyTime,
  resetStudyTimeFormState,
  updateAccYrs,
  updateSelectedAccYr,
  resetAccYrFormState,
  setSelectedEvent,
} = setUpSlice.actions;

export const {
  selectAccYrs,
  selectSelectedEvent,
  selectActiveTab,
  selectUniversityDetails,
} = injectedSlice.selectors;

// export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default setUpSlice.reducer;
