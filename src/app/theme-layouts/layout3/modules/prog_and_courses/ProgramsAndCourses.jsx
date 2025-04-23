import React, { useMemo } from "react";
import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import Box from "@mui/material/Box";
import Programmes from "./tabs/programmes/Programmes";
import College from "./tabs/college/College";
import Schools from "./tabs/schools/Schools";
import Departments from "./tabs/departments/Departments";
import GradingSystems from "./tabs/grading/GradingSystems";
import { selectActiveTab, updateActiveTab } from "./store/progAndCoursesSlice";
import "./programs.css";
import AppNav from "../../components/AppNav";
import { ConfigProvider, theme } from "antd";

const tabs = [
  "Courses",
  "Colleges",
  "Schools",
  "Departments",
  "Grading",
  "Other Configs",
];

function ProgramsAndCourses() {
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
    dispatch(updateActiveTab(value));
  }

  return (
    <>
      {loading ? (
        <FuseLoading logo={activeApp?.logo} />
      ) : (
        <Suspense fallback={<FuseLoading logo={activeApp?.logo} />}>
          <Box sx={{ flexGrow: 1 }}>
            <AppNav
              tabs={tabs}
              activeApp={activeApp}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
            />
            <ConfigProvider
              theme={{
                algorithm: theme.compactAlgorithm,
              }}
            >
              {activeTab === 0 && <Programmes />}
              {activeTab === 1 && <College />}
              {activeTab === 2 && <Schools />}
              {activeTab === 3 && <Departments />}
              {activeTab === 4 && <GradingSystems />}
            </ConfigProvider>
          </Box>
        </Suspense>
      )}
    </>
  );
}

export default ProgramsAndCourses;
