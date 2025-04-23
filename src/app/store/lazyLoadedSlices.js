import { combineSlices } from "@reduxjs/toolkit";
import { fuseSettingsSlice } from "@fuse/core/FuseSettings/fuseSettingsSlice";
import { i18nSlice } from "app/store/i18nSlice";
import apiService from "./apiService";
import { userSlice } from "../auth/user/store/userSlice";
import { userSlice as us } from "./userSlice";
import { appsSlice } from "./appSlice";
import { applicantsSlice } from "./admissions/applicantsSlice";
import { admissionsSlice } from "./admissionsSlice";
import { tokenSlice } from "./tokenSlice";
// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
export const rootReducer = combineSlices(
  /**
   * Static slices
   */
  userSlice,
  fuseSettingsSlice,
  i18nSlice,
  us,
  appsSlice,
  applicantsSlice,
  admissionsSlice,
  tokenSlice,
  /**
   * Dynamic slices
   */
  {
    [apiService.reducerPath]: apiService.reducer,
  }
).withLazyLoadedSlices();
