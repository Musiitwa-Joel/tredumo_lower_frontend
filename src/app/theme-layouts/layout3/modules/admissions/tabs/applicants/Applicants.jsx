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
import ApplicantsFillForm from "./ApplicantsFillForm";
import AdmissionsDataTable from "./shared-components/AdmissionsDataTable";
import TestTable from "./shared-components/TestTable";

const acc_yrs = [
  {
    value: "2023/2024",
    label: "2023/2024",
  },
  {
    value: "2023/2024",
    label: "2023/2024",
  },
  {
    value: "2023/2024",
    label: "2023/2024",
  },
  {
    value: "2023/2024",
    label: "2023/2024",
  },
];

const schemes = [
  {
    value: "1",
    label: "DIRECT ENTRY",
  },
  {
    value: "2",
    label: "MATURE ENTRY",
  },
  {
    value: "3",
    label: "POST GRADUATE",
  },
];

const intakes = [
  {
    value: "FEB",
    label: "FEBRUARY",
  },
  {
    value: "AUG",
    label: "AUGUST",
  },
];

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: "#4f46e6",
  "&:hover": {
    backgroundColor: "#4f46e6",
  },
}));

const Applicants = React.memo(function Applicants() {
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
        <ApplicantsFillForm />
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
            style={
              {
                // width: 1,
                // backgroundColor: "lightgray",
                // opacity: 0.6,
              }
            }
          />
          <Panel minSize={65}>
            <AdmissionsDataTable />
            {/* <TestTable /> */}
          </Panel>
        </PanelGroup>
      </div>
    </>
  );
});

export default Applicants;
