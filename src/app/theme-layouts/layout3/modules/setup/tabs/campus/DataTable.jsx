import React, { useEffect } from "react";
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
import { Edit, Refresh, Save } from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { useQuery } from "@apollo/client";
// import { GET_COLLEGES } from "../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
// import { updateCollege, updateColleges } from "../../store/collegeSlice";
import { NetworkStatus } from "@apollo/client";
import { Button, Tooltip } from "@mui/material";
import { GET_CAMPUSES } from "../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import {
  resetCampusFormState,
  updateCampuses,
  updateSelectedCampus,
} from "../../store/setUpSlice";

const rows = [
  {
    id: 1,
    campus: "MAIN CAMPUS",
    created_at: "12/07/2021",
    created_by: "Akampa Darlington",
    updated_by: "Liam Williams",
    updated_when: "2022-12-15T08:30:00",
  },
  {
    id: 2,
    campus: "KAMPALA CAMPUS",
    created_at: "01/15/2022",
    created_by: "John Doe",
    updated_by: "Emma Davis",
    updated_when: "2022-12-15T09:45:00",
  },
  {
    id: 3,
    campus: "KYEGEGWA CAMPUS",
    created_at: "03/22/2022",
    created_by: "Jane Smith",
    updated_by: "Michael Brown",
    updated_when: "2022-12-15T11:15:00",
  },
  {
    id: 4,
    campus: "KISORO CAMPUS",
    created_at: "05/08/2022",
    created_by: "Michael Johnson",
    updated_by: "Olivia Taylor",
    updated_when: "2022-12-15T12:30:00",
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
    id: "campus",
    numeric: false,
    // disablePadding: true,
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
  const { error, loading, data, refetch, networkStatus } = useQuery(
    GET_CAMPUSES,
    {
      notifyOnNetworkStatusChange: true,
    }
  );
  const dispatch = useDispatch();

  const campuses = useSelector((state) => state.setUp.campuses);

  if (error) {
    dispatch(
      showMessage({
        message: "Failed to load campuses " + error.message,
        variant: "error",
      })
    );
  }

  // console.log("campuses", campuses);

  // const { colleges } = useSelector(
  //   (state) => state.progAndCoursesApp.collegeSlice
  // );

  useEffect(() => {
    if (data) {
      // console.log("data", data);
      dispatch(updateCampuses(data.campuses));
    }
  }, [data]);

  const visibleRows = React.useMemo(
    () =>
      stableSort(campuses, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, campuses]
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
                open={loading}
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
                        <Tooltip title="Edit">
                          <Edit
                            onClick={() => {
                              // console.log("Edit....", row);
                              dispatch(updateSelectedCampus(row));
                            }}
                            style={{
                              color: "blue",
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
        </div>

        <div
          style={{
            padding: 5,
            // backgroundColor: "lightgray",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              dispatch(resetCampusFormState());
              console.log("reset...");
            }}
          >
            {"Add New Campus"}
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default DataTable;
