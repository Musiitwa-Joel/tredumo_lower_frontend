const initialClassFormState = {
  id: null,
  class_code: "",
  class_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};
const initialSectionFormState = {
  id: null,
  section_code: "",
  section_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};
import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialSubjectFormState = {
  id: null,
  subject_code: "",
  subject_title: "",
  added_by: "",
  modified_by: "",
  modified_on: "",
};

const initialState = {
  activeTab: 0,
  subjects: [],
  selectedSubject: initialSubjectFormState,
  sections: [],
  selectedSection: initialSectionFormState,
  classes: [],
  selectedClass: initialClassFormState,
};
export const academicsSlice = createSlice({
  name: "academics",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    // subjects
    updateSubjects: (state, action) => {
      state.subjects = action.payload;
    },
    updateSelectedSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },
    resetSubjectFormState: (state, action) => {
      state.selectedSubject = initialSubjectFormState;
    },
    // sections
    updateSections: (state, action) => {
      state.sections = action.payload;
    },
    updateSelectedSection: (state, action) => {
      state.selectedSection = action.payload;
    },
    resetSectionFormState: (state, action) => {
      state.selectedSection = initialSectionFormState;
    },
    // classes
    updateClasses: (state, action) => {
      state.classes = action.payload;
    },
    updateSelectedClass: (state, action) => {
      state.selectedClass = action.payload;
    },
    resetClassFormState: (state, action) => {
      state.selectedClass = initialClassFormState;
    },
  },
  selectors: {
    selectActiveTab: (state) => state.activeTab,
    selectSubjects: (state) => state.subjects,
    selectSelectedSubject: (state) => state.selectedSubject,
    selectSections: (state) => state.sections,
    selectSelectedSection: (state) => state.selectedSection,
    selectClasses: (state) => state.classes,
    selectSelectedClass: (state) => state.selectedClass,
  },
});

rootReducer.inject(academicsSlice);
const injectedSlice = academicsSlice.injectInto(rootReducer);

export const {
  setActiveTab,
  updateSubjects,
  updateSelectedSubject,
  resetSubjectFormState,
  updateSections,
  updateSelectedSection,
  resetSectionFormState,
  updateClasses,
  updateSelectedClass,
  resetClassFormState,
} = academicsSlice.actions;

export const {
  selectActiveTab,
  selectSubjects,
  selectSelectedSubject,
  selectSections,
  selectSelectedSection,
  selectClasses,
  selectSelectedClass,
} = injectedSlice.selectors;

export default academicsSlice.reducer;
