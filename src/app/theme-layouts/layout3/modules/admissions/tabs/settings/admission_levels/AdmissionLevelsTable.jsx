import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import clsx from "clsx";
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
import Divider from "@mui/material/Divider";
import { Backdrop, CircularProgress } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Grid from "@mui/material/Grid";
import { Alert, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import "./datatable.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAdmissionLevelToDelete,
  selectAdmissionLevels,
  selectDeleteAdmissionLevelDialogOpen,
  setAdmissionLevel,
  setAdmissionLevelToDelete,
  setAdmissionLevels,
  setDeleteAdmissionLevelDialogOpen,
} from "../../../admissionsSlice";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ADMISSION_LEVELS } from "../../../graphql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import formatDateString from "app/theme-layouts/layout3/utils/formatDateToDateAndTime";
import { DELETE_ADMISSION_LEVEL } from "../../../graphql/mutations";

// import ButtonComponent from "./ButtonComponent";

const rows = [
  {
    title: "UNDERGRADUATE",
    last_modified_by: "Joel Musiitwa",
    last_modified_date: "12/07/2021",
    created_by: "Akampa Darlington",
    creation_date: "2022-12-15T08:30:00",
  },
  {
    title: "POST GRADUATE",
    last_modified_by: "Akampa Darlington",
    last_modified_date: "11/15/2021",
    created_by: "Lubega Tasha",
    creation_date: "2022-11-28T14:45:00",
  },
  {
    title: "PHD",
    last_modified_by: "Lubega Tasha",
    last_modified_date: "10/01/2021",
    created_by: "Joel Musiitwa",
    creation_date: "2022-10-10T10:00:00",
  },
];

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
  { id: "#", label: "#", minWidth: 10 },
  { id: "name", label: "Title", minWidth: 10 },
  // { id: "status", label: "Status", minWidth: 10 },
  {
    id: "last_modified_by",
    numeric: false,
    // disablePadding: true,
    label: "Last Modified By",
  },
  {
    id: "last_modified_date",
    numeric: false,
    disablePadding: false,
    label: "Last Modified Date",
  },
  {
    id: "created_by",
    numeric: false,
    disablePadding: false,
    label: "Created By",
  },
  {
    id: "creation_date",
    numeric: false,
    disablePadding: false,
    label: "Creation Date",
  },
  {
    id: "action",
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
      <TableRow>
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

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        // ...(numSelected > 0 && {
        //   bgcolor: (theme) =>
        //     alpha(
        //       theme.palette.primary.main,
        //       theme.palette.action.activatedOpacity
        //     ),
        // }),
      }}
    >
      {/* {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : ( */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={2}>
          {/* <ButtonComponent /> */}
        </Grid>
        <Grid item xs={2}>
          {/* <Button variant="contained">Manage Programs</Button> */}
        </Grid>
        {/* <Grid item xs={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Scheme</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Intake</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
              <ColorButton variant="contained">Load</ColorButton>
            </Grid> */}
      </Grid>
      {/* )} */}

      {/* {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function AdmissionLevelsTable() {
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true); // Step 2
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const {
    error,
    loading: loadingAdmissionLevels,
    data,
  } = useQuery(GET_ADMISSION_LEVELS, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    deleteAdmissionLevel,
    { error: deleteErr, loading: deletingScheme, data: deleteSchemeRes },
  ] = useMutation(DELETE_ADMISSION_LEVEL, {
    refetchQueries: ["getAdmissionLevels"],
  });

  if (error) {
    showMessage({
      message: error.message,
      variant: "error",
    });
  }

  if (deleteErr) {
    showMessage({
      message: error.message,
      variant: "error",
    });
  }

  if (data) {
    // console.log("admission levels", data);
    dispatch(setAdmissionLevels(data.admission_levels));
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

  const admission_levels = useSelector(selectAdmissionLevels);
  const deleteDialogOpen = useSelector(selectDeleteAdmissionLevelDialogOpen);
  const selectedAdmissionLevel = useSelector(selectAdmissionLevelToDelete);

  const handleClose = () => {
    dispatch(setDeleteAdmissionLevelDialogOpen(false));
  };

  const handleDelete = async () => {
    // console.log("delete", selectedSchool);
    dispatch(setDeleteAdmissionLevelDialogOpen(false));

    const res = await deleteAdmissionLevel({
      variables: {
        admissionLevelId: selectedAdmissionLevel.id,
      },
    });

    // dispatch(updateSchools(groupByCollege(res.data.deleteSchool)));

    dispatch(
      showMessage({
        message: res.data.deleteAdmissionLevel.message,
        variant: "info",
      })
    );
    // setOpen(false);
  };

  // console.log("schemes", _schemes);

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
    () => stableSort(admission_levels, getComparator(order, orderBy)),
    [admission_levels]
  );

  return (
    <div className="flex-auto p-0 sm:p-0 h-full">
      <Box sx={{ width: "100%" }}>
        <Paper
          sx={{
            width: "100%",
            // mb: 2,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            paddingTop: 0.5,
          }}
        >
          <Divider
            textAlign="center"
            style={{
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <Typography className="font-medium text-20 bold">
              {"Admission Levels"}
            </Typography>
          </Divider>
          <TableContainer
            sx={{ height: "calc(100vh - 290px)", position: "relative" }}
          >
            <Table
              // sx={{ minWidth:  }}
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
                open={loadingAdmissionLevels}
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
                      onClick={(event) => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      // selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
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
                          whiteSpace: "nowrap",
                          paddingRight: 10,
                          paddingLeft: 10,
                          textAlign: "left",
                        }}
                      >
                        {row.admission_level_title}
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        style={{
                          border: "1px solid #ddd",
                          whiteSpace: "nowrap",
                          // padding: "8px",
                          paddingLeft: 10,
                          paddingRight: 10,
                          textAlign: "left",
                        }}
                      >
                        {row.modified_user
                          ? `${row.modified_user.title} ${row.modified_user.staff_name}`
                          : "_"}
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
                        {row.modified_on
                          ? formatDateString(parseInt(row.modified_on))
                          : "_"}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          border: "1px solid #ddd",
                          // padding: "8px",
                          whiteSpace: "nowrap",
                          textAlign: "left",
                        }}
                      >
                        {row.created_user
                          ? `${row.created_user.title} ${row.created_user.staff_name}`
                          : "_"}
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
                        {row.created_on
                          ? formatDateString(parseInt(row.created_on))
                          : "_"}
                      </TableCell>
                      <TableCell
                        // className="sticky-column"
                        align="right"
                        style={{
                          border: "1px solid #ddd",
                          backgroundColor: "#fff",
                          right: 0,
                          position: "sticky",
                          // padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        <Tooltip title="Edit">
                          <Edit
                            onClick={() => {
                              // console.log("Edit....", row);
                              dispatch(setAdmissionLevel(row));
                            }}
                            style={{
                              color: "blue",
                              fontSize: 18,
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Delete
                            onClick={() => {
                              // console.log("delete....", row);
                              dispatch(setAdmissionLevelToDelete(row));
                              dispatch(setDeleteAdmissionLevelDialogOpen(true));
                            }}
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
          {"Delete Admission Level"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description text-16"
            style={{
              fontSize: 15,
            }}
          >
            Are you sure you want to delete Admission Level?
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
    </div>
  );
}

export default AdmissionLevelsTable;
