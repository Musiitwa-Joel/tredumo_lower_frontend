import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import { Backdrop, CircularProgress, Tooltip } from "@mui/material";
import { darken, styled, alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import { motion } from "framer-motion";
import clsx from "clsx";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ADVERTISED_COURSES } from "../../../graphql/queries";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdvertisedCourses,
  selectAdvertisedCoursesInput,
  selectRunningAdmission,
  selectSelectedCourseRight,
  setAdvertisedCourses,
  setAdvertisedCoursesInput,
  setSelectedCourseRight,
} from "../../../admissionsSlice";
import _ from "lodash";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import Delete from "@mui/icons-material/Delete";
import { REMOVE_ADVERTISED_COURSE } from "../../../graphql/mutations";
// import { updateCreateModuleModalOpen } from "../../../store/progAndCoursesSlice";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(0, 1, 0, 1),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const searchCourses = (data, searchInput) => {
  if (_.isEmpty(searchInput)) {
    return data;
  }

  const lowercasedInput = _.toLower(searchInput);

  return _.filter(
    data,
    (course) =>
      _.includes(_.toLower(course.course_code), lowercasedInput) ||
      _.includes(_.toLower(course.course_title), lowercasedInput)
  );
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

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
  { id: "progcode", label: "Program Code", minWidth: 10 },
  {
    id: "title",
    numeric: false,
    // disablePadding: true,
    label: "Program Title",
  },
  {
    id: "study_time",
    numeric: false,
    disablePadding: false,
    label: "Study Time",
  },
  {
    id: "duration",
    numeric: false,
    disablePadding: false,
    label: "Duration",
  },
];

