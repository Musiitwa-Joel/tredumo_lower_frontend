import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";

import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { lighten, styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import DemoSidebar from "./shared-components/DemoSidebar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery, useSuspenseQuery } from "@apollo/client";
import {
  GET_APPLICANT_REQS,
  GET_PROGRAM_CHOICES,
} from "app/theme-layouts/layout3/graphql/queries";
// import {
//   applicantReqsLoaded,
//   saveProgramChoices,
// } from "app/store/admissions/applicantsSlice";
import {
  updateAccYr,
  updateIntake,
  updateScheme,
} from "app/store/admissionsSlice";
// import DataTable from "./shared-components/DataTable";
import AdmittedFillForm from "./AdmittedFillForm";
import AdmittedStdsDataTable from "./shared-components/AdmittedStdsDataTable";

const Admitted = React.memo(function Admitted() {
  const appExistsInTaskBar = useSelector((state) => state.apps.exists);
  const [
    getProgramChoices,
    {
      loading: progChoiceLoading,
      error: progChoiceError,
      data: progChoiceData,
      refetch,
    },
  ] = useLazyQuery(GET_PROGRAM_CHOICES);

  // const [acc_yr, setAccYr] = React.useState("");
  // const [scheme, setScheme] = React.useState("");
  // const [intake, setIntake] = React.useState("");

  const { scheme, acc_yr, intake } = useSelector(
    (state) => state.admissions.module_state
  );
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const location = useLocation();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const handleChange = (event) => {
    dispatch(updateAccYr(event.target.value));
  };
  const handleChangeScheme = (event) => {
    dispatch(updateScheme(event.target.value));
  };

  const handleChangeIntake = (event) => {
    dispatch(updateIntake(event.target.value));
  };

  // if (loading) return console.log("loading...");
  // if (error) {
  //   return console.log("errorr", error);
  // }

  if (progChoiceError) {
    return console.log("prog error", progChoiceError.message);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    setLeftSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
    }
  }, [location, isMobile]);
  return (
    <>
      <div>
        <AdmittedFillForm />
      </div>
      <div
        style={{
          height: "calc(100vh - 152px)",
        }}
      >
        <PanelGroup direction="horizontal">
          <Panel
            defaultSize={20}
            minSize={15}
            style={{
              backgroundColor: "#fff",
              marginLeft: 10,
              borderColor: "lightgray",
              borderWidth: 1,
            }}
          >
            <DemoSidebar isRefetching={progChoiceLoading} />
          </Panel>
          <PanelResizeHandle
            style={{
              // width: 1,
              backgroundColor: "lightgray",
              // opacity: 0.6,
            }}
          />
          <Panel minSize={65}>
            <AdmittedStdsDataTable />
            {/* <TestTable /> */}
          </Panel>
        </PanelGroup>
      </div>
    </>
  );
});

export default Admitted;
