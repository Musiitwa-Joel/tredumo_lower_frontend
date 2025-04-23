import { combineReducers } from "@reduxjs/toolkit";
import projects from "./projectsSlice";
import widgets from "./widgetsSlice";
import programs from "../../../../../store/admissions/applicantsSlice";

const reducer = combineReducers({
  widgets,
  projects,
  programs,
});

export default reducer;
