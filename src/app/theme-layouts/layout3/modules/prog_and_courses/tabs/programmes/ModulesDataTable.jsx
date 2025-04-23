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
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Card from "@mui/material/Card";
import { darken, styled, alpha } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import { visuallyHidden } from "@mui/utils";

// import ButtonComponent from "./ButtonComponent";
import Button from "@mui/material/Button";
import clsx from "clsx";
import TextField from "@mui/material/TextField";
import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { useSuspenseQuery } from "@apollo/client";
import { GET_STAFF_MEMBERS } from "app/theme-layouts/layout3/graphql/queries";
import { useDispatch } from "react-redux";
import { saveStaffMembers } from "app/store/appSlice";
import Menu from "@mui/material/Menu";

import "./programs.css";
import {
  AddBox,
  Download,
  InfoSharp,
  Refresh,
  Search,
  UploadFile,
} from "@mui/icons-material";
import CreateModuleForm from "./CreateModuleForm";
import { updateCreateModuleModalOpen } from "../../store/progAndCoursesSlice";

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
    course_id: "NUSAF5101",
    course_name: "TAXATION MANAGEMENT AND PLANNING",
    course_code: "MSCAF",
    module_level: "elective",
    study_yr: "1",
    credit_units: 3,
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5102",
    course_name: "RESEARCH METHODS",
    course_code: "MSCAF",
    module_level: "elective",
    credit_units: 3,
    study_yr: "1",
    sem: "1",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5103",
    course_name: "FINANCIAL MANAGEMENT",
    course_code: "MSCAF",
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
    study_yr: "1",
    sem: "2",
    school_id: "SBA",
    status: "0",
  },
  {
    course_id: "NUSAF5205",
    course_name: "FINANCIAL REPORTING AND ANALYSIS",
    course_code: "MSCAF",
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
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
    credit_units: 3,
    study_yr: "2",
    sem: "2",
    school_id: "SBA",
    status: "0",
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
      <TableRow style={{ width: 90 }}>
        <TableCell
          padding="checkbox"
          className="sticky-table-head"
          style={{
            backgroundColor: "#DEEFF5",
            // borderBottomColor: "blue",
            // borderBottomWidth: 1.5,
            // boxShadow: "inset 0px -1.5px blue",
          }}
        >
          <Checkbox
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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const addOptionsOpen = Boolean(anchorEl);

  const handleClickAddOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickClose = () => {
    setAnchorEl(null);
  };

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

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showSearchBar, setShowSearchBar] = React.useState(false);

  const [anchorElMenu, setAnchorElMenu] = React.useState(null);

  const menuOpen = Boolean(anchorElMenu);
  const handleClickMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
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

  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <div variants={item}>
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
                    whiteSpace: "nowrap",
                    overflow: "auto",
                    paddingRight: 15,
                  }}
                >
                  <Typography
                    variant="h6"
                    color="inherit"
                    noWrap
                    component="div"
                    style={{
                      //   opacity: 0.7,

                      color: "white",
                    }}
                  >
                    BACHELOR OF CLEARING AND FORWARDING MANAGEMENT - (BCFM)
                    V2020
                  </Typography>

                  <div
                    style={
                      {
                        // backgroundColor: "red",
                        // width: "calc(100vw - 1230px)",
                        // whiteSpace: "nowrap",
                        // overflow: "auto",
                        // marginLeft: 30,
                      }
                    }
                  >
                    <Tooltip title="View Program Details">
                      <InfoSharp
                        // onClick={() => downloadExcel()}
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
                        // onClick={onRefresh}
                        color="white"
                        style={{
                          color: "white",
                          fontSize: 25,
                          cursor: "pointer",
                          marginRight: 10,
                        }}
                      />
                    </Tooltip>

                    {/* 
                    <Tooltip title="Delete Modules">
                      <Delete
                        // onClick={() => downloadExcel()}
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

                    <Tooltip title="Edit Module">
                      <Edit
                        // onClick={() => downloadExcel()}
                        fontSize=""
                        color="white"
                        style={{
                          color: "white",
                          fontSize: 25,
                          cursor: "pointer",
                          marginRight: 10,
                        }}
                      />
                    </Tooltip> */}
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
                      Module Options
                    </Button>
                    <StyledMenu
                      id="demo-customized-menu"
                      MenuListProps={{
                        "aria-labelledby": "demo-customized-button",
                      }}
                      anchorEl={anchorElMenu}
                      open={menuOpen}
                      onClose={handleCloseMenu}
                    >
                      <MenuItem
                        onClick={() => {
                          dispatch(updateCreateModuleModalOpen(true));
                          handleCloseMenu();
                        }}
                        disableRipple
                      >
                        <AddBox />
                        Create New Module
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          // console.log("create new programme");
                          // dispatch(updatecreateProgrammeModalOpen(true));
                          handleCloseMenu();
                        }}
                        disableRipple
                      >
                        <UploadFile />
                        Upload Modules
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          setShowSearchBar(!showSearchBar);
                          handleCloseMenu();
                        }}
                        disableRipple
                      >
                        <Search />
                        Search Modules
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          // setShowSearchBar(!showSearchBar);
                          handleCloseMenu();
                        }}
                        disableRipple
                      >
                        <Download />
                        Download Modules
                      </MenuItem>
                    </StyledMenu>
                  </div>
                </Box>

                {showSearchBar && (
                  <div
                    style={{
                      padding: 5,
                      paddingTop: 10,
                      display: "flex",
                      // backgroundColor: "lightblue",
                    }}
                  >
                    <form
                      name="updateGradingForm"
                      noValidate
                      // className="flex flex-col justify-center w-full mt-32"
                      // onSubmit={handleSubmitGrade(onSubmit)}
                      style={{
                        display: "flex",
                      }}
                    >
                      <TextField
                        label="Search Module"
                        id="outlined-size-small"
                        // placeholder="Grading Title"
                        // error={!!gradingErrors.grading_title}
                        style={{
                          // paddingBottom: ,
                          width: 300,
                          marginRight: 10,
                        }}
                        // value={formState.college_code}
                        // onChange={e => setFormState({...formState, college_code: e.target.value})}
                        // defaultValue="Small"
                        size="small"
                      />
                    </form>
                  </div>
                )}

                <TableContainer>
                  <FuseScrollbars
                    className={`custom-scroll ${
                      showSearchBar
                        ? "custom-scroll-height-with-search"
                        : "custom-scroll-height-without-search"
                    }`}
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
                                className="text-16"
                                style={{
                                  color: "blue",
                                  fontWeight: "bold",
                                  // fontSize: 12,
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
                                  onClick={(event) =>
                                    handleClick(event, row.id)
                                  }
                                  role="checkbox"
                                  aria-checked={isItemSelected}
                                  tabIndex={-1}
                                  key={row.code}
                                  selected={isItemSelected}
                                  sx={{ cursor: "pointer" }}
                                >
                                  <TableCell
                                    padding="checkbox"
                                    className="text-16"
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
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {row.course_code}
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
                                      textAlign: "left",
                                      whiteSpace: "nowrap",
                                      paddingRight: 10,
                                    }}
                                  >
                                    {row.course_name}
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
                                    className="text-16"
                                    style={{
                                      border: "1px solid #ddd",
                                      // padding: "8px",
                                      textAlign: "left",
                                    }}
                                  >
                                    {row.module_level}
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
                  </FuseScrollbars>
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
      </div>
      <CreateModuleForm />
    </div>
  );
}

export default ModulesDataTable;
