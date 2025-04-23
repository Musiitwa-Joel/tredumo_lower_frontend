import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import clsx from "clsx";
import { darken } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { alpha, styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Download, Edit, Refresh, Save } from "@mui/icons-material";
import Delete from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useMutation, useQuery } from "@apollo/client";
import { GET_DEPARTMENTS } from "../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDeleteDialogOpen,
  updateDepartment,
  updateDepartments,
  updateSelectedDepartment,
} from "../../store/departmentSlice";
import groupBySchool from "../../utilities/groupBySchool";
import { NetworkStatus } from "@apollo/client";
import { Backdrop, CircularProgress, Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DELETE_DEPARTMENT } from "../../gql/mutations";
import * as XLSX from "xlsx";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";

const rows = [
  {
    id: "1",
    department_code: "ACCG",
    department_title: "DEPARTMENT OF ACCOUNTING AND FINANCE",
    added_by: "MR. MULINDE HAKIM",
    modified_by: null,
    modified_on: null,
  },
  {
    id: "2",
    department_code: "SBA",
    department_title: "DEPARTMENT OF ADMINISTRATION",
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
    id: "department_code",
    numeric: false,
    // disablePadding: true,
    label: "Department Code",
  },
  {
    id: "department_title",
    numeric: false,
    disablePadding: false,
    label: "Department Title",
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
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{
              // border: "1px solid #ddd",
              // padding: "8px",
              whiteSpace: "nowrap",
              color: "blue",
              fontSize: 13,
              textAlign: "left",
              position: headCell.label == "Action" ? "sticky" : "",
              right: headCell.label == "Action" ? 0 : "",
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
  let index = 0;

  const { departments, deleteDialogOpen, selectedDepartment } = useSelector(
    (state) => state.department
  );

  const { error, loading, data, refetch, networkStatus } = useQuery(
    GET_DEPARTMENTS,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  const [
    deleteDepartment,
    { error: dptDeleteErr, loading: deletingDpt, data: deleteResponse },
  ] = useMutation(DELETE_DEPARTMENT, {
    refetchQueries: ["getDepartments"],
  });

  if (dptDeleteErr) {
    // console.log("error", dptDeleteErr);
    dispatch(
      showMessage({
        message: "Failed to delete department " + dptDeleteErr.message,
        variant: "error",
      })
    );
  }

  const handleClickOpen = (dpt) => {
    dispatch(updateSelectedDepartment(dpt));
    dispatch(updateDeleteDialogOpen(true));
  };

  const handleClose = () => {
    dispatch(updateDeleteDialogOpen(false));
  };

  const handleDelete = async () => {
    // console.log("delete", selectedDepartment);
    dispatch(updateDeleteDialogOpen(false));

    const res = await deleteDepartment({
      variables: {
        dptId: selectedDepartment.id,
      },
    });

    dispatch(updateDepartments(groupBySchool(res.data.deleteDepartment)));

    dispatch(
      showMessage({
        message: "Department deleted Succesfully",
        variant: "info",
      })
    );
    // setOpen(false);
  };

  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();

    departments.forEach((dpt) => {
      const wsData = [
        ["DEPARTMENTS IN NKUMBA UNIVERSITY"],
        [
          "ID",
          "Department Code",
          "Department Title",
          "Head of Department",
          "School Code",
          "School Title",
        ],
      ];

      dpt.departments.forEach((_d, _i) => {
        // console.log("dpree", _d);
        wsData.push([
          _i + 1,
          _d.dpt_code,
          _d.dpt_title,
          _d.department_head.title + " " + _d.department_head.staff_name,
          _d.school.school_code,
          _d.school.school_title,
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, dpt.school_code);
    });

    XLSX.writeFile(wb, "Departments.xlsx");
  };

  useEffect(() => {
    if (data) {
      // console.log("data", data.departments);
      dispatch(updateDepartments(groupBySchool(data.departments)));
    }
  }, [data]);

  const onRefresh = async () => {
    await refetch();
    console.log("refetch...");
    if (networkStatus === NetworkStatus.refetch) {
      console.log("Refetching...");
    }
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
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
            Departments
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
                // backgroundColor: "red",
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
                open={loading || deletingDpt}
                // onClick={handleClose}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              <TableBody>
                {departments.map((dpt) => (
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
                          opacity: 0.7,
                          fontSize: 13,
                          paddingLeft: 5,
                          marginLeft: 0,
                          borderBottomColor: "lightgray",
                          borderBottomWidth: 1.2,
                        }}
                      >
                        {`(${dpt.school_code}) ${dpt.school_title}`}
                      </TableCell>
                    </TableRow>
                    {dpt.departments.map((row) => {
                      index = index + 1;
                      return (
                        <TableRow hover>
                          <TableCell
                            component="th"
                            // id={labelId}
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
                            {index}
                          </TableCell>
                          <TableCell
                            component="th"
                            // id={labelId}
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
                            {row.dpt_code}
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
                            {row.dpt_title}
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
                            {row.added_user.title +
                              " " +
                              row.added_user.staff_name}
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
                            {row.modified_user
                              ? `${row.modified_user.title} ${row.modified_user.staff_name}`
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
                            {row.modified_on}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              // padding: "8px",
                              textAlign: "left",
                              backgroundColor: "white",
                              position: "sticky",
                              zIndex: 1,
                              right: 0,
                            }}
                          >
                            <Tooltip title="Edit">
                              <Edit
                                onClick={() => {
                                  // console.log("dpt", row);
                                  dispatch(updateDepartment(row));
                                }}
                                style={{
                                  color: "blue",
                                  fontSize: 18,
                                  marginRight: 5,
                                }}
                              />
                            </Tooltip>

                            <Tooltip title="Delete">
                              <Delete
                                onClick={() => handleClickOpen(row)}
                                style={{
                                  color: "red",
                                  fontSize: 18,
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
            {"Delete Department"}
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
