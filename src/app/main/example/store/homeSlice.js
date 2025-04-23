import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialState = {
  selectedTab: "apps",
  apps: [],
};
/**
 * The File Manager App slice.
 */
export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
    setApps: (state, action) => {
      state.apps = action.payload;
    },
  },
  selectors: {
    selectSelectedTab: (state) => state.selectedTab,
    selectApps: (state) => state.apps,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(homeSlice);
const injectedSlice = homeSlice.injectInto(rootReducer);
export const { setSelectedTab, setApps } = homeSlice.actions;
export const { selectSelectedTab, selectApps } = injectedSlice.selectors;
export default homeSlice.reducer;
