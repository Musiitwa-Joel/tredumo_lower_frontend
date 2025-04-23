import { styled } from "@mui/material/styles";
// import { useTranslation } from "react-i18next";
import FusePageSimple from "@fuse/core/FusePageSimple";
import ProjectDashboardAppHeader from "./ProjectDashboardAppHeader";
import { useSelector } from "react-redux";
import { selectSelectedTab } from "./store/homeSlice";
import Apps from "./Apps";
import Notices from "./Notices";
import Feedback from "./Feedback";

const Root2 = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`,
  },
}));

function Example(props) {
  //   const { t } = useTranslation("examplePage");
  const selectedTab = useSelector(selectSelectedTab);

  return (
    <>
      <Root2
        header={<ProjectDashboardAppHeader />}
        content={
          <div
            className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0"
            style={{
              backgroundColor: "rgba(81, 53, 3, 0.05)",
              height: "calc(100vh - 265px)",
            }}
          >
            {selectedTab == "apps" && <Apps />}
            {selectedTab == "notices" && <Notices />}
            {selectedTab == "feedback" && <Feedback />}
          </div>
        }
      />
    </>
  );
}

export default Example;
