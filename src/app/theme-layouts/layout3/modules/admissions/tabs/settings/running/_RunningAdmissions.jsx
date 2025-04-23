import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { visuallyHidden } from "@mui/utils";
import Grid from "@mui/material/Grid";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import clsx from "clsx";
import {
  selectDeleteAdmissionDialogOpen,
  selectRunningAdmission,
  selectRunningAdmissions,
  setDeleteAdmissionDialogOpen,
  setManageProgramsModalVisible,
  setRunningAdmissions,
  setSelectedRunningAdmission,
  setStartAdmissionsModalVisible,
} from "../../../admissionsSlice";
import StartAdmissionsModal from "./StartAdmissionsModal";
import { Backdrop, CircularProgress } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { GET_RUNNING_ADMISSIONS } from "../../../graphql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import convertTimestampToDate from "app/theme-layouts/layout3/utils/convertTimestampToDate";
import checkSchemeStatus from "app/theme-layouts/layout3/utils/checkSchemeStatus";
import { DELETE_RUNNING_ADMISSION } from "../../../graphql/mutations";
import ManageProgramsModal from "./ManageProgramsModal";

const options = ["Admission Setup", "Delete Admissions"];

function createData(id, name, calories, fat, carbs, protein) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const rows = [
  {
    id: "February",
    scheme: "Certificates",
    acad_yr: "2022/2023",
    start_date: "22-10-06",
    end_date: "02-02-2024",
    no_of_forms: 2,
    status: "ongoing",
  },
  {
    id: "August",
    scheme: "Diploma Holders",
    acad_yr: "2022/2023",
    start_date: "22-11-15",
    end_date: "08-08-2024",
    no_of_forms: 3,
    status: "ended",
  },
  {
    id: "February",
    scheme: "Direct Entry",
    acad_yr: "2022/2023",
    start_date: "22-12-01",
    end_date: "02-03-2024",
    no_of_forms: 4,
    status: "ongoing",
  },
  {
    id: "August",
    scheme: "Mature Age Entry",
    acad_yr: "2022/2023",
    start_date: "23-01-10",
    end_date: "08-10-2024",
    no_of_forms: 5,
    status: "ended",
  },
  {
    id: "February",
    scheme: "Postgraduate",
    acad_yr: "2022/2023",
    start_date: "23-02-05",
    end_date: "02-05-2024",
    no_of_forms: 3,
    status: "ongoing",
  },
  {
    id: "August",
    scheme: "Certificates",
    acad_yr: "2022/2023",
    start_date: "23-03-20",
    end_date: "08-08-2024",
    no_of_forms: 4,
    status: "ended",
  },
  {
    id: "February",
    scheme: "Direct Entry",
    acad_yr: "2022/2023",
    start_date: "23-04-02",
    end_date: "02-07-2024",
    no_of_forms: 5,
    status: "ongoing",
  },
  {
    id: "August",
    scheme: "Diploma Holders",
    acad_yr: "2022/2023",
    start_date: "23-05-15",
    end_date: "08-10-2024",
    no_of_forms: 3,
    status: "ended",
  },
  {
    id: "February",
    scheme: "Postgraduate",
    acad_yr: "2022/2023",
    start_date: "23-06-01",
    end_date: "02-08-2024",
    no_of_forms: 4,
    status: "ongoing",
  },
  {
    id: "August",
    scheme: "Certificates",
    acad_yr: "2022/2023",
    start_date: "23-07-10",
    end_date: "08-12-2024",
    no_of_forms: 5,
    status: "ended",
  },
  {
    id: "February",
    scheme: "Mature Age Entry",
    acad_yr: "2022/2023",
    start_date: "23-08-20",
    end_date: "02-01-2025",
    no_of_forms: 3,
    status: "ongoing",
  },
  {
    id: "August",
    scheme: "Direct Entry",
    acad_yr: "2022/2023",
    start_date: "23-09-05",
    end_date: "08-02-2025",
    no_of_forms: 4,
    status: "ended",
  },
  {
    id: "February",
    scheme: "Postgraduate",
    acad_yr: "2022/2023",
    start_date: "23-10-15",
    end_date: "02-05-2025",
    no_of_forms: 5,
    status: "ongoing",
  },
  {
    id: "August",
    scheme: "Diploma Holders",
    acad_yr: "2022/2023",
    start_date: "23-11-01",
    end_date: "08-08-2025",
    no_of_forms: 3,
    status: "ended",
  },
  {
    id: "February",
    scheme: "Certificates",
    acad_yr: "2022/2023",
    start_date: "23-12-10",
    end_date: "02-10-2025",
    no_of_forms: 4,
    status: "ongoing",
  },
];

// Continue with more data as needed...

