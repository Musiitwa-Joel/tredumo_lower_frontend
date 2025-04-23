import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
  selectActiveTab,
  setActiveTab,
  setEnrollmentStatuses,
} from "./store/registrationSlice";
import Register from "./tabs/register/Register";
import { gql, useQuery } from "@apollo/client";
import { LOAD_ENROLLMENT_STATUSES } from "./gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { updateAccYrs } from "../setup/store/setUpSlice";
import Reports from "./tabs/reports/Reports";
import AppNav from "../../components/AppNav";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

const LOAD_ACC_YRS = gql`
  query getAccYrs {
    acc_yrs {
      id
      acc_yr_title
    }
  }
`;

const tabs = ["Register Students", "Reports", "Blocked Students"];

const Registration = React.memo(function Setup() {
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const {
    loading: loadingEnrollmentStatuses,
    error,
    data,
  } = useQuery(LOAD_ENROLLMENT_STATUSES);

  const {
    loading: loadingAccYrs,
    error: loadErr,
    data: accYrRes,
  } = useQuery(LOAD_ACC_YRS);

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }
  }, [error, loadErr]);

  useEffect(() => {
    if (data) {
      // console.log("data", data);
      dispatch(setEnrollmentStatuses(data.enrollment_types));
    }

    if (accYrRes) {
      // console.log("data", data);
      dispatch(updateAccYrs(accYrRes.acc_yrs));
    }
  }, [data, accYrRes]);

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
    // setSelectedTab(value);
    dispatch(setActiveTab(value));
  }

  // console.log("apps in taskbar", taskBarApps);
  useEffect(() => {
    // const exists = checkAppExistence(taskBarApps, "route", "admissions");

    if (!appExistsInTaskBar) {
      setLoading(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {loading || loadingEnrollmentStatuses ? (
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

            {activeTab === 0 && <Register />}
            {activeTab === 1 && <Reports />}
          </Box>
        </Suspense>
      )}
    </>
  );
});

// export default Setup;

export default Registration;
