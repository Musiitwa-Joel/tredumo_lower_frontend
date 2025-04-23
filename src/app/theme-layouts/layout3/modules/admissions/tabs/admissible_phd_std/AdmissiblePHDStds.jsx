import React, { useState, useEffect } from "react";

import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { useLazyQuery, useSuspenseQuery } from "@apollo/client";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { purple } from "@mui/material/colors";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import Select from "@mui/material/Select";
import { lighten, styled } from "@mui/material/styles";
import {
  GET_ADMISSIBLE_PHD_STDS,
  GET_APPLICANT_REQS,
} from "app/theme-layouts/layout3/graphql/queries";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "./sub_components/Header";
import AdmissiblePHDstdTable from "./sub_components/AdmissiblePHDstdTable";

const Root = styled(FusePageCarded)(({ theme }) => ({
  "& .FusePageCarded-header": {},
  "& .FusePageCarded-wrapper": {},
  "& .FusePageCarded-leftSidebar": {},
  "& .description": {
    fontSize: 20,
    marginBottom: 40,
  },
}));

function AdmissiblePHDStds() {
  const { loading, error, data } = useSuspenseQuery(GET_APPLICANT_REQS);
  const [
    getAdmissiblePHDStds,
    {
      loading: admissiblePhdStdsLoading,
      error: admissiblePhdStdsError,
      data: admissiblePhdStdsData,
    },
  ] = useLazyQuery(GET_ADMISSIBLE_PHD_STDS);
  const [acc_yr, setAccYr] = React.useState("");
  const [scheme, setScheme] = React.useState("");
  const [intake, setIntake] = React.useState("");
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const location = useLocation();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
  const [selectedRows, setSelectedRows] = useState([]);
  const handleChange = (event) => {
    setAccYr(event.target.value);
  };
  const handleChangeScheme = (event) => {
    setScheme(event.target.value);
  };

  const handleChangeIntake = (event) => {
    setIntake(event.target.value);
  };
  // const { applicantReqs } = useSelector((state) => state.applicantsSlice);

  // if (loading) return console.log("loading...");
  if (error) {
    return console.log("errorr", error);
  }

  if (admissiblePhdStdsError) {
    alert("Error fetching the admissible stds");
    return console.log("errorr", error);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    setLeftSidebarOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setLeftSidebarOpen(false);
    }
  }, [location, isMobile]);

  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: "#4f46e6",
    "&:hover": {
      backgroundColor: "#4f46e6",
    },
  }));

  return (
    <Root
      header={
        <>
          <div className="flex py-6 px-4 md:px-0 h-full w-full">
            {/* <IconButton
              onClick={(ev) => setLeftSidebarOpen(!leftSidebarOpen)}
              aria-label="toggle left sidebar"
              size="large"
            >
              <FuseSvgIcon>heroicons-outline:view-list</FuseSvgIcon>
            </IconButton> */}
            <div className="flex flex-1 px-8 py-8 lg:px-12">
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={2}>
                  <FormControl
                    fullWidth
                    size="small"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Acc Yr
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={acc_yr}
                      label="Acc_yr"
                      onChange={handleChange}
                    >
                      {data ? (
                        data.acc_yrs.map((acc) => (
                          <MenuItem value={acc.acc_yr_name}>
                            {acc.acc_yr_name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={""}>{"_"}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid item xs={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      Scheme
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={scheme}
                      label="Scheme"
                      onChange={handleChangeScheme}
                    >
                      {data ? (
                        data.schemes.map((acc) => (
                          <MenuItem value={acc.scheme_category_id}>
                            {acc.scheme_name}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value={""}>{"_"}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid> */}
                <Grid item xs={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      Intake
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={intake}
                      label="Intake"
                      onChange={handleChangeIntake}
                    >
                      {data ? (
                        data.intakes.map((acc) => (
                          <MenuItem value={acc.id}>{acc.intake_name}</MenuItem>
                        ))
                      ) : (
                        <MenuItem value={""}>{"_"}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <ColorButton
                    variant="contained"
                    disabled={acc_yr && intake && data ? false : true}
                    onClick={async () => {
                      console.log("data", {
                        intake,
                        acc_yr,
                      });
                      getAdmissiblePHDStds({
                        variables: {
                          accYr: acc_yr,
                          intakeId: intake,
                        },
                      }).then((res) => {
                        // console.log("result", res.data);

                        // selecting only those who passed
                        let newArr = [];
                        res.data.admissible_phd_applicants.map((applicant) => {
                          if (
                            applicant.pre_admission_marks[
                              applicant.pre_admission_marks.length - 1
                            ].passed &&
                            applicant.admitted == "false"
                          ) {
                            newArr.push(applicant);
                          }
                        });

                        setSelectedRows(newArr);

                        // dispatch(saveProgramChoices(res.data.program_choices));
                      });
                    }}
                  >
                    {admissiblePhdStdsLoading ? (
                      <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                          color: "#fff",
                          animationDuration: "550ms",
                        }}
                        size={18}
                        thickness={6}
                      />
                    ) : (
                      "LOAD"
                    )}
                  </ColorButton>
                </Grid>
              </Grid>
            </div>
          </div>
        </>
      }
      content={
        <div className="p-16 md:p-0  min-h-full flex flex-auto flex-col">
          <Header selectedRows={selectedRows} />
          <div className="flex flex-col px-16 flex-1 relative py-0">
            <Box
              className="w-full rounded-16 border p-0 flex flex-col h-full"
              sx={{
                flexGrow: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
            >
              {/* <DemoContent /> */}
              <AdmissiblePHDstdTable
                rows={
                  admissiblePhdStdsData
                    ? admissiblePhdStdsData.admissible_phd_applicants
                    : []
                }
              />
            </Box>
          </div>
        </div>
      }
      //   leftSidebarContent={
      //     <div className="px-0 py-8">{/* <DemoSidebar /> */}</div>
      //   }
      //   leftSidebarOpen={leftSidebarOpen}
      //   leftSidebarWidth={288}
      //   leftSidebarOnClose={() => {
      //     // setLeftSidebarOpen(false);
      //   }}
      scroll={"content"}
    />
  );
}

export default AdmissiblePHDStds;
