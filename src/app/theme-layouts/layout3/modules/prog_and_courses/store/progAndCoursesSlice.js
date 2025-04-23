import { createSlice } from "@reduxjs/toolkit";
import _ from "@lodash";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialProgrammeFormState = {
  id: null,
  course_code: "",
  course_title: "",
  course_version: "",
  course_duration: "",
  duration_measure: "",
  course_head_id: "",
  campuses: [],
  entry_yrs: [],
  college_id: "",
  school_id: "",
  department_id: "",
  level: "",
  award: "",
  grading_id: "",
  study_times: [],
  course_version_id: "",
  isShortCourse: false,
};

const initialState = {
  activeTab: 0,
  allProgrammes: [],
  filteredProgrammes: [],
  expandedItems: [],
  createProgrammeModalOpen: false,
  createProgrammeReqs: {
    awards: [],
    campuses: [],
    colleges: [],
    levels: [],
    employees: [],
    grading: [],
    study_times: [],
  },
  createModuleModalOpen: false,
  programmeFormDetails: initialProgrammeFormState,
  uploadProgrammesModalOpen: false,
  downloadProgrammesModalOpen: false,
  allCourses: [],
  addVersionModalOpen: false,
  selectedTreeItemId: "",
  reloadCourses: false,
  selectedItem: null,
  selectedCourseVersion: null,
  courseVersionToEdit: null,
  courseUnits: [],
  loadingCourseUnits: false,
  groupedData: [],
  defaultExpandedModuleRowKeys: [],
  createNewCourse: false,
  courseVersionDetails: null,
  loadingCourseVersionDetails: false,
  selectedAlias: null,
  searchValue: "",
  uploadModulesModalOpen: false,
  selectedUnit: null,
  editModule: false,
  moduleEdited: false,
  filteredCourseUnits: [],
  moduleSearchValue: "",
};

