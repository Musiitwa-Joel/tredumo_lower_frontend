import React, { useMemo } from "react";
import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import Box from "@mui/material/Box";
import { selectActiveTab, setActiveTab } from "./store/academicsSlice";
import Timetables from "./tabs/timetables/Timetables";
import Subjects from "./tabs/subjects/Subjects";
import AppNav from "../../components/AppNav";
import Sections from "./tabs/sections/Sections";
import Classes from "./tabs/classes/Classes";

const tabs = [
  "Timetables", // Manage lesson schedules
  "Subjects", // Manage subjects per class/level
  "Sections", // Manage sections within classes
  "Classes", // Organize grades, streams, and divisions
  "Class Management", // Assign teachers, promote students, manage enrollments
  "Exams & Grading", // Manage exams, marks entry, results, and reports
  "Syllabus & Curriculum", // Manage syllabus, curriculum plans, and academic structure
];

function SystemAccess() {
  const dispatch = useDispatch();
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const activeTab = useSelector(selectActiveTab);

  useEffect(() => {
    if (!appExistsInTaskBar) {
      setLoading(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  function handleTabChange(event, value) {
    dispatch(setActiveTab(value));
  }

  function Div() {
    return <div>Role Permissions Content</div>;
  }

  return loading ? (
    <FuseLoading logo={activeApp?.logo} />
  ) : (
    <>
      <Suspense fallback={<FuseLoading logo={activeApp?.logo} />}>
        <Box sx={{ flexGrow: 1 }}>
          <AppNav
            tabs={tabs}
            activeApp={activeApp}
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />

          {activeTab === 0 && <Timetables />}
          {activeTab === 1 && <Subjects />}
          {activeTab === 2 && <Sections />}
          {activeTab === 3 && <Classes />}
          {activeTab === 4 && <Div />}
          {activeTab === 5 && <Div />}
          {activeTab === 6 && <Div />}
        </Box>
        <Box sx={{ height: "20px" }}></Box>
      </Suspense>
    </>
  );
}

export default SystemAccess;
