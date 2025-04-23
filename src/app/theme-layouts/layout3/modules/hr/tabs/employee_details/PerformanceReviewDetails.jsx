import React from "react";
import { useEffect, useState } from "react";

import DemoContent from "./DemoContent";
import DemoSidebar from "./DemoSideBar";
import DemoHeader from "./DemoHeader";
import { styled } from "@mui/material/styles";
import FusePageCarded from "@fuse/core/FusePageCarded";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { LOAD_EVALUATION_TEMPLATE_QNS } from "../../gql/queries";
import { useSelector } from "react-redux";
import { selectSelectedPerformanceReview } from "../../store/hrSlice";

const Root = styled(FusePageCarded)(({ theme }) => ({
  "& .FusePageCarded-header": {},
  "& .FusePageCarded-toolbar": {},
  "& .FusePageCarded-content": {},
  "& .FusePageCarded-sidebarHeader": {},
  "& .FusePageCarded-sidebarContent": {},
}));

function PerformanceReviewDetails() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const selectedPerformanceReview = useSelector(
    selectSelectedPerformanceReview
  );
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
    setRightSidebarOpen(!isMobile);
  }, [isMobile]);

  const [searchText, setSearchText] = useState("");

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }
  const handleCardClick = () => {
    console.log("Card clicked");
  };

  const handleBackClick = () => {
    console.log("Back button clicked");
  };

  return (
    <Root
      header={
        <DemoHeader
          leftSidebarToggle={(ev) => {
            setLeftSidebarOpen(!leftSidebarOpen);
          }}
          rightSidebarToggle={(ev) => {
            setRightSidebarOpen(!rightSidebarOpen);
          }}
        />
      }
      content={<DemoContent />}
      leftSidebarOpen={leftSidebarOpen}
      leftSidebarOnClose={() => {
        setLeftSidebarOpen(false);
      }}
      // leftSidebarContent={<DemoSidebar />}
      rightSidebarOpen={rightSidebarOpen}
      // rightSidebarOnClose={() => {
      //   setRightSidebarOpen(false);
      // }}
      // // rightSidebarContent={<DemoSidebar />}
      scroll="content"
    />
  );
}

export default PerformanceReviewDetails;