const progAndCoursesSlice = createSlice({
  name: "progAndCourses",
  initialState,
  reducers: {
    updateActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    updateAllProgrammes: (state, action) => {
      state.allProgrammes = action.payload;
    },
    updateExpandedItems: (state, action) => {
      state.expandedItems = action.payload;
    },
    updatecreateProgrammeModalOpen: (state, action) => {
      state.createProgrammeModalOpen = action.payload;
    },
    updateCreateModuleModalOpen: (state, action) => {
      state.createModuleModalOpen = action.payload;
    },
    updateCreateProgrammeReqs: (state, action) => {
      state.createProgrammeReqs = action.payload;
    },
    updateProgrammeFormDetails: (state, action) => {
      state.programmeFormDetails = action.payload;
    },
    resetProgrammeFormDetails: (state, action) => {
      state.programmeFormDetails = initialProgrammeFormState;
    },
    updateUploadProgrammesModalOpen: (state, action) => {
      state.uploadProgrammesModalOpen = action.payload;
    },
    updateDownloadProgrammesModalOpen: (state, action) => {
      state.downloadProgrammesModalOpen = action.payload;
    },
    updateAllCourses: (state, action) => {
      state.allCourses = action.payload;
    },
    updateAddVersionModalOpen: (state, action) => {
      state.addVersionModalOpen = action.payload;
    },
    updateSelectedTreeItemId: (state, action) => {
      state.selectedTreeItemId = action.payload;
    },
    setReloadCourses: (state, action) => {
      state.reloadCourses = action.payload;
    },
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    setSelectedCourseVersion: (state, action) => {
      state.selectedCourseVersion = action.payload;
    },
    setCourseVersionToEdit: (state, action) => {
      state.courseVersionToEdit = action.payload;
    },

    setCourseUnits: (state, action) => {
      state.courseUnits = action.payload;
    },
    setLoadingCourseUnits: (state, action) => {
      state.loadingCourseUnits = action.payload;
    },
    setFilteredProgrammes: (state, action) => {
      state.filteredProgrammes = action.payload;
    },
    setGroupedData: (state, action) => {
      state.groupedData = action.payload;
    },
    setDefaultExpandedModuleRowKeys: (state, action) => {
      state.defaultExpandedModuleRowKeys = action.payload;
    },
    setCreateNewCourse: (state, action) => {
      state.createNewCourse = action.payload;
    },
    setCourseVersionDetails: (state, action) => {
      state.courseVersionDetails = action.payload;
    },
    setSelectedAlias: (state, action) => {
      state.selectedAlias = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setUploadModulesModalOpen: (state, action) => {
      state.uploadModulesModalOpen = action.payload;
    },
    setSelectedUnit: (state, action) => {
      state.selectedUnit = action.payload;
    },
    setEditModule: (state, action) => {
      state.editModule = action.payload;
    },
    setModuleEdited: (state, action) => {
      state.moduleEdited = action.payload;
    },
    setFilteredCourseUnits: (state, action) => {
      state.filteredCourseUnits = action.payload;
    },
    setModuleSearchValue: (state, action) => {
      state.moduleSearchValue = action.payload;
    },
    resetProgAndCoursesSlice: (state, action) => initialState,
  },

  selectors: {
    selectAllProgrammes: (state) => state.allProgrammes,
    selectExpandedItems: (state) => state.expandedItems,
    selectReloadCourses: (state) => state.reloadCourses,
    selectGroupedData: (state) => state.groupedData,
    selectDefaultExpandedModuleRowKeys: (state) =>
      state.defaultExpandedModuleRowKeys,
    selectSelectedCourseVersion: (state) => state.selectedCourseVersion,
    selectCreateNewCourse: (state) => state.createNewCourse,
    selectCourseVersionDetails: (state) => state.courseVersionDetails,
    selectProgrammeFormDetails: (state) => state.programmeFormDetails,
    selectSelectedAlias: (state) => state.selectedAlias,
    selectSelectedItem: (state) => state.selectedItem,
    selectCreateModuleModalOpen: (state) => state.createModuleModalOpen,
    selectAllCourses: (state) => state.allCourses,
    selectAddVersionModalOpen: (state) => state.addVersionModalOpen,
    selectCourseVersionToEdit: (state) => state.courseVersionToEdit,
    selectDownloadProgrammesModalOpen: (state) =>
      state.downloadProgrammesModalOpen,
    selectUploadProgrammesModalOpen: (state) => state.uploadProgrammesModalOpen,
    selectCreateProgrammeModalOpen: (state) => state.createProgrammeModalOpen,
    selectCourseUnits: (state) => state.courseUnits,
    selectLoadingCourseUnits: (state) => state.loadingCourseUnits,
    selectFilteredProgrammes: (state) => state.filteredProgrammes,
    selectSearchValue: (state) => state.searchValue,
    selectUploadModulesModalOpen: (state) => state.uploadModulesModalOpen,
    selectSelectedUnit: (state) => state.selectedUnit,
    selectEditModule: (state) => state.editModule,
    selectModuleEdited: (state) => state.moduleEdited,
    selectFilteredCourseUnits: (state) => state.filteredCourseUnits,
    selectModuleSearchValue: (state) => state.moduleSearchValue,
    selectActiveTab: (state) => state.activeTab,
  },
});

/**
 * Lazy load
 * */
rootReducer.inject(progAndCoursesSlice);
const injectedSlice = progAndCoursesSlice.injectInto(rootReducer);
export const {
  updateActiveTab,
  resetProgAndCoursesSlice,
  updateAllProgrammes,
  updateExpandedItems,
  updatecreateProgrammeModalOpen,
  updateCreateModuleModalOpen,
  updateCreateProgrammeReqs,
  updateProgrammeFormDetails,
  resetProgrammeFormDetails,
  updateUploadProgrammesModalOpen,
  updateDownloadProgrammesModalOpen,
  updateAllCourses,
  updateAddVersionModalOpen,
  updateSelectedTreeItemId,
  setReloadCourses,
  setSelectedItem,
  setSelectedCourseVersion,
  setCourseVersionToEdit,
  setCourseUnits,
  setLoadingCourseUnits,
  setFilteredProgrammes,
  setGroupedData,
  setDefaultExpandedModuleRowKeys,
  setCreateNewCourse,
  setCourseVersionDetails,
  setProgramAliases,
  setSelectedAlias,
  setSearchValue,
  setUploadModulesModalOpen,
  setSelectedUnit,
  setEditModule,
  setModuleEdited,
  setFilteredCourseUnits,
  setModuleSearchValue,
} = progAndCoursesSlice.actions;

export const {
  selectGroupedData,
  selectDefaultExpandedModuleRowKeys,
  selectSelectedCourseVersion,
  selectCreateNewCourse,
  selectCourseVersionDetails,
  selectProgrammeFormDetails,
  selectProgramAliases,
  selectSelectedAlias,
  selectSelectedItem,
  selectCreateModuleModalOpen,
  selectAllCourses,
  selectAddVersionModalOpen,
  selectCourseVersionToEdit,
  selectDownloadProgrammesModalOpen,
  selectUploadProgrammesModalOpen,
  selectCreateProgrammeModalOpen,
  selectAllProgrammes,
  selectExpandedItems,
  selectReloadCourses,
  selectCourseUnits,
  selectLoadingCourseUnits,
  selectFilteredProgrammes,
  selectSearchValue,
  selectUploadModulesModalOpen,
  selectSelectedUnit,
  selectEditModule,
  selectModuleEdited,
  selectFilteredCourseUnits,
  selectModuleSearchValue,
  selectActiveTab,
} = injectedSlice.selectors;

// export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default progAndCoursesSlice.reducer;
