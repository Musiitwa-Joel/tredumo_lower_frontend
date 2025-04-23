import { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseLoading from "@fuse/core/FuseLoading";
import Box from "@mui/material/Box";
import { selectActiveTab, setActiveTab } from "./store/feesMgtSlice";
import TredPayTransactions from "./tabs/tredpayTransactions/TredPayTransactions";
import TredPayHome from "./tabs/TredPayHome/TredPayHome";
import ReferenceLookup from "./tabs/referenceLookup/ReferenceLookup";
import { ConfigProvider, theme } from "antd";
import AppNav2 from "../../components/AppNav2";
import { selectUser } from "app/store/userSlice";

function TredPay() {
  const dispatch = useDispatch();
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const [loading, setLoading] = useState(!appExistsInTaskBar ? true : false);
  const activeApp = useSelector((state) => state.apps.activeApp);
  const activeTab = useSelector(selectActiveTab);
  const user = useSelector(selectUser);

  const tabs = [
    { label: "Home", value: "home" },
    { label: "All Transactions", value: "transactions" },
    { label: "Reference Lookup", value: "reference_lookup" },
  ];

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
      <ConfigProvider
        theme={{
          algorithm: [theme.compactAlgorithm],
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
            {activeTab === "home" && <TredPayHome />}
            {activeTab === "transactions" && <TredPayTransactions />}
            {activeTab === "reference_lookup" && <ReferenceLookup />}
          </Box>
        </Suspense>
      </ConfigProvider>
    </>
  );
}

export default TredPay;
