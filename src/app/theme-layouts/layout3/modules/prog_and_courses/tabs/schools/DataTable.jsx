import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import clsx from "clsx";
import { darken } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Download, Edit, Refresh } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDeleteDialogOpen,
  updateSchool,
  updateSchools,
  updateSelectedSchool,
} from "../../store/schoolSlice";
import { GET_SCHOOLS } from "../../gql/queries";
import groupByCollege from "../../utilities/groupByCollege";
import convertTimestampToDate from "../../utilities/convertTimestampToDate";
import { Backdrop, CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import { DELETE_SCHOOL } from "../../gql/mutations";

import { NetworkStatus } from "@apollo/client";
import * as XLSX from "xlsx";
import "./datatable.css";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const rows = [
  {
    id: "1",
    school_code: "SBA",
    school_title: "SCHOOL OF BUSINESS ADMINISTRATION",
    added_by: "MR. MULINDE HAKIM",
    modified_by: null,
    modified_on: null,
  },
  {
    id: "2",
    school_code: "SCI",
    school_title: "SCHOOL OF COMPUTING AND INFORMATICS",
    added_by: "MR. MULINDE HAKIM",
    modified_by: null,
    modified_on: null,
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
    id: "school_code",
    numeric: false,
    // disablePadding: true,
    label: "School Code",
  },
  {
    id: "school_title",
    numeric: false,
    disablePadding: false,
    label: "School Title",
  },
  {
    id: "added_by",
    numeric: false,
    disablePadding: false,
    label: "Added by",
  },
  {
    id: "modified_by",
    numeric: false,
    disablePadding: false,
    label: "Modified by",
  },
  {
    id: "modified_on",
    numeric: false,
    disablePadding: false,
    label: "Modified on",
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
        {columns.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            className={index === columns.length - 1 ? "sticky-column" : ""}
            style={{
              // border: "1px solid #ddd",
              // padding: "8px",
              textAlign: "left",
              color: "blue",
              // opacity: 0.7,
              fontSize: 13,
              whiteSpace: "nowrap",
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
  const dispatch = useDispatch();
  const { selectedSchool, deleteDialogOpen } = useSelector(
    (state) => state.school
  );
  const { schools } = useSelector((state) => state.school);
  const { error, loading, data, refetch, networkStatus } = useQuery(
    GET_SCHOOLS,
    {
      notifyOnNetworkStatusChange: true,
    }
  );
  const [
    deleteSchool,
    { error: deleteSchErr, loading: deletingSch, data: deleteResponse },
  ] = useMutation(DELETE_SCHOOL, {
    refetchQueries: ["getSchools"],
  });

  if (deleteSchErr) {
    dispatch(
      showMessage({
        message: "Error deleting school - " + deleteSchErr.message,
        variant: "error",
      })
    );
  }

  const handleClickOpen = (sch) => {
    dispatch(updateSelectedSchool(sch));
    dispatch(updateDeleteDialogOpen(true));
  };

  const handleClose = () => {
    dispatch(updateDeleteDialogOpen(false));
  };

  const handleDelete = async () => {
    // console.log("delete", selectedSchool);
    dispatch(updateDeleteDialogOpen(false));

    const res = await deleteSchool({
      variables: {
        schoolId: selectedSchool.id,
      },
    });

    dispatch(updateSchools(groupByCollege(res.data.deleteSchool)));

    dispatch(
      showMessage({
        message: "School deleted Succesfully",
        variant: "info",
      })
    );
    // setOpen(false);
  };

  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();

    Object.keys(schools).forEach((collegeCode) => {
      const wsData = [
        ["SCHOOLS IN NKUMBA UNIVERSITY"],
        [
          "ID",
          "School Code",
          "School Title",
          "Dean",
          "College Code",
          "College Title",
        ],
      ];

      schools[collegeCode].forEach((school, index) => {
        // console.log("school", school);
        wsData.push([
          index + 1,
          school.school_code,
          school.school_title,
          school.school_dean.title + " " + school.school_dean.staff_name,
          school.college.college_code,
          school.college.college_title,
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, collegeCode);
    });

    XLSX.writeFile(wb, "Schools.xlsx");
  };

  useEffect(() => {
    if (data) {
      // console.log("data", data);
      dispatch(updateSchools(groupByCollege(data.schools)));
    }
  }, [data]);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const onRefresh = async () => {
    await refetch();
    console.log("refetch...");
    if (networkStatus === NetworkStatus.refetch) {
      console.log("Refetching...");
    }
  };

  return (
    <div className="p-16">
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
          style={{
            paddingLeft: 15,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 15,
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
            Schools
          </Typography>

          <div>
            <Tooltip title="Download Schools">
              <Download
                onClick={() => downloadExcel()}
                fontSize=""
                color="white"
                style={{
                  color: "white",
                  fontSize: 25,
                  cursor: "pointer",
                  marginRight: 10,
                }}
              />
            </Tooltip>

            <Tooltip title="Reload">
              <Refresh
                fontSize=""
                onClick={onRefresh}
                color="white"
                style={{
                  color: "white",
                  fontSize: 25,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
          </div>
        </Box>
        <div className="max-w-full relative">
          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 180px)",
              minHeight: "calc(100vh - 180px)",
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
                open={loading || deletingSch}
                // onClick={handleClose}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              <TableBody>
                {Object.keys(schools).map((collegeCode) => (
                  <>
                    <TableRow
                      style={{
                        backgroundColor: "rgb(246, 249, 251)",
                      }}
                    >
                      <TableCell
                        colSpan={7}
                        style={{
                          color: "blue",
                          fontWeight: "bold",
                          fontSize: 13,
                          paddingLeft: 5,
                          marginLeft: 0,
                          opacity: 0.7,
                          borderBottomColor: "lightgray",
                          borderBottomWidth: 1.5,
                        }}
                      >
                        {collegeCode}
                      </TableCell>
                    </TableRow>

                    {schools[collegeCode].map((school, index) => (
                      <TableRow
                        hover
                        key={school.id}
                        sx={{ cursor: "pointer", fontSize: 13 }}
                      >
                        <TableCell
                          component="th"
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
                          {school.school_code}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                            fontSize: 13,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {school.school_title}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                            whiteSpace: "nowrap",

                            fontSize: 13,
                          }}
                        >
                          {school.added_user
                            ? school.added_user.title +
                              " " +
                              school.added_user.staff_name
                            : ""}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                            fontSize: 13,
                          }}
                        >
                          {school.modified_user
                            ? school.modified_user.title +
                              " " +
                              school.modified_user.staff_name
                            : ""}
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
                          {school.modified_on
                            ? convertTimestampToDate(school.modified_on)
                            : ""}
                        </TableCell>
                        <TableCell
                          className="sticky-column"
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                            backgroundColor: "white",
                          }}
                        >
                          <Tooltip title="Edit">
                            <Edit
                              onClick={() => {
                                // console.log("school", school);
                                dispatch(updateSchool(school));
                              }}
                              style={{
                                color: "blue",
                                fontSize: 18,
                                marginRight: 10,
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>

                          <Tooltip title="Delete">
                            <Delete
                              onClick={() => handleClickOpen(school)}
                              style={{
                                color: "red",
                                fontSize: 18,
                                cursor: "pointer",
                              }}
                            />
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ))}

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

        <Dialog
          open={deleteDialogOpen}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            style={{
              fontSize: 17,
            }}
          >
            {"Delete School"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description text-16"
              style={{
                fontSize: 15,
              }}
            >
              Are you sure you want to delete school?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button size="large" onClick={handleClose}>
              Cancel
            </Button>
            <Button size="large" onClick={handleDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </div>
  );
}

export default DataTable;
