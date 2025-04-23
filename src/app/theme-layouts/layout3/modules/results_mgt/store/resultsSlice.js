import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialState = {
  activeTab: "results_view",
  marksDetails: [],
  expandedMarksKeys: [],
  resultsConfigModalVisible: false,
  resultsConfigurations: null,
  selectedTreeItem: null,
  results: null,
  loadingResults: false,
  selectedStudyYr: "1",
  selectedSem: "1",
  stdno: null,
  testimonialsToPrint: [],
  publishResultsModalVisible: false,
};

export const resultsSlice = createSlice({
  name: "resultsMgt",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setMarksDetails: (state, action) => {
      state.marksDetails = action.payload;
    },
    setExpandedMarksKeys: (state, action) => {
      state.expandedMarksKeys = action.payload;
    },
    setResultsConfigModalVisible: (state, action) => {
      state.resultsConfigModalVisible = action.payload;
    },
    setResultsConfigurations: (state, action) => {
      state.resultsConfigurations = action.payload;
    },
    setSelectedTreeItem: (state, action) => {
      state.selectedTreeItem = action.payload;
    },
    setResults: (state, action) => {
      state.results = action.payload;
    },
    setLoadingResults: (state, action) => {
      state.loadingResults = action.payload;
    },
    setSelectedStudyYr: (state, action) => {
      state.selectedStudyYr = action.payload;
    },
    setSelectedSem: (state, action) => {
      state.selectedSem = action.payload;
    },
    setStdNo: (state, action) => {
      state.stdno = action.payload;
    },
    setTestimonialsToPrint: (state, action) => {
      state.testimonialsToPrint = action.payload;
    },
    setPublishResultsModalVisible: (state, action) => {
      state.publishResultsModalVisible = action.payload;
    },
  },

  selectors: {
    selectActiveTab: (state) => state.activeTab,
    selectMarksDetails: (state) => state.marksDetails,
    selectExpandedMarksKeys: (state) => state.expandedMarksKeys,
    selectResultsConfigModalVisible: (state) => state.resultsConfigModalVisible,
    selectResultsConfigurations: (state) => state.resultsConfigurations,
    selectSelectedTreeItem: (state) => state.selectedTreeItem,
    selectResults: (state) => state.results,
    selectLoadingResults: (state) => state.loadingResults,
    selectSelectedStudyYr: (state) => state.selectedStudyYr,
    selectSelectedSem: (state) => state.selectedSem,
    selectStdNo: (state) => state.stdno,
    selectTestimonialsToPrint: (state) => state.testimonialsToPrint,
    selectPublishResultsModalVisible: (state) =>
      state.publishResultsModalVisible,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(resultsSlice);
const injectedSlice = resultsSlice.injectInto(rootReducer);
export const {
  setActiveTab,
  setMarksDetails,
  setExpandedMarksKeys,
  setResultsConfigModalVisible,
  setResultsConfigurations,
  setSelectedTreeItem,
  setResults,
  setLoadingResults,
  setSelectedStudyYr,
  setSelectedSem,
  setStdNo,
  setTestimonialsToPrint,
  setPublishResultsModalVisible,
} = resultsSlice.actions;

export const {
  selectActiveTab,
  selectMarksDetails,
  selectExpandedMarksKeys,
  selectResultsConfigModalVisible,
  selectResultsConfigurations,
  selectSelectedTreeItem,
  selectResults,
  selectLoadingResults,
  selectSelectedStudyYr,
  selectSelectedSem,
  selectStdNo,
  selectTestimonialsToPrint,
  selectPublishResultsModalVisible,
} = injectedSlice.selectors;
export default resultsSlice.reducer;
