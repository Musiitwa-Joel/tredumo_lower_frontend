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
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { Edit, Refresh, Save } from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { useQuery } from "@apollo/client";
import { GET_COLLEGES } from "../../gql/queries";
import { useDispatch, useSelector } from "react-redux";
import { updateCollege, updateColleges } from "../../store/collegeSlice";
import { NetworkStatus } from "@apollo/client";

const rows = [
  {
    id: "1",
    college_code: "NKUMBA",
    college_title: "NKUMBA COLLEGE",
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
    label: "College Code",
  },
  {
    id: "college_title",
    numeric: false,
    disablePadding: false,
    label: "College Title",
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
    GET_COLLEGES,
    {
      notifyOnNetworkStatusChange: true,
    }
  );
  const dispatch = useDispatch();

  const { colleges } = useSelector((state) => state.college);

  useEffect(() => {
    if (data) {
      // console.log("data", data);
      dispatch(updateColleges(data.colleges));
    }
  }, [data]);

  const visibleRows = React.useMemo(
    () =>
      stableSort(colleges, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, colleges]
  );
  const isSelected = (id) => selected.indexOf(id) !== -1;

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
            Colleges
          </Typography>

          <Refresh
            fontSize=""
            color="white"
            onClick={async () => {
              await refetch();
              console.log("refetch...");
              if (networkStatus === NetworkStatus.refetch) {
                console.log("Refetching...");
              }
            }}
            style={{
              color: "white",
              fontSize: 25,
              cursor: "pointer",
            }}
          />
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
                        {row.college_code}
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
                        {row.college_title}
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
                            dispatch(updateCollege(row));
                          }}
                          style={{
                            color: "blue",
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
      </Card>
    </div>
  );
}

export default DataTable;
