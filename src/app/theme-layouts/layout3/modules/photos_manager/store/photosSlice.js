import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialState = {
  activeBooth: null,
  options: [],
  selectedOption: {
    student_no: "",
  },
  imagePreview: `http://localhost:2222/api/student_image/0`,
  imageToUpload: null,
  recentUploads: [],
  selectedRow: null,
};
/**
 * The File Manager App slice.
 */
export const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {
    setActiveBooth: (state, action) => {
      state.activeBooth = action.payload;
    },
    setStdOptions: (state, action) => {
      state.options = action.payload;
    },
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
    setImagePreview: (state, action) => {
      state.imagePreview = action.payload;
    },
    setImageToUpload: (state, action) => {
      state.imageToUpload = action.payload;
    },
    setRecentUploads: (state, action) => {
      state.recentUploads = action.payload;
    },
    setSelectedRow: (state, action) => {
      state.selectedRow = action.payload;
    },
  },
  selectors: {
    selectActiveBooth: (state) => state.activeBooth,
    selectOptions: (state) => state.options,
    selectSelectedOption: (state) => state.selectedOption,
    selectImagePreview: (state) => state.imagePreview,
    selectImageToUpload: (state) => state.imageToUpload,
    selectRecentUploads: (state) => state.recentUploads,
    selectSelectedRow: (state) => state.selectedRow,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(photosSlice);
const injectedSlice = photosSlice.injectInto(rootReducer);
export const {
  setActiveBooth,
  setStdOptions,
  setSelectedOption,
  setImagePreview,
  setImageToUpload,
  setRecentUploads,
  setSelectedRow,
} = photosSlice.actions;
export const {
  selectActiveBooth,
  selectOptions,
  selectSelectedOption,
  selectImagePreview,
  selectImageToUpload,
  selectRecentUploads,
  selectSelectedRow,
} = injectedSlice.selectors;
export default photosSlice.reducer;
