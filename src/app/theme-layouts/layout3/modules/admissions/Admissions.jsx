import React, { Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import FuseLoading from "@fuse/core/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import Applicants from "./tabs/applicants/Applicants";
import Reports from "./tabs/reports/Reports";
import Settings from "./tabs/settings/Settings";
import { updateActiveTab } from "app/store/admissionsSlice";
import Admitted from "./tabs/admitted/Admitted";
import AppNav2 from "../../components/AppNav2";
import { ConfigProvider, theme } from "antd";

const tabs = [
  { label: "Applicants", value: "applicants" },
  { label: "Admissible PhD Students", value: "admissible_phd_students" },
  { label: "Admitted", value: "admitted" },
  { label: "Change of program", value: "change_of_program" },
  { label: "Report", value: "report" },
  { label: "Settings", value: "settings" },
  { label: "Uneb Results", value: "uneb_results" },
];

const Admissions = React.memo(function Admissions() {
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const activeTab = useSelector(
    (state) => state.admissions.module_state.activeTab
  );
  const activeApp = useSelector((state) => state.apps.activeApp);
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
    dispatch(updateActiveTab(value));
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
            <AppNav2
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
              {activeTab === "applicants" && <Applicants />}
              {activeTab === "admitted" && <Admitted />}
              {activeTab === "report" && <Reports />}
              {activeTab === "settings" && <Settings />}
            </ConfigProvider>
          </Box>
        </Suspense>
      )}
    </>
  );
});

export default Admissions;