const rows = [
  //   {
  //     id: 1,
  //     progcode: "BCS",
  //     progtitle: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
  //     school_code: "SBA",
  //     duration: 3,
  //     level: "BACHELOR",
  //     study_time: "DAY, WEEKEND",
  //     admission_level: "UNDERGRADUATE",
  //   },
  //   {
  //     id: 2,
  //     progcode: "BCS",
  //     progtitle: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
  //     school_code: "SBA",
  //     duration: 3,
  //     level: "BACHELOR",
  //     study_time: "DAY, WEEKEND",
  //     admission_level: "UNDERGRADUATE",
  //   },
  //   {
  //     id: 3,
  //     progcode: "BCS",
  //     progtitle: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
  //     school_code: "SCI",
  //     duration: 3,
  //     level: "BACHELOR",
  //     study_time: "DAY, WEEKEND",
  //     admission_level: "UNDERGRADUATE",
  //   },
  //   {
  //     id: 4,
  //     progcode: "BCS",
  //     progtitle: "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
  //     school_code: "SCI",
  //     duration: 3,
  //     level: "BACHELOR",
  //     study_time: "DAY, WEEKEND",
  //     admission_level: "UNDERGRADUATE",
  //   },
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
      <TableRow style={{ boxShadow: "inset 0px -1.5px red" }}>
        <TableCell
          padding="checkbox"
          style={{
            backgroundColor: "#DEEFF5",
            // borderBottomColor: "blue",
            // borderBottomWidth: 1.5,
            boxShadow: "inset 0px -1.5px blue",
          }}
        >
          <Checkbox
            // color="se"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
            style={{
              color: "blue",
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

function AdvertisedProgrammes() {
  const [loading, setLoading] = React.useState(true); // Step 2
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const selectedAdmission = useSelector(selectRunningAdmission);
  const advertisedCourses = useSelector(selectAdvertisedCourses);
  const selectedCourseRight = useSelector(selectSelectedCourseRight);
  const advertisedCoursesInput = useSelector(selectAdvertisedCoursesInput);

  const {
    error,
    loading: loadingAdvertisedCourses,
    data,
  } = useQuery(GET_ADVERTISED_COURSES, {
    notifyOnNetworkStatusChange: true,
    variables: {
      runningAdmissionId: selectedAdmission.id,
    },
  });

  const [
    removeAdvertisedCourse,
    { error: removeError, loading: removingAdvertisedCourse, data: removeRes },
  ] = useMutation(REMOVE_ADVERTISED_COURSE, {
    refetchQueries: ["getAdvertisedCourses"],
  });

  if (error) {
    dispatch(
      showMessage({
        message: error.message,
        variant: "error",
      })
    );
  }

  if (removeError) {
    dispatch(
      showMessage({
        message: removeError.message,
        variant: "error",
      })
    );
  }

  if (data) {
    // console.log("data", data);
    dispatch(setAdvertisedCourses(data.advertised_courses));
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

  const handleClick = (event, row) => {
    dispatch(setSelectedCourseRight(row === selectedCourseRight ? null : row));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  React.useEffect(() => {
    // Simulate loading delay (You can replace this with your actual data fetching logic)
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup function to clear the timeout if the component is unmounted
    return () => clearTimeout(delay);
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const menuOpen = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleRemove = async () => {
    let payload = {
      advertisedCourseId: selectedCourseRight.advertised_course_id,
      addedBy: user.user_id,
    };

    // console.log("payload", payload);

    const res = await removeAdvertisedCourse({
      variables: payload,
    });

    // console.log("the data", data);
    // console.log("the response", res.data);

    dispatch(setSelectedCourseRight(null));

    //   dispatch(updateGradingSystems(res.data.saveGrading));

    dispatch(
      showMessage({
        message: res.data.removeAdvertisedCourse.message,
        variant: "info",
      })
    );
  };

  //   console.log("advertised courses", advertisedCourses);

  return (
    <div>
      <motion.div variants={item}>
        <div className="flex-auto p-2 sm:p-0 h-full">
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
            <Box sx={{ width: "100%" }}>
              <Paper
                sx={{
                  width: "100%",
                  // backgroundColor: "#EEF7FF",
                  borderTopRightRadius: 0,
                  borderTopLeftRadius: 0,
                }}
              >
                {/* <EnhancedTableToolbar
                onAddUserButtonClick={handleClickOpen}
                numSelected={selected.length}
              /> */}

                {/* <Box sx={{ flexGrow: 1 }}> */}
                <AppBar
                  position="static"
                  style={{
                    padding: 0,
                  }}
                >
                  <Toolbar
                    style={{
                      // padding: 0,
                      // backgroundColor: "red",
                      //   padding: 0,
                      borderRadius: 0,
                      margin: 0,
                      minHeight: 50,
                    }}
                  >
                    <div
                      style={{
                        flexGrow: 1,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="inherit"
                        component="div"
                        noWrap
                        style={{
                          //   opacity: 0.7,
                          color: "white",
                        }}
                      >
                        Advertised Programmes
                      </Typography>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {selectedCourseRight &&
                        (removingAdvertisedCourse ? (
                          <CircularProgress
                            variant="indeterminate"
                            disableShrink
                            sx={{
                              color: "#fff",
                              animationDuration: "550ms",
                              marginRight: 1,
                            }}
                            size={18}
                            thickness={6}
                          />
                        ) : (
                          <Tooltip title="Remove Course">
                            <Delete
                              onClick={handleRemove}
                              style={{
                                // color: "red",
                                //   marginLeft: 10,
                                fontSize: 25,
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>
                        ))}

                      <Search>
                        <SearchIconWrapper>
                          <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                          placeholder="Search…"
                          value={advertisedCoursesInput}
                          onChange={(e) =>
                            dispatch(setAdvertisedCoursesInput(e.target.value))
                          }
                          inputProps={{ "aria-label": "search" }}
                        />
                      </Search>
                    </div>
                  </Toolbar>
                </AppBar>
                {/* </Box> */}

                <TableContainer
                  sx={{
                    height: "calc(100vh - 190px)",
                    position: "relative",
                  }}
                >
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={"small"}
                    stickyHeader
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
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
                      open={loadingAdvertisedCourses}
                      // onClick={handleClose}
                    >
                      <CircularProgress color="inherit" />
                    </Backdrop>
                    <TableBody>
                      {searchCourses(
                        advertisedCourses,
                        advertisedCoursesInput
                      ).map((row, index) => {
                        const isItemSelected =
                          selectedCourseRight &&
                          row.id === selectedCourseRight.id;
                        // const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          // Render child rows with your existing logic
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
                              className="text-16"
                              id={labelId}
                              scope="row"
                              padding="none"
                              style={{
                                border: "1px solid #ddd",
                                // padding: "8px",
                                paddingLeft: 10,
                                paddingRight: 10,
                                textAlign: "left",
                              }}
                            >
                              {row.course_code}
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              className="text-16"
                              scope="row"
                              padding="none"
                              style={{
                                border: "1px solid #ddd",
                                // padding: "8px",
                                paddingLeft: 10,
                                whiteSpace: "nowrap",
                                paddingRight: 10,
                                textAlign: "left",
                              }}
                            >
                              {row.course_title}
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
                              {JSON.parse(null)}
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
                              {row.course_duration}
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
                {/* <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
              </Paper>
            </Box>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

export default AdvertisedProgrammes;
