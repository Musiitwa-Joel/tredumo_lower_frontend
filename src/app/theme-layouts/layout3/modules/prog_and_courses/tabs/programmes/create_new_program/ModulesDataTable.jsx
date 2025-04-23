import * as React from "react";
import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";
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
import Card from "@mui/material/Card";
import { darken, styled, alpha } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";

import MenuItem from "@mui/material/MenuItem";
import { visuallyHidden } from "@mui/utils";
import InputLabel from "@mui/material/InputLabel";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { GET_STAFF_MEMBERS } from "app/theme-layouts/layout3/graphql/queries";
import { useDispatch } from "react-redux";
import { saveStaffMembers } from "app/store/appSlice";
import Menu from "@mui/material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Add, DocumentScannerOutlined, Download } from "@mui/icons-material";
import { updateCreateModuleModalOpen } from "../../../store/progAndCoursesSlice";

const container = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const StyledMenu = styled((props) => (
  <Menu
    elevation={1}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,

    // backgroundColor: "#EEF7FF",

    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

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
    padding: theme.spacing(1, 1, 1, 0),
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
  { id: "code", label: "code", minWidth: 10 },
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
    code: "BCS3111",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "1",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS3112",
    title: "ALGORTHM ANALYSIS AND DESIGN",
    credit_units: "3",
    study_yr: "1",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS3113",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "1",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS3114",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "1",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS31115",
    title: "ALGORTHM ANALYSIS AND DESIGN",
    credit_units: "3",
    study_yr: "1",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS31116",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "1",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS31117",
    title: "COMPUTER REPAIR AND MAINTANENCE",
    credit_units: "3",
    study_yr: "1",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS31118",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "1",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS31119",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "1",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS311111",
    title: "COMPUTER REPAIR AND MAINTANENCE",
    credit_units: "3",
    study_yr: "1",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS311112",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "1",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS311113",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "1",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS311114",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS311115",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS311116",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS311117",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS311118",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS311119",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "1",
    level: "elective",
  },
  {
    code: "BCS31121",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS311122",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS311123",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS311124",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS311125",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "2",
    level: "elective",
  },
  {
    code: "BCS311126",
    title: "COMPUTER MATHEMATICS",
    credit_units: "3",
    study_yr: "2",
    sem: "2",
    level: "elective",
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

const options = ["Add Courseunit", "Upload Courseunits", "Delete Courseunit"];

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
  const [showSearchBar, setShowSearchBar] = React.useState(false);

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues: {},
      // resolver: yupResolver(gradingSystemDetailsSchema),
    });

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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const menuOpen = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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
                      <InputLabel id="system-role-label">
                        System Role
                      </InputLabel>
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
                      minHeight: 45,
                    }}
                  >
                    <IconButton
                      size="large"
                      edge="start"
                      color="inherit"
                      aria-label="open drawer"
                      sx={{ mr: 1 }}
                    >
                      <Tooltip title="Download Modules">
                        <Download
                          style={{
                            fontSize: 25,
                          }}
                        />
                      </Tooltip>
                    </IconButton>
                    <div
                      style={{
                        flexGrow: 1,
                        display: { xs: "none", sm: "block" },
                      }}
                    >
                      <Button
                        id="demo-customized-button"
                        aria-controls={
                          menuOpen ? "demo-customized-menu" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={menuOpen ? "true" : undefined}
                        variant="outlined"
                        // color="inherit"
                        style={{
                          // backgroundColor: "#fff",
                          color: "#fff",
                        }}
                        size="small"
                        // disableElevation
                        onClick={handleClickMenu}
                        endIcon={<KeyboardArrowDownIcon />}
                      >
                        Add Modules
                      </Button>
                      <StyledMenu
                        id="demo-customized-menu"
                        MenuListProps={{
                          "aria-labelledby": "demo-customized-button",
                        }}
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem
                          onClick={() => {
                            // console.log("create new programme");
                            // dispatch(updatecreateProgrammeModalOpen(true));
                            handleCloseMenu();
                          }}
                          disableRipple
                        >
                          <DocumentScannerOutlined />
                          Using Excel Upload
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            dispatch(updateCreateModuleModalOpen(true));
                            handleCloseMenu();
                          }}
                          disableRipple
                        >
                          <Add />
                          Using Form
                        </MenuItem>
                      </StyledMenu>
                    </div>
                    <Search>
                      <SearchIconWrapper>
                        <SearchIcon />
                      </SearchIconWrapper>
                      <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ "aria-label": "search" }}
                      />
                    </Search>
                  </Toolbar>
                </AppBar>
                {/* </Box> */}

                <TableContainer
                  sx={{
                    maxHeight: "calc(100vh - 240px)",
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

export default ModulesDataTable;
