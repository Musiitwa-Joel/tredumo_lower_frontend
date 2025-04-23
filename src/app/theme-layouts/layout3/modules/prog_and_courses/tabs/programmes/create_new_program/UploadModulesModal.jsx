import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import { lighten, darken, alpha } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import Close from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import Card from "@mui/material/Card";
import clsx from "clsx";
import FuseScrollbars from "@fuse/core/FuseScrollbars";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { TableVirtuoso } from "react-virtuoso";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import "../programs.css";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import Snackbar from "@mui/material/Snackbar";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Alert from "@mui/material/Alert";
import * as XLSX from "xlsx";
import CircularProgress, {
  circularProgressClasses,
} from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { gql, useMutation, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectUploadModulesModalOpen,
  setUploadModulesModalOpen,
} from "../../../store/progAndCoursesSlice";
import { UPLOAD_COURSE_UNITS } from "../../../gql/mutations";
import { url2 } from "app/configs/apiConfig";

const duration_measures = [
  {
    id: "1",
    title: "YEARS",
  },
  {
    id: "2",
    title: "MONTHS",
  },
];

const GET_UPLOAD_REQUIREMENTS = gql`
  query getProgUploadRequirements {
    grading {
      grading_title
      description
    }
  }
`;

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));
const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "1.8rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const columns = [
  { id: "#", label: "#", minWidth: 10 },
  {
    id: "module_code",
    numeric: false,
    disablePadding: false,
    label: "Module Code",
  },
  { id: "module_title", label: "Module Title", minWidth: 10 },
  {
    id: "course_code",
    numeric: false,
    // disablePadding: true,
    label: "Course Code",
  },

  {
    id: "course_version",
    numeric: false,
    disablePadding: false,
    label: "Course Version",
    minWidth: 20,
  },
  {
    id: "credit_units",
    numeric: false,
    disablePadding: false,
    label: "Credit Units",
    minWidth: 10,
  },
  {
    id: "module_year",
    numeric: false,
    disablePadding: false,
    label: "Module Year",
    minWidth: 10,
  },
  {
    id: "module_sem",
    numeric: false,
    disablePadding: false,
    label: "Module Sem",
    minWidth: 10,
  },
  {
    id: "module_level",
    numeric: false,
    disablePadding: false,
    label: "Module Level",
    minWidth: 10,
  },
  {
    id: "graading",
    numeric: false,
    disablePadding: false,
    label: "Grading",
  },
];

const rows = [];

const expectedFields = {
  module_code: "",
  module_title: "",
  course_code: "",
  course_version: "",
  credit_units: 0,
  module_level: "",
  grading_id: "",
  module_year: "",
  module_sem: "",
};

const filterFields = (obj, fields) => {
  return Object.keys(fields).reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    } else {
      acc[key] = fields[key]; // or you can use acc[key] = null; if you want to set missing keys to null
    }
    return acc;
  }, {});
};

