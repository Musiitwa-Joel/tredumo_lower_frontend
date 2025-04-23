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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";

import { visuallyHidden } from "@mui/utils";

import { motion } from "framer-motion";
import clsx from "clsx";
import TextField from "@mui/material/TextField";
import toast, { Toaster } from "react-hot-toast";

import { useSuspenseQuery } from "@apollo/client";
import { GET_STAFF_MEMBERS } from "app/theme-layouts/layout3/graphql/queries";
import { useDispatch } from "react-redux";
import { saveStaffMembers } from "app/store/appSlice";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";

// const rows = [
//   {
//     id: 1,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
//   {
//     id: 2,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
//   {
//     id: 3,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
//   {
//     id: 4,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
//   {
//     id: 5,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
//   {
//     id: 6,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
//   {
//     id: 7,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
//   {
//     id: 8,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
//   {
//     id: 9,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
//   {
//     id: 10,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
//   {
//     id: 11,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },

//   {
//     id: 12,
//     name: "AKAMPA DARLINGTON",
//     form_no: "98383489349834",
//     date: "2024-03-03",
//     program: "Masters of human resource management",
//     status: "paid",
//     email: "d@gmail.com",
//     pre_entry_marks: 50,
//     concept_marks: 40,
//     grade: "fail",
//   },
// ];
const columns = [
  { id: "id", label: "#", minWidth: 10 },
  {
    id: "name",
    numeric: false,
    // disablePadding: true,
    label: "name",
    minWidth: 100,
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
    minWidth: 60,
  },
  {
    id: "form_no",
    numeric: false,
    disablePadding: false,
    label: "Form No",
    minWidth: 60,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    minWidth: 60,
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
    minWidth: 60,
  },
  {
    id: "program",
    numeric: false,
    disablePadding: false,
    label: "Program",
  },
  {
    id: "pre_entry",
    numeric: false,
    disablePadding: false,
    label: "Pre Entry",
    minWidth: 100,
  },
  {
    id: "concept",
    numeric: false,
    disablePadding: false,
    label: "Concept",
    minWidth: 60,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    minWidth: 60,
  },
  {
    id: "pre_entry",
    numeric: false,
    disablePadding: false,
    label: "Pre Entry",
    minWidth: 60,
  },
  {
    id: "concept",
    numeric: false,
    disablePadding: false,
    label: "Concept",
    minWidth: 60,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    minWidth: 60,
  },
  {
    id: "pre_entry",
    numeric: false,
    disablePadding: false,
    label: "Pre Entry",
    minWidth: 60,
  },
  {
    id: "concept",
    numeric: false,
    disablePadding: false,
    label: "Concept",
    minWidth: 60,
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    minWidth: 60,
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
        <TableCell align="left" colSpan={8}>
          Applicant Details
        </TableCell>
        <TableCell align="left" colSpan={3}>
          First Trial Exam Marks
        </TableCell>
        <TableCell align="left" colSpan={3}>
          Second Trial Exam Marks
        </TableCell>
        <TableCell align="left" colSpan={3}>
          Third Trial Exam Marks
        </TableCell>
      </TableRow>
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
              width: headCell.minWidth,
              textAlign: "left",
              whiteSpace: "nowrap",
            }}
            // width={headCell.minWidth}
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

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function AdmissiblePHDstdTable({ rows }) {
  const {
    loading: staffMembersLoading,
    error,
    data,
  } = useSuspenseQuery(GET_STAFF_MEMBERS);
  const [loading, setLoading] = React.useState(true); // Step 2
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedRows, setSelectedRows] = React.useState([]);

  if (error) {
    return console.log("staff members error", error);
  }

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (data) {
      dispatch(saveStaffMembers(data));
    }
  }, []);

  const [systemRole, setSystemRole] = React.useState("No"); // Step 1: Add state for system role
  const handleSystemRoleChange = (event) => {
    setSystemRole(event.target.value);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddRole = () => {
    handleClose();
    toast.success("Role added", {
      position: "top-right",
    });
  };

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

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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

  React.useEffect(() => {
    // Simulate loading delay (You can replace this with your actual data fetching logic)
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Cleanup function to clear the timeout if the component is unmounted
    return () => clearTimeout(delay);
  }, []);
  return (
    <motion.div variants={item}>
      <div className="flex-auto p-0 sm:p-0 h-full">
        <Box sx={{ width: "100%" }}>
          <Paper
            sx={{
              //   width: "80%",
              mb: 2,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
              //   margin: 20,
            }}
          >
            <Toaster />

            <TableContainer
              sx={{ height: "calc(100vh - 240px)", overflowX: "auto" }}
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
                <TableBody>
                  {rows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
                        role="checkbox"
                        aria-checked={false}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{
                          cursor: "pointer",
                          backgroundColor:
                            row.admitted == "true" ? "lightgreen" : "",
                        }}
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
                            checked={
                              row.pre_admission_marks[
                                row.pre_admission_marks.length - 1
                              ].passed
                            }
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
                            whiteSpace: "nowrap",
                          }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          className="py-2"
                          scope="row"
                          padding="none"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            paddingLeft: 10,
                            paddingRight: 10,
                            textAlign: "left",
                            whiteSpace: "nowrap",
                            minWidth: "auto",
                            // backgroundColor: "red",
                          }}
                        >
                          {row.surname + " " + row.other_names}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDateString(parseInt(row.created_on))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.form_no}
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Typography
                            className={clsx(
                              "inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase",
                              "pending" &&
                                "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50",
                              "completed" &&
                                "bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50"
                            )}
                            sx={{
                              "& svg": { margin: 0, whiteSpace: "nowrap" },
                            }}
                          >
                            {row.payments.length > 0 ? "PAID" : "NOT PAID"}
                          </Typography>
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.email}
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.application_sent_details.program.program}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.pre_admission_marks[0].pre_entry_exam_marks}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.pre_admission_marks[0].concept_exam_marks}
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
                          <Typography
                            // className={clsx(
                            //   "inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase",
                            //   "pending" &&
                            //     "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50",
                            //   "completed" &&
                            //     "bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50"
                            // )}
                            className={`inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase 
                                ${
                                  row.pre_admission_marks[0].passed === 1
                                    ? "bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50"
                                    : "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50"
                                } 
                                `}
                            sx={{ "& svg": { margin: 0 } }}
                          >
                            {row.pre_admission_marks[0].passed === 1
                              ? "PASS"
                              : "FAIL"}
                          </Typography>
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.pre_admission_marks[1]
                            ? row.pre_admission_marks[1].pre_entry_exam_marks
                            : "_"}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.pre_admission_marks[1]
                            ? row.pre_admission_marks[1].concept_exam_marks
                            : "_"}
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
                          <Typography
                            className={`inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase 
                                ${
                                  row.pre_admission_marks[1]
                                    ? row.pre_admission_marks[1].passed === 1
                                      ? "bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50"
                                      : "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50"
                                    : ""
                                } 
                                `}
                            sx={{ "& svg": { margin: 0 } }}
                          >
                            {row.pre_admission_marks[1]
                              ? row.pre_admission_marks[1].passed === 1
                                ? "PASS"
                                : "FAIL"
                              : "_"}
                          </Typography>
                        </TableCell>

                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.pre_admission_marks[2]
                            ? row.pre_admission_marks[2].pre_entry_exam_marks
                            : "_"}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.pre_admission_marks[2]
                            ? row.pre_admission_marks[2].concept_exam_marks
                            : "_"}
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
                          <Typography
                            className={`inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase 
                                ${
                                  row.pre_admission_marks[2]
                                    ? row.pre_admission_marks[2].passed === 1
                                      ? "bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50"
                                      : "bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50"
                                    : ""
                                } 
                                `}
                            sx={{ "& svg": { margin: 0 } }}
                          >
                            {row.pre_admission_marks[2]
                              ? row.pre_admission_marks[2].passed === 1
                                ? "PASS"
                                : "FAIL"
                              : "_"}
                          </Typography>
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
      </div>
    </motion.div>
  );
}

export default AdmissiblePHDstdTable;