// const rows = [
//   createData(1, "Cupcake", 305, 3.7, 67, 4.3),
//   createData(2, "Donut", 452, 25.0, 51, 4.9),
//   createData(3, "Eclair", 262, 16.0, 24, 6.0),
//   createData(4, "Frozen yoghurt", 159, 6.0, 24, 4.0),
//   createData(5, "Gingerbread", 356, 16.0, 49, 3.9),
//   createData(6, "Honeycomb", 408, 3.2, 87, 6.5),
//   createData(7, "Ice cream sandwich", 237, 9.0, 37, 4.3),
//   createData(8, "Jelly Bean", 375, 0.0, 94, 0.0),
//   createData(9, "KitKat", 518, 26.0, 65, 7.0),
//   createData(10, "Lollipop", 392, 0.2, 98, 0.0),
//   createData(11, "Marshmallow", 318, 0, 81, 2.0),
//   createData(12, "Nougat", 360, 19.0, 9, 37.0),
//   createData(13, "Oreo", 437, 18.0, 63, 4.0),
// ];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const columns = [
  { id: "intake", label: "Intake", minWidth: 10 },
  {
    id: "scheme",
    numeric: false,
    // disablePadding: true,
    label: "Scheme",
  },
  {
    id: "acad_yr",
    numeric: false,
    disablePadding: false,
    label: "Acad. year",
  },
  {
    id: "start_date",
    numeric: false,
    disablePadding: false,
    label: "Start Date",
  },
  {
    id: "end_date",
    numeric: false,
    disablePadding: false,
    label: "End Date",
  },
  {
    id: "no_of_forms",
    numeric: false,
    disablePadding: false,
    label: "No. of forms",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              // border: "1px solid #ddd",
              // padding: "8px",
              textAlign: "left",
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const selectedAdmission = useSelector(selectRunningAdmission);

  const handleClickActions = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickMenu = (option) => {
    if (option == "Admission Setup") {
      //start admissions modal
      // console.log("start admissions...");

      dispatch(setSelectedRunningAdmission(null));
      dispatch(setStartAdmissionsModalVisible(true));
    } else if (option == "Delete Admissions") {
      // delete dialog pop up
      if (!selectedAdmission) {
        return dispatch(
          showMessage({
            message: "Please Select an admission",
            variant: "error",
          })
        );
      }
      dispatch(setDeleteAdmissionDialogOpen(true));
    }
    handleClose();
  };

  return (
    <Toolbar
      sx={{
        // pl: { sm: 2 },
        pr: { xs: 0, sm: 0 },
        pt: { xs: 0, sm: 0 },
        pb: { xs: 0, sm: 0 },
        // backgroundColor: "red",
        padding: 0,
        margin: 0,

        // ...(numSelected > 0 && {
        //   bgcolor: (theme) =>
        //     alpha(
        //       theme.palette.primary.main,
        //       theme.palette.action.activatedOpacity
        //     ),
        // }),
      }}
      style={{
        minHeight: 40,
        // height: 20,
      }}
    >
      <Grid container rowSpacing={1} spacing={1} columnSpacing={{ xs: 1 }}>
        <Grid item xs={0}>
          {/* <ButtonComponent /> */}
          <Button
            variant="contained"
            size="small"
            color="secondary"
            aria-controls={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={handleClickActions}
            style={{
              whiteSpace: "nowrap",
            }}
          >
            Actions
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {options.map((option, index) => (
              <MenuItem key={index} onClick={() => handleClickMenu(option)}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Grid>
        <Grid item xs={0}>
          <Button
            size="small"
            variant="contained"
            // color="secondary"
            onClick={() => {
              dispatch(setStartAdmissionsModalVisible(true));
            }}
            disabled={!selectedAdmission}
          >
            View/Edit Setup
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            size="small"
            variant="contained"
            disabled={!selectedAdmission}
            onClick={() => {
              if (!selectedAdmission) {
                return dispatch(
                  showMessage({
                    message: "Please select an admission",
                    variant: "error",
                  })
                );
              }
              dispatch(setManageProgramsModalVisible(true));
            }}
          >
            Manage Programs
          </Button>
        </Grid>
      </Grid>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function RunningAdmissions() {
  const [loading, setLoading] = React.useState(true);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();

  const running_admissions = useSelector(selectRunningAdmissions);
  const selectedAdmission = useSelector(selectRunningAdmission);
  const deleteAdmissionDialogOpen = useSelector(
    selectDeleteAdmissionDialogOpen
  );

  const {
    error,
    loading: loadingRunningAdmissions,
    data,
  } = useQuery(GET_RUNNING_ADMISSIONS, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    deleteRunningAdmission,
    { error: deleteErr, loading: deletingAdmission, data: deleteResponse },
  ] = useMutation(DELETE_RUNNING_ADMISSION, {
    refetchQueries: ["getRunningAdmissions"],
  });

  if (deleteErr) {
    dispatch(
      showMessage({
        message: deleteErr.message,
        variant: "error",
      })
    );
  }

  if (error) {
    dispatch(
      showMessage({
        message: error.message,
        variant: "error",
      })
    );
  }

  if (data) {
    console.log("data...", data);
    dispatch(setRunningAdmissions(data.running_admissions));
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  // console.log("running admissions", running_admissions);

  const handleClick = (event, row) => {
    // console.log("row...", row);
    // setSelectedRowId(id === selectedRowId ? null : id);
    // setSelected(id);
    // setSelected(row === selected ? null : row);
    dispatch(
      setSelectedRunningAdmission(row === selectedAdmission ? null : row)
    );
  };

  // const handleClick = (event, id) => {
  //   const selectedIndex = selected.indexOf(id);
  //   let newSelected = [];

  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, id);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseDialog = () => {
    dispatch(setDeleteAdmissionDialogOpen(false));
  };

  const handleDelete = async () => {
    // delete the setup
    dispatch(setDeleteAdmissionDialogOpen(false));

    const res = await deleteRunningAdmission({
      variables: {
        runningAdmissionId: selectedAdmission.id,
      },
    });

    // dispatch(updateSchools(groupByCollege(res.data.deleteSchool)));
    dispatch(setSelectedRunningAdmission(null));
    dispatch(
      showMessage({
        message: res.data.deleteRunningAdmission.message,
        variant: "info",
      })
    );
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(running_admissions, getComparator(order, orderBy))
        .slice
        // page * rowsPerPage,
        // page * rowsPerPage + rowsPerPage
        (),
    [order, orderBy, page, rowsPerPage, running_admissions]
  );

  React.useEffect(() => {
    // Simulate loading delay (You can replace this with your actual data fetching logic)
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup function to clear the timeout if the component is unmounted
    return () => clearTimeout(delay);
  }, []);

  return (
    <>
      <ManageProgramsModal />
      <motion.div variants={item}>
        <div className="flex-auto p-0 sm:p-0 h-full">
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#fff",
              borderBottomColor: "lightgray",
              borderLeftColor: "lightgray",
              borderRightColor: "lightgray",
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
            }}
          >
            {/* <Paper
              sx={{
                width: "100%",
                mb: 2,
                borderTopRightRadius: 0,
                borderTopLeftRadius: 0,
              }}
            > */}
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer
              sx={{ height: "calc(100vh - 300px)", position: "relative" }}
            >
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={"small"}
                stickyHeader
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  // position: "relative",
                }}
                aria-label="sticky table"
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />

                <Backdrop
                  sx={{
                    color: "#fff",
                    position: "absolute",
                    left: 0,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={loadingRunningAdmissions}
                  // onClick={handleClose}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
                <TableBody>
                  {visibleRows.map((row, index) => {
                    // const isItemSelected = isSelected(row.id);
                    const isItemSelected =
                      selectedAdmission && row.id === selectedAdmission.id;
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell
                          padding="checkbox"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            paddingLeft: 10,
                            textAlign: "left",
                          }}
                        >
                          {row.intake.intake_title}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            paddingLeft: 10,
                            textAlign: "left",
                          }}
                        >
                          {row.scheme.scheme_title}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.acc_yr.acc_yr_title}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {convertTimestampToDate(parseInt(row.start_date))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {convertTimestampToDate(parseInt(row.end_date))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.max_no_of_forms}
                        </TableCell>

                        <TableCell
                          component="th"
                          scope="row"
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {checkSchemeStatus(
                            parseInt(row.start_date),
                            parseInt(row.end_date)
                          ) == "running" ? (
                            <Typography
                              className={clsx(
                                "inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase",
                                "pending" &&
                                  "bg-green-100 text-green-800 dark:bg-green-600 dark:text-green-50",
                                "completed" &&
                                  "bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50"
                              )}
                              sx={{ "& svg": { margin: 0 } }}
                            >
                              running
                            </Typography>
                          ) : (
                            <Typography
                              className={clsx(
                                "inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase",
                                "pending" &&
                                  "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50",
                                "completed" &&
                                  "bg-red-50 text-red-800 dark:bg-red-600 dark:text-red-50"
                              )}
                              sx={{ "& svg": { margin: 0 } }}
                            >
                              stopped
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {/* </Paper> */}
          </Box>
        </div>

        <Dialog
          open={deleteAdmissionDialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{
              fontSize: 17,
            }}
          >
            {"Delete Admission"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description text-16"
              style={{
                fontSize: 15,
              }}
            >
              Are you sure you want to delete Admission?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button size="large" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button size="large" onClick={handleDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <StartAdmissionsModal />
      </motion.div>
    </>
  );
}

export default RunningAdmissions;
