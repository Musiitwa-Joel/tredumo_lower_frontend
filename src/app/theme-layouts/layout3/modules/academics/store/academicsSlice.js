import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialState = {
  activeTab: 0,
};

export const academicsSlice = createSlice({
  name: "academics",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  selectors: {
    selectActiveTab: (state) => state.activeTab,
  },
});

/**
 * Lazy load
 */
rootReducer.inject(academicsSlice);
const injectedSlice = academicsSlice.injectInto(rootReducer);

export const { setActiveTab } = academicsSlice.actions;
export const { selectActiveTab } = injectedSlice.selectors;

export default academicsSlice.reducer;
