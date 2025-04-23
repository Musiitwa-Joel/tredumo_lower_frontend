import React, { useEffect, useMemo } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Box } from "@mui/system";
import { lighten, darken, alpha } from "@mui/material/styles";
import { FixedSizeList as List } from "react-window";
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
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { TableVirtuoso } from "react-virtuoso";
import { useDispatch, useSelector } from "react-redux";
// import {
//   updateAllCourses,
//   updateDownloadProgrammesModalOpen,
// } from "../../store/progAndCoursesSlice";
// import "./programs.css";

import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

import { Button } from "@mui/material";
import { Download } from "@mui/icons-material";
import { useMutation, useQuery } from "@apollo/client";
import { updateAdmitStdsModalOpen } from "app/store/admissionsSlice";
import { ADMIT_PHD_STDS } from "app/theme-layouts/layout3/graphql/mutations";
// import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
// import { GET_ALL_COURSES } from "../../gql/queries";

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
    id: "form_no",
    label: "Form No",
    minWidth: 10,
    dataKey: "course_code",
  },
  {
    id: "name",
    numeric: false,
    // disablePadding: true,
    label: "Name",
    dataKey: "course_title",
  },

  {
    id: "admitted",
    numeric: false,
    disablePadding: false,
    label: "Admitted",
    minWidth: 20,
    dataKey: "school_code",
  },
  {
    id: "progcode",
    numeric: false,
    disablePadding: false,
    label: "Course Code",
    minWidth: 10,
  },
  {
    id: "progcode",
    numeric: false,
    disablePadding: false,
    label: "Course title",
    minWidth: 10,
  },
];

const rows = [];

const initialRequirementState = {
  departments: [],
  grading: [],
  levels: [],
};

const TableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => <Table {...props} style={{ borderCollapse: "separate" }} />,
  // TableHead: TableHead,
  // TableRow: TableRow,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function AdmitStdsModal() {
  // load active user
  const user = useSelector((state) => state.user.user);

  // const [stdsToBeAdmitted, setStdsToBeAdmitted] = useState();

  const { admitStdsModalOpen, studeentToBeAdmitted } = useSelector(
    (state) => state.admissions
  );
  const dispatch = useDispatch();

  const getRowHeight = (index) => 48;

  // console.log("studeentToBeAdmitted", studeentToBeAdmitted);

  const [
    admitPhdStdsMutation,
    { error: admitErr, loading: admittingStds, data: phdMutationResponse },
  ] = useMutation(ADMIT_PHD_STDS, {
    refetchQueries: ["GetApplicantForms"],
  });

  if (admitErr) {
    return alert("Error " + admitErr.message);
  }

  const admitPhdStds = async () => {
    const stds = studeentToBeAdmitted.map((std) => ({
      applicantId: std.applicant_id,
      program_id: std.prog_choices[0].id,
      schemeId: std.scheme_id,
    }));

    const payload = {
      stds: stds,
      admittedBy: user.biodata.id,
    };

    console.log("students to be submitted", payload);
    admitPhdStdsMutation({
      variables: payload,
    }).then((res) => {
      // setAdmissionModel(false);
      dispatch(updateAdmitStdsModalOpen(false));
      // toast.success(res.data.admit_students.message);
      console.log(res);
    });
    // structure the data am sending
    // setPhdDialog(false);
    // setSelectedRows([]);
    toast.success("Students Admitted successfully");
  };
  //   console.log("Admissions moal", admitStdsModalOpen);

  //   const { error, loading, data } = useQuery(GET_ALL_COURSES);

  //   if (error) {
  //     alert(error.message);
  //   }

  // Memoize the courses data
  //   const memoizedCourses = useMemo(() => data?.courses, [data?.courses]);

  //   useEffect(() => {
  //     if (memoizedCourses && memoizedCourses.length > 0) {
  //       // Use batch updates or similar strategy here if necessary
  //       dispatch(updateAllCourses(memoizedCourses));
  //     }
  //   }, [memoizedCourses, dispatch]);

  //   const updateAllCoursesMemoized = useMemo(() => {
  //     return () => dispatch(updateAllCourses(data.courses));
  //   }, [data.courses]);

  //   useEffect(() => {
  //     if (data) {
  //       updateAllCoursesMemoized();
  //     }
  //   }, [data, updateAllCoursesMemoized]);
  //   console.log("all courses--", allCourses);

  //   useEffect(() => {
  //     if (data) {
  //       //   console.log("all courses", data.courses);
  //       dispatch(updateAllCourses(data.courses));
  //     }
  //   }, [data]);

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //   const downloadExcel = () => {
  //     const wb = XLSX.utils.book_new();
  //     const wsData = [
  //       ["All Courses"],
  //       [
  //         "Programme Code",
  //         "Programme Title",
  //         "School Code",
  //         "School Title",
  //         "Department Code",
  //         "Department Title",
  //         "Duration",
  //       ],
  //     ];

  //     // Flatten all departments into a single array of rows
  //     const allRows = allCourses.map((_c) => {
  //       return [
  //         _c.course_code,
  //         _c.course_title,
  //         _c.school.school_code,
  //         _c.school.school_title,
  //         _c.department ? _c.department.dpt_code : "",
  //         _c.department ? _c.department.dpt_title : "",
  //         _c.course_duration,
  //       ];
  //     });

  //     // Append all rows to wsData
  //     wsData.push(...allRows);

  //     // Convert wsData to worksheet
  //     const ws = XLSX.utils.aoa_to_sheet(wsData);

  //     // Append the worksheet to the workbook
  //     XLSX.utils.book_append_sheet(wb, ws, "Courses");

  //     // Save the workbook as an Excel file
  //     XLSX.writeFile(wb, "All Courses.xlsx");
  //   };

  //   console.log("all columns", columns);

  return (
    <div>
      <Dialog
        maxWidth="xl"
        open={admitStdsModalOpen}
        // onClose={() => dispatch(updateCreateModuleModalOpen(false))}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
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
              Admit Students
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
                  // dispatch(updateDepartment(defaultValues));
                  dispatch(updateAdmitStdsModalOpen(false));
                }}
              />
            </Tooltip>
          </Box>
          <div
            style={{
              padding: 5,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              // onClick={downloadExcel}
            >
              <Download
                style={{
                  marginRight: 5,
                }}
              />
              Download
            </Button>
          </div>

          {/* <VirtualizedTable columns={columns} allCourses={allCourses} /> */}
          {/* <ReactWindowTable data={allCourses} columns={columns} /> */}
          <TableContainer
            style={{
              borderWidth: 1,
              borderColor: "lightgray",
              borderTopColor: "blue",
              borderTopWidth: 1.5,
            }}
          >
            <FuseScrollbars className={`custom-scroll-table-modal-download`}>
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
                <Backdrop
                  sx={{
                    color: "#fff",
                    position: "absolute",
                    left: 0,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  //   open={loading}
                  // onClick={handleClose}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>

                <TableVirtuoso
                  style={{ height: 400, width: 650 }}
                  data={studeentToBeAdmitted}
                  // components={TableComponents}
                  fixedHeaderContent={() => (
                    <TableRow>
                      {columns.map((headCell) => (
                        <TableCell
                          key={headCell.id}
                          align={headCell.numeric ? "right" : "left"}
                          padding={headCell.disablePadding ? "none" : "normal"}
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
                            direction={orderBy === headCell.id ? order : "asc"}
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
                        {row.form_no}
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
                        {row.surname + " " + row.other_names}
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
                        {row.admitted}
                      </TableCell>

                      <TableCell
                        align="right"
                        className="text-16 no-wrap"
                        style={{
                          border: "1px solid #ddd",
                          // padding: "8px",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.prog_choices[0].program.course_code}
                      </TableCell>

                      <TableCell
                        align="right"
                        className="text-16 no-wrap"
                        style={{
                          border: "1px solid #ddd",
                          // padding: "8px",
                          textAlign: "left",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.prog_choices[0].program.program}
                      </TableCell>
                    </>
                  )}
                />
              </Table>
            </FuseScrollbars>
          </TableContainer>
          <div
            style={{ display: "flex", justifyContent: "flex-end", padding: 5 }}
          >
            <Button
              variant="contained"
              color="primary"
              // disabled={extractedata.length == 0 ? true : false}
              onClick={admitPhdStds}
            >
              {admittingStds ? (
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
                "Admit"
              )}
            </Button>
          </div>
        </Card>
      </Dialog>
    </div>
  );
}

export default AdmitStdsModal;
