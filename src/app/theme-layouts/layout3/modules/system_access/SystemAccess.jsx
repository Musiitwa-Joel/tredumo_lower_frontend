import React, { useMemo } from "react";
import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import Box from "@mui/material/Box";
import { selectActiveTab, setActiveTab } from "./store/systemAccessSlice";
import RolePermissions from "./tabs/role_permissions/RolePermissions";
import Users from "./tabs/users/Users";
import AppNav from "../../components/AppNav";
import { ConfigProvider, theme } from "antd";

const tabs = [
  // "Role Permissions",
  "Users",
  "System Logs",
  "Other Configs",
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
          <ConfigProvider
            theme={{
              algorithm: theme.compactAlgorithm,
            }}
          >
            {/* {activeTab === 0 && <RolePermissions />} */}
            {activeTab === 0 && <Users />}
          </ConfigProvider>
        </Box>
      </Suspense>
    </>
  );
}

export default SystemAccess;