function FacebookCircularProgress() {
  return (
    <Box sx={{ position: "relative", alignSelf: "center" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) =>
            theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={25}
        thickness={4}
        // {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) =>
            theme.palette.mode === "light" ? "#4f46e5" : "#4f46e5",
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={25}
        thickness={4}
        // {...props}
      />
    </Box>
  );
}

const initialRequirementState = {
  departments: [],
  grading: [],
  levels: [],
};

function UploadModulesModal() {
  const uploadModulesModalOpen = useSelector(selectUploadModulesModalOpen);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = React.useState("panel4");
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const { error, loading, data } = useQuery(GET_UPLOAD_REQUIREMENTS);
  const [
    uploadCourseUnits,
    { error: uploadError, loading: uploadingCourseUnits, data: uploadResponse },
  ] = useMutation(UPLOAD_COURSE_UNITS, {
    refetchQueries: ["getCourseUnits"],
  });

  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [extractedata, setExtractedData] = useState([]);
  const [reqs, setReqs] = useState(initialRequirementState);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);

  useEffect(() => {
    if (data) {
      //   console.log("data....", data);
      setReqs(data);
    }
  }, [data]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  useEffect(() => {
    if (uploadError) {
      dispatch(
        showMessage({
          message: uploadError.message,
          variant: "error",
        })
      );
    }
  }, [uploadError]);

  const handleUpload = async () => {
    console.log("extracted Data", extractedata);
    const res = await uploadCourseUnits({
      variables: {
        courseUnits: extractedata,
      },
    });

    // console.log("response", res.data);

    // // if its successfull
    setExtractedData([]);

    dispatch(
      showMessage({
        message: res.data.uploadCourseUnits.message,
        variant: "success",
      })
    );
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
      setFile(event.target.files[0]);
    }
  };

  const convertExcelToJson = async () => {
    console.log("extracting...");
    if (!file) {
      setSnackBarOpen(true);
      setMessage("No File Selected!");
      return;
    }

    setIsConverting(true);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      //   console.log("json data", jsonData);
      const filteredData = jsonData.map((item) =>
        filterFields(item, expectedFields)
      );
      setIsConverting(false);

      //   console.log("filtered Data", filteredData);
      setExtractedData(filteredData);
      //   dispatch(updateExtractedData(jsonData));
    };
  };

  const handleDownloadExcel = () => {
    window.location.href = `${url2}/templates/upload-modules-template.xlsx`;
  };

  //   console.log("createModuleModalOpen", createModuleModalOpen);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackBarOpen(false);
  };

  return (
    <div>
      <Dialog
        maxWidth="lg"
        open={uploadModulesModalOpen}
        // onClose={() => dispatch(updateCreateModuleModalOpen(false))}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        style={{
          zIndex: 100000,
        }}
      >
        <Card
          className={clsx("", "shadow")}
          sx={{
            backgroundColor: (theme) =>
              darken(
                theme.palette.background.paper,
                theme.palette.mode === "light" ? 0.01 : 0.1
              ),
          }}
        >
          <Box
            sx={{
              backgroundColor: "#1e293b",
            }}
            className="p-10"
            id="draggable-dialog-title"
            style={{
              paddingLeft: 15,
              display: "flex",
              justifyContent: "space-between",
              cursor: "move",
            }}
          >
            <Typography
              variant="h6"
              color="inherit"
              component="div"
              style={{
                //   opacity: 0.7,
                color: "white",
              }}
            >
              Upload Modules
            </Typography>

            <Tooltip title="Close">
              <Close
                style={{
                  color: "white",
                  fontSize: 25,
                  cursor: "pointer",
                  //  marginRight: 10,
                }}
                onClick={() => {
                  dispatch(setUploadModulesModalOpen(false));
                }}
              />
            </Tooltip>
          </Box>
          <div
            style={{
              padding: 10,
            }}
          >
            <Grid
              container
              rowSpacing={1}
              spacing={1}
              sx={{
                marginBottom: 1,
              }}
            >
              <Grid xs={8}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    value={fileName}
                    label="Selected File"
                    style={{
                      maxWidth: 400,
                    }}
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ flex: 1 }}
                  />
                  <Button variant="contained" component="label">
                    Browse
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>
                  <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    disabled={!file ? true : false}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 70,
                    }}
                    onClick={convertExcelToJson}
                  >
                    {isConverting ? <FacebookCircularProgress /> : "Extract"}
                  </Button>
                </Box>
              </Grid>
              <Grid xs={4}>
                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  onClick={handleDownloadExcel}
                >
                  Download Template
                </Button>
              </Grid>
            </Grid>

            <Grid
              container
              rowSpacing={1}
              spacing={1}
              sx={{
                marginBottom: 1,
              }}
            >
              <Grid xs={8}>
                <TableContainer
                  style={{
                    borderWidth: 1,
                    borderColor: "lightgray",
                    borderTopColor: "blue",
                    borderTopWidth: 1.5,
                    overflowX: "hidden",
                  }}
                >
                  <Table
                    // sx={{ minWidth: 1000 }}
                    aria-labelledby="tableTitle"
                    size={"small"}
                    stickyHeader
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      position: "relative",
                    }}
                    aria-label="sticky table"
                  >
                    <Backdrop
                      sx={{
                        color: "#fff",
                        position: "absolute",
                        left: 0,
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                      }}
                      //   open={uploadingCourses}
                      // onClick={handleClose}
                    >
                      <CircularProgress color="inherit" />
                    </Backdrop>
                    {/* <FuseScrollbars className={`custom-scroll-table-modal`}> */}
                    <TableVirtuoso
                      style={{ height: 365, width: 750 }}
                      data={extractedata}
                      // components={TableComponents}
                      fixedHeaderContent={() => (
                        <TableRow>
                          {columns.map((headCell) => (
                            <TableCell
                              key={headCell.id}
                              align={headCell.numeric ? "right" : "left"}
                              padding={
                                headCell.disablePadding ? "none" : "normal"
                              }
                              sortDirection={
                                orderBy === headCell.id ? order : false
                              }
                              style={{
                                // border: "1px solid #ddd",
                                // padding: "8px",
                                backgroundColor: "#DEEFF5",
                                whiteSpace: "nowrap",
                                textAlign: "left",
                                color: "blue",
                                // borderBottomColor: "blue",
                                // borderBottomWidth: 1.5,
                                boxShadow: "inset 0px -1.5px blue",
                                // opacity: 0.7,
                                fontSize: 13,
                              }}
                            >
                              <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={
                                  orderBy === headCell.id ? order : "asc"
                                }
                                // onClick={createSortHandler(headCell.id)}
                              >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                  <Box component="span" sx={visuallyHidden}>
                                    {order === "desc"
                                      ? "sorted descending"
                                      : "sorted ascending"}
                                  </Box>
                                ) : null}
                              </TableSortLabel>
                            </TableCell>
                          ))}
                        </TableRow>
                      )}
                      itemContent={(index, row) => (
                        <>
                          <TableCell
                            component="th"
                            // id={labelId}
                            scope="row"
                            padding="none"
                            className="text-16"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              paddingLeft: 10,
                              paddingRight: 10,
                              textAlign: "left",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {index + 1}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="text-16"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            {row.module_code}
                          </TableCell>
                          <TableCell
                            component="th"
                            // id={labelId}
                            scope="row"
                            padding="none"
                            className="text-16"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              paddingLeft: 10,
                              paddingRight: 10,
                              textAlign: "left",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.module_title}
                          </TableCell>
                          <TableCell
                            component="th"
                            // id={labelId}
                            scope="row"
                            padding="none"
                            className="text-16"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              paddingLeft: 10,
                              textAlign: "left",
                              whiteSpace: "nowrap",
                              paddingRight: 10,
                            }}
                          >
                            {row.course_code}
                          </TableCell>

                          <TableCell
                            align="right"
                            className="text-16"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            {row.course_version}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            align="right"
                            className="text-16"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            {row.credit_units}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="text-16"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            {row.module_year}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="text-16"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            {row.module_sem}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="text-16"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            {row.module_level}
                          </TableCell>
                          <TableCell
                            align="right"
                            className="text-16"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            {row.grading_id}
                          </TableCell>
                        </>
                      )}
                    />
                    {/* </FuseScrollbars> */}
                  </Table>
                </TableContainer>
              </Grid>
              <Grid xs={4}>
                <div
                  style={{
                    marginBottom: 5,
                  }}
                >
                  <Typography
                    className="text-20 font-semibold"
                    style={{
                      color: "red",
                    }}
                  >
                    Instructions
                  </Typography>
                  <span
                    className="text-14"
                    style={{
                      color: "dodgerblue",
                    }}
                  >
                    *Use the information below to fill the parameters in the
                    excel files*
                  </span>
                </div>

                <Accordion
                  expanded={expanded === "panel4"}
                  onChange={handleChange("panel4")}
                >
                  <AccordionSummary
                    aria-controls="panel3d-content"
                    id="panel3d-header"
                  >
                    <Typography className="text-16 font-semibold ">
                      GRADING
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    style={{
                      padding: 0,
                    }}
                  >
                    <TableContainer>
                      <FuseScrollbars
                        className={`custom-scroll-height-accordation`}
                      >
                        <Table
                          // sx={{ minWidth: 1000 }}
                          aria-labelledby="tableTitle"
                          size={"small"}
                          stickyHeader
                          style={{
                            borderCollapse: "collapse",
                            width: "100%",
                          }}
                          aria-label="sticky table"
                        >
                          <TableBody>
                            <>
                              {reqs.grading.map((row, index) => {
                                // const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                return (
                                  // Render child rows with your existing logic
                                  <TableRow
                                    hover
                                    onClick={(event) => {
                                      // handleClick(event, row.id)
                                    }}
                                    role="checkbox"
                                    // aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row.grading_title}
                                    // selected={isItemSelected}
                                    sx={{ cursor: "pointer" }}
                                  >
                                    <TableCell
                                      component="th"
                                      id={labelId}
                                      scope="row"
                                      className="text-16 font-semibold"
                                      padding="none"
                                      style={{
                                        border: "1px solid #ddd",
                                        padding: "8px",
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        textAlign: "left",
                                        opacity: 0.7,
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {row.grading_title}
                                    </TableCell>
                                    <TableCell
                                      component="th"
                                      className="text-16 font-semibold"
                                      id={labelId}
                                      scope="row"
                                      padding="none"
                                      style={{
                                        border: "1px solid #ddd",
                                        padding: "8px",
                                        paddingLeft: 10,
                                        opacity: 0.7,
                                        textAlign: "left",
                                        whiteSpace: "nowrap",
                                        paddingRight: 10,
                                      }}
                                    >
                                      {row.description}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </>
                          </TableBody>
                        </Table>
                      </FuseScrollbars>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </Grid>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                disabled={extractedata.length == 0 ? true : false}
                onClick={handleUpload}
              >
                {uploadingCourseUnits ? (
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
                  "Upload"
                )}
              </Button>
            </div>
          </div>
        </Card>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%", zIndex: 9999999999999999999999999 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default UploadModulesModal;
