import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import Campus from "./tabs/campus/Campus";
import Intake from "./tabs/intake/Intake";
import Levels from "./tabs/levels/Level";
import Awards from "./tabs/awards/Awards";
import Study_Time from "./tabs/study_time/Study_Time";
import GeneralInformation from "./tabs/general_info/GeneralInformation";
import { selectActiveTab, updateActiveTab } from "./store/setUpSlice";
import AcademicYears from "./tabs/academic_yr/AcademicYears";
import AcademicCalendar from "./tabs/academic_calendar/AcademicCalendar";
import AppNav from "../../components/AppNav";

const tabs = [
  "General Information",
  "Campuses",
  "Intakes",
  "Levels",
  "Awards",
  "Study Times",
  "Academic Years",
  "Academic Calendar",
];

const Setup = React.memo(function Setup() {
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const location = useLocation();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

  const dispatch = useDispatch();
  const activeTab = useSelector(selectActiveTab);

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
    }
  }, [location, isMobile]);

  function handleTabChange(event, value) {
    dispatch(updateActiveTab(value));
  }

  useEffect(() => {
    if (!appExistsInTaskBar) {
      setLoading(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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

            {activeTab === 0 && <GeneralInformation />}
            {activeTab === 1 && <Campus />}
            {activeTab === 2 && <Intake />}
            {activeTab === 3 && <Levels />}
            {activeTab === 4 && <Awards />}
            {activeTab === 5 && <Study_Time />}
            {activeTab === 6 && <AcademicYears />}
            {activeTab === 7 && <AcademicCalendar />}
          </Box>
        </Suspense>
      )}
    </>
  );
});

export default Setup;
