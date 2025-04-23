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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Drawer from "@mui/material/Drawer";
import Select from "@mui/material/Select";
// import ButtonComponent from "./ButtonComponent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { motion } from "framer-motion";
import clsx from "clsx";
import TextField from "@mui/material/TextField";
import toast, { Toaster } from "react-hot-toast";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";
import { Icon } from "@iconify/react";
import { useSuspenseQuery } from "@apollo/client";
import { GET_STAFF_MEMBERS } from "app/theme-layouts/layout3/graphql/queries";
import { useDispatch } from "react-redux";
import { saveStaffMembers } from "app/store/appSlice";
import Menu from "@mui/material/Menu";

import "./programs.css";

// import AddRole from "./AddRole";
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
  { id: "code", label: "Code", minWidth: 10 },
  {
    id: "title",
    numeric: false,
    // disablePadding: true,
    label: "title",
  },
  {
    id: "credit_units",
    numeric: false,
    disablePadding: false,
    label: "credit units",
  },
  {
    id: "study_yr",
    numeric: false,
    disablePadding: false,
    label: "study yr",
    minWidth: 20,
  },
  {
    id: "sem",
    numeric: false,
    disablePadding: false,
    label: "sem",
    minWidth: 10,
  },
  {
    id: "level",
    numeric: false,
    disablePadding: false,
    label: "level",
  },
];

const rows = [
  {
    course_id: "NUSAF5101",
    course_name: "TAXATION MANAGEMENT AND PLANNING",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5102",
    course_name: "RESEARCH METHODS",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5103",
    course_name: "FINANCIAL MANAGEMENT",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5104",
    course_name: "ADVANCED FINANCIAL ACCOUNTING",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5105",
    course_name: "CORPORATE STRATEGY",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5106",
    course_name: "COST ACCOUNTING",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5201",
    course_name: "MANAGEMENT ACCOUNTING",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "2",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5202",
    course_name: "ENTREPRENEURSHIP",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "2",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5203",
    course_name: "ADVANCED COMPUTERIZED ACCOUNTING",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "2",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5204",
    course_name: "PUBLIC SECTOR ACCOUNTING",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "2",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5205",
    course_name: "FINANCIAL REPORTING AND ANALYSIS",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "2",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5206",
    course_name: "AUDIT AND ASSURANCE",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    sem: "2",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF52101",
    course_name: "MANAGEMENT CONSULTANCY",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "2",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF52102",
    course_name: "HUMAN RESOURCE MANAGEMENT",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "2",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF52103",
    course_name: "MANAGEMENT SCIENCE",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "2",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF52104",
    course_name: "STRATEGIC MANAGEMENT ACCOUNTING",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "2",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF52105",
    course_name: "INVESTMENT ANALYSIS AND PORTFOLIO MANAGEMENT",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "2",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF52106",
    course_name: "INTERNATIONAL FINANCIAL MANAGEMENT",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "2",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF52202",
    course_name: "DISSERTATION",
    course_code: "MSCAF",
    module_level: "core",
    study_yr: "2",
    sem: "2",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "",
    course_name: "",
    course_code: "",
    module_level: "",
    study_yr: "",
    sem: "",
    school_id: "",
    status: "",
  },
];

const groupedRows = rows.reduce((acc, row) => {
  const groupKey = `${row.study_yr}-${row.sem}`; // Combine study_yr and sem for unique group key
  acc[groupKey] = acc[groupKey] || [];
  acc[groupKey].push(row);
  return acc;
}, {});

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
              whiteSpace: "nowrap",
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

const options = ["Add Courseunit", "Upload Courseunits", "Delete Courseunit"];

