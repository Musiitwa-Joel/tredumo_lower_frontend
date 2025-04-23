import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import _ from "lodash";
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
import Refresh from "@mui/icons-material/Refresh";
import TextField from "@mui/material/TextField";
import Add from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import Close from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { useLazyQuery, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "antd";
import { LOAD_ROLE_MODULES, LOAD_ROLES } from "../../gql/queries";
import {
  selectAllRoles,
  selectSelectedRole,
  setAllRoles,
  setCreateRoleModalVisible,
  setLoadingRoleModules,
  setRoleModules,
  setSelectedPermissions,
  setSelectedRole,
} from "../../store/systemAccessSlice";

const rows = [
  {
    id: "1",
    grading_id: "default",
    description: "The default grading system",
  },
  {
    id: "2",
    grading_id: "grading_v2020",
    description: "The updated grading system",
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
  { id: "grading_id", label: "Role", minWidth: 10 },
  {
    id: "description",
    numeric: false,
    // disablePadding: true,
    label: "Description",
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

function RolesTable() {
  const dispatch = useDispatch();
  const [selected, setSelected] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null); //
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dense, setDense] = React.useState(false);
  const allRoles = useSelector(selectAllRoles);
  const selectedRole = useSelector(selectSelectedRole);
  const [
    loadRolesModules,
    { error: loadErr, loading: loadingModules, data: loadRes },
  ] = useLazyQuery(LOAD_ROLE_MODULES, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (loadRes) {
      dispatch(setRoleModules(loadRes.role_modules));
    }
  }, [loadRes]);

  useEffect(() => {
    if (loadErr) {
      dispatch(
        showMessage({
          message: loadErr.message,
          variant: "error",
        })
      );
    }
  }, [loadErr]);

  useEffect(() => {
    if (loadingModules) {
      dispatch(setLoadingRoleModules(loadingModules));
    } else {
      dispatch(setLoadingRoleModules(false));
    }
  }, [loadingModules]);

  const { loading, error, data, refetch } = useQuery(LOAD_ROLES, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (error) {
      dispatch(
        showMessage({
          message: error.message,
          variant: "error",
        })
      );
    }
  }, [error]);

  if (data) {
    // console.log("data", data);
    dispatch(setAllRoles(data.all_roles));
  }

  const handleReload = async () => {
    await refetch();
  };

  const handleCreateNewRole = () => {
    dispatch(setCreateRoleModalVisible(true));
  };

  const handleRowClick = async (event, row) => {
    dispatch(setSelectedRole(row));
    dispatch(
      setSelectedPermissions(row.permissions ? JSON.parse(row.permissions) : [])
    );
    // load the modules

    const res = await loadRolesModules({
      variables: {
        roleId: row.role_id,
      },
    });

    dispatch(setRoleModules(res.data.role_modules));
  };

  const visibleRows = React.useMemo(() => allRoles, [order, allRoles]);

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
            Roles
          </Typography>

          <div
            style={{
              display: "flex",
            }}
          >
            {/* <Tooltip title="Create new grading system">
              <Add
                onClick={() => handleClickOpen()}
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
              color="default"
              size="small"
              style={{
                color: "white",
                marginRight: 5,
              }}
              onClick={handleCreateNewRole}
              variant="text"
              icon={
                <Add
                  style={{
                    color: "white",
                    fontSize: 25,
                    cursor: "pointer",
                  }}
                />
              }
            >
              Create New Role
            </Button>

            <Button
              color="default"
              size="small"
              style={{
                color: "white",
              }}
              onClick={handleReload}
              variant="text"
              icon={
                <Refresh
                  style={{
                    color: "white",
                    fontSize: 25,
                    cursor: "pointer",
                  }}
                />
              }
            >
              Reload
            </Button>
          </div>
        </Box>
        <div className="max-w-full relative">
          <TableContainer
            sx={{
              maxHeight: "calc(100vh -180px)",
              minHeight: "calc(100vh - 180px)",
            }}
          >
            <Table
              //   sx={{ minWidth: 750 }}
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
                  const isSelected = row.role_id === selectedRole?.role_id;
                  // const isSelected = "1";
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleRowClick(event, row)}
                      //   role="checkbox"
                      //   aria-checked={isItemSelected}
                      //   tabIndex={-1}

                      key={row.id}
                      selected={isSelected}
                      sx={{
                        cursor: "pointer",
                        fontSize: 13,
                        padding: 5,
                        // backgroundColor: "lightblue",
                      }}
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
                          padding: "8px",
                          //   paddingLeft: 10,
                          whiteSpace: "nowrap",
                          textAlign: "left",
                          fontSize: 13,
                        }}
                      >
                        {row.role_name}
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
                          paddingLeft: 10,
                          textAlign: "left",
                          fontSize: 13,
                        }}
                      >
                        {row.description}
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

export default RolesTable;
