import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import clsx from "clsx";
import { lighten } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import Divider from "@mui/material/Divider";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Delete, Edit, Refresh, Save } from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Modal } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
// import { GET_COLLEGES } from "../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
// import { updateCollege, updateColleges } from "../../store/collegeSlice";
import { NetworkStatus } from "@apollo/client";
import { LOAD_COURSE_ALIASES } from "../../../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  selectCreateNewCourse,
  selectSelectedCourseVersion,
  setSelectedAlias,
} from "../../../../store/progAndCoursesSlice";
import { DELETE_COURSE_ALIAS } from "../../../../gql/mutations";
const { confirm } = Modal;

const rows = [
  {
    id: "1",
    alias_code: "BBA",
    study_time: "DAY",
    campus: "MAIN",
  },
];

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
  { id: "id", label: "#", minWidth: 10 },
  {
    id: "college_code",
    numeric: false,
    // disablePadding: true,
    label: "Alias Code",
  },
  {
    id: "college_title",
    numeric: false,
    disablePadding: false,
    label: "Study Time",
  },
  {
    id: "campus",
    numeric: false,
    disablePadding: false,
    label: "Campus",
  },
  {
    id: "",
    numeric: false,
    disablePadding: false,
    label: "Action",
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
      <TableRow
        style={{
          backgroundColor: "lightblue",
          borderBottomColor: "blue",
          borderBottomWidth: 1.5,
        }}
      >
        {/* <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell> */}
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
              color: "blue",
              opacity: 0.7,
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

function DataTable() {
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dense, setDense] = React.useState(false);
  const selectedCourseVersion = useSelector(selectSelectedCourseVersion);
  const createNewCourse = useSelector(selectCreateNewCourse);
  const dispatch = useDispatch();
  const [aliases, setAliases] = useState([]);
  const [loadCourseAliases, { error, loading, data }] =
    useLazyQuery(LOAD_COURSE_ALIASES);

  const _loadCourseAliases = async (courseVersion) => {
    const res = await loadCourseAliases({
      variables: {
        courseId: courseVersion?.course.id,
      },
    });

    setAliases(res.data.course_aliases);
  };

  useEffect(() => {
    if (selectedCourseVersion && !createNewCourse) {
      _loadCourseAliases(selectedCourseVersion);
    } else {
      setAliases([]);
    }
  }, [selectedCourseVersion]);

  const [
    deleteCourseAlias,
    { error: deleteErr, loading: deletingAlias, data: aliasRes },
  ] = useMutation(DELETE_COURSE_ALIAS, {
    refetchQueries: ["loadCourseAliases"],
  });

  const showConfirm = (selected) => {
    confirm({
      title: `${selected.alias_code}`,
      // icon: <ExclamationCircleFilled />,
      content: "Do you want to delete this alias?",
      onOk() {
        // console.log("OK");
        deleteCourseAlias({
          variables: {
            aliasId: selected.id,
          },
        });
      },
      // onCancel() {
      //   console.log("Cancel");
      // },
      zIndex: 1000000,
      okText: "Yes",
    });
  };

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }

    if (deleteErr) {
      dispatch(
        showMessage({
          message: deleteErr.message,
          variant: "error",
        })
      );
    }
  }, [error, deleteErr]);
  // const { error, loading, data, refetch, networkStatus } = useQuery(
  //   GET_COLLEGES,
  //   {
  //     notifyOnNetworkStatusChange: true,
  //   }
  // );

  // const { colleges } = useSelector(
  //   (state) => state.progAndCoursesApp.collegeSlice
  // );

  // console.log("response", data);

  const visibleRows = React.useMemo(
    () =>
      stableSort(aliases, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, aliases]
  );
  const isSelected = (id) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  return (
    <div className="p-16">
      <Box
        className="w-full  border"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.9)
              : lighten(theme.palette.background.default, 0.02),
          overflow: "auto",
        }}
      >
        <div className="max-w-full relative">
          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 290px)",
              minHeight: "calc(100vh - 290px)",
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
                // onSelectAllClick={handleSelectAllClick}
                // onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <Backdrop
                sx={{
                  color: "#fff",
                  position: "absolute",
                  left: 0,
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading || deletingAlias}
                // onClick={handleClose}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      //   onClick={(event) => handleClick(event, row.id)}
                      //   role="checkbox"
                      //   aria-checked={isItemSelected}
                      //   tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer", fontSize: 13 }}
                    >
                      {/* <TableCell
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
                      </TableCell> */}
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
                          fontSize: 13,
                        }}
                      >
                        {index + 1}
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
                          fontSize: 13,
                        }}
                      >
                        {row.alias_code}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          border: "1px solid #ddd",
                          // padding: "8px",
                          textAlign: "left",
                          fontSize: 13,
                        }}
                      >
                        {row.study_time_title}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          border: "1px solid #ddd",
                          // padding: "8px",
                          textAlign: "left",
                          fontSize: 13,
                        }}
                      >
                        {row.campus_title}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          border: "1px solid #ddd",
                          // padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        <Edit
                          onClick={() => {
                            // console.log("Edit....", row);
                            // dispatch(updateCollege(row));
                            dispatch(setSelectedAlias(row));
                          }}
                          style={{
                            color: "blue",
                            marginRight: 5,
                            fontSize: 18,
                          }}
                        />

                        <Delete
                          onClick={() => showConfirm(row)}
                          style={{
                            color: "red",
                            fontSize: 18,
                          }}
                        />
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
        </div>
      </Box>
    </div>
  );
}

export default DataTable;