function EnhancedTableToolbar({ onAddUserButtonClick }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        // pr: { xs: 0, sm: 0 },
        background: "linear-gradient(to left, #f3f3f3, #dadcde)",
        padding: 0,
        minHeight: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 0,
      }}
    >
      <div>
        <span
          style={{
            fontSize: 13,
          }}
        >
          BACHELOR OF CLEARING AND FORWARDING MANAGEMENT - (BCFM) V2020
        </span>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>
            {/* <TextField
              label="Search"
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-input": {
                  // Target outlined input specifically
                  paddingBottom: "0px", // Adjust paddingBottom as needed
                },
              }}
              // value={searchTerm}
              // onChange={handleChange}
              type="search"
            /> */}
          </div>
          <div>
            <Button
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              variant="outlined"
              size="small"
              style={
                {
                  // padding: "0px 0px",
                }
              }
              onClick={handleClick}
            >
              Action
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              {options.map((option) => (
                <MenuItem key={option} onClick={handleClose}>
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </div>
      </div>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function ModulesDataTable() {
  const {
    loading: staffMembersLoading,
    error,
    data,
  } = useSuspenseQuery(GET_STAFF_MEMBERS);

  if (error) {
    return console.log("staff members error", error);
  }

  // console.log("grouped rows", groupedRows);

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

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 300 }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      {/* <AddRole /> */}
      <Divider />
    </Box>
  );
  const handleAddRole = () => {
    handleClose();
    toast.success("Role added", {
      position: "top-right",
    });
  };
  const [loading, setLoading] = React.useState(true); // Step 2
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

  return (
    <motion.div variants={item}>
      <div className="flex-auto p-0 sm:p-0 h-full">
        <Box sx={{ width: "100%" }}>
          <Paper
            sx={{
              width: "100%",
              mb: 2,
              borderTopRightRadius: 0,
              borderTopLeftRadius: 0,
            }}
          >
            <EnhancedTableToolbar
              onAddUserButtonClick={handleClickOpen}
              numSelected={selected.length}
            />

            <Dialog
              open={open}
              onClose={handleClose}
              maxWidth={50}
              PaperProps={{
                component: "form",
                onSubmit: (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const formJson = Object.fromEntries(formData.entries());
                  const roleName = formJson.name;
                  console.log("Role Name:", roleName);
                  console.log("System Role:", systemRole);

                  handleClose();
                },
              }}
            >
              <DialogTitle>Add Role</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Provide the required information for the new role: name,
                  system role status in order to create the new role
                </DialogContentText>

                {/* Updated spacing for better design */}
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="name"
                  label="Role"
                  type="name"
                  fullWidth
                  variant="standard"
                  sx={{ mb: 2 }} // Add margin-bottom
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                  {" "}
                  {/* Add margin-bottom */}
                  <InputLabel id="system-role-label">System Role</InputLabel>
                  <Select
                    labelId="system-role-label"
                    id="system-role"
                    value={systemRole}
                    label="System Role"
                    onChange={handleSystemRoleChange}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleAddRole} type="submit">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
            <Toaster />

            <TableContainer sx={{ maxHeight: "calc(100vh - 235px)" }}>
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
                  {Object.entries(groupedRows).map(([groupKey, rows]) => (
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
                            fontSize: 12,
                          }}
                        >
                          STUDY YEAR {groupKey.split("-")[0]}, SEMESTER{" "}
                          {groupKey.split("-")[1]}
                        </TableCell>
                      </TableRow>
                      {rows.map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          // Render child rows with your existing logic
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.code}
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
                                // checked={isItemSelected}
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
                                paddingRight: 10,
                                textAlign: "left",
                              }}
                            >
                              {row.code}
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
                              {row.title}
                            </TableCell>
                            <TableCell
                              align="right"
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
                              style={{
                                border: "1px solid #ddd",
                                // padding: "8px",
                                textAlign: "left",
                              }}
                            >
                              {row.study_yr}
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
                              {row.sem}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{
                                border: "1px solid #ddd",
                                // padding: "8px",
                                textAlign: "left",
                              }}
                            >
                              {row.level}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  ))}

                  {/* {visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.id)}
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
                            paddingRight: 10,
                            textAlign: "left",
                          }}
                        >
                          {row.code}
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
                          {row.title}
                        </TableCell>
                        <TableCell
                          align="right"
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
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.study_yr}
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
                          {row.sem}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            border: "1px solid #ddd",
                            // padding: "8px",
                            textAlign: "left",
                          }}
                        >
                          {row.level}
                        </TableCell>
                      </TableRow>
                    );
                  })} */}
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
          </Paper>
        </Box>
      </div>
    </motion.div>
  );
}

export default ModulesDataTable;
