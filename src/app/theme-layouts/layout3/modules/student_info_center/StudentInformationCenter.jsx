import React, { Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import StudentRecords from "./tabs/student_records/StudentRecords";
import { selectActiveTab, setActiveTab } from "./store/infoCenterSlice";
import AppNav from "../../components/AppNav";
import "./programs.css";
import { ConfigProvider, theme } from "antd";

const tabs = ["Student Records", "Settings"];

const StudentInformationCenter = React.memo(function Admissions() {
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const activeTab = useSelector(selectActiveTab);
  const apps = useSelector((state) => state.apps.apps);
  const activeApp = apps.find(
    (app) => app.route === "student_information_center"
  );
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const location = useLocation();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const dispatch = useDispatch();

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
    }
  }, [location, isMobile]);

  function handleTabChange(event, value) {
    dispatch(setActiveTab(value));
  }

  useEffect(() => {
    if (!appExistsInTaskBar) {
      setLoading(true);
    } else {
      setLoading(false);
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
            <ConfigProvider
              theme={{
                algorithm: theme.compactAlgorithm,
              }}
            >
              {activeTab === 0 && <StudentRecords />}
            </ConfigProvider>
          </Box>
        </Suspense>
      )}
    </>
  );
});

export default StudentInformationCenter;
