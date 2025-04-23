import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gql, useQuery } from "@apollo/client";
import FuseLoading from "@fuse/core/FuseLoading";
import Box from "@mui/material/Box";
import { ConfigProvider, theme } from "antd";
import AppNav2 from "../../components/AppNav2";
import {
  selectActiveTab,
  setActiveTab,
  setEnrollmentStatuses,
} from "./store/registrationSlice";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { updateAccYrs } from "../setup/store/setUpSlice";
import Register from "./tabs/register/Register";
import FinanceReports from "./tabs/reports/FinanceReports";
// import FinanceTransactions from "./tabs/transactions/FinanceTransactions";
// import BatchActions from "./tabs/batchActions/BatchActions";
// import GlobalSettings from "./tabs/globalSettings/GlobalSettings";

// GraphQL Queries
const LOAD_ENROLLMENT_STATUSES = gql`
  query getEnrollmentStatuses {
    enrollment_types {
      id
      enrollment_type
    }
  }
`;

const LOAD_ACC_YRS = gql`
  query getAccYrs {
    acc_yrs {
      id
      acc_yr_title
    }
  }
`;

function Finance() {
  const dispatch = useDispatch();
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const activeTab = useSelector(selectActiveTab);

  const tabs = [
    { label: "Student View", value: "student_view" },
    { label: "Reports", value: "reports" },
    { label: "Transactions", value: "transactions" },
    { label: "Batch Actions", value: "batch_actions" },
    { label: "Global", value: "global" },
  ];

  // GraphQL queries
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

  // Handle GraphQL errors
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
  }, [error, loadErr, dispatch]);

  // Update Redux store with GraphQL data
  useEffect(() => {
    if (data) {
      dispatch(setEnrollmentStatuses(data.enrollment_types));
    }

    if (accYrRes) {
      dispatch(updateAccYrs(accYrRes.acc_yrs));
    }
  }, [data, accYrRes, dispatch]);

  useEffect(() => {
    if (!appExistsInTaskBar) {
      setLoading(true);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [appExistsInTaskBar]);

  function handleTabChange(event, value) {
    dispatch(setActiveTab(value));
  }

  const isLoading = loading || loadingEnrollmentStatuses || loadingAccYrs;

  return isLoading ? (
    <FuseLoading logo={activeApp?.logo} />
  ) : (
    <>
      <ConfigProvider
        theme={{
          algorithm: [theme.compactAlgorithm],
          token: {
            colorPrimary: "#4f46e6", // Match the purple color from original
          },
        }}
      >
        <Suspense fallback={<FuseLoading logo={activeApp?.logo} />}>
          <Box sx={{ flexGrow: 1 }}>
            <AppNav2
              tabs={tabs}
              activeApp={activeApp}
              activeTab={activeTab}
              handleTabChange={handleTabChange}
            />
            {activeTab === "student_view" && <Register />}
            {activeTab === "reports" && <FinanceReports />}
            {activeTab === "transactions" && <FinanceTransactions />}
            {activeTab === "batch_actions" && <BatchActions />}
            {activeTab === "global" && <GlobalSettings />}
          </Box>
        </Suspense>
      </ConfigProvider>
    </>
  );
}

export default Finance;
