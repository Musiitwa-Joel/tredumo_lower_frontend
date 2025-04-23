import { createSlice } from "@reduxjs/toolkit";
import { rootReducer } from "app/store/lazyLoadedSlices";

const initialState = {
  initialUserProfile: null,
};
/**
 * The File Manager App slice.
 */
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInitialUserProfile: (state, action) => {
      state.initialUserProfile = action.payload;
    },
  
  },
  selectors: {
    selectInitialUserProfile: (state) => state.initialUserProfile,
  },
});
/**
 * Lazy load
 * */
rootReducer.inject(authSlice);
const injectedSlice = authSlice.injectInto(rootReducer);
export const { setInitialUserProfile } = authSlice.actions;
export const { selectInitialUserProfile } = injectedSlice.selectors;
export default authSlice.reducer;
