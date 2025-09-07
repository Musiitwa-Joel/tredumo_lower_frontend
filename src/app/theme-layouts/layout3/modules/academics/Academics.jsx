import React, { useMemo } from "react";
import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import Box from "@mui/material/Box";
import { selectActiveTab, setActiveTab } from "./store/academicsSlice";
import AppNav from "../../components/AppNav";

const tabs = [
  "Timetables", // Manage lesson schedules
  "Subjects", // Manage subjects per class/level
  "Classes & Sections", // Organize grades, streams, and divisions
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

          {activeTab === 0 && <Div />}
          {activeTab === 1 && <Div />}
          {activeTab === 2 && <Div />}
        </Box>
      </Suspense>
    </>
  );
}

export default SystemAccess;
