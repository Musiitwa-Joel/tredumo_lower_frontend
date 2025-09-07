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
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Refresh from "@mui/icons-material/Refresh";
import Button from "antd/lib/button";
import Add from "@mui/icons-material/Add";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery, useQuery } from "@apollo/client";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
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
import { gql } from "@apollo/client";

// Define GraphQL queries
const LOAD_ROLES = gql`
  query Roles {
    roles {
      id
      name
      description
      _modules {
        id
        title
        description
        route
        logo
      }
      permissions
    }
  }
`;

const LOAD_ROLE_MODULES = gql`
  query Role_modules($roleId: String!) {
    role_modules(role_id: $roleId) {
      id
      title
      description
      route
      logo
    }
  }
`;

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
  { id: "name", label: "Role", minWidth: 10 },
  { id: "description", numeric: false, label: "Description" },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
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
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function RolesTable() {
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const allRoles = useSelector(selectAllRoles);
  const selectedRole = useSelector(selectSelectedRole);

  const [
    loadRoleModules,
    { error: loadErr, loading: loadingModules, data: loadRes },
  ] = useLazyQuery(LOAD_ROLE_MODULES, {
    notifyOnNetworkStatusChange: true,
  });

  const { loading, error, data, refetch } = useQuery(LOAD_ROLES, {
    notifyOnNetworkStatusChange: true,
  });

  // Handle role data
  useEffect(() => {
    if (data?.roles) {
      console.log("Roles data:", data.roles); // Debug
      dispatch(setAllRoles(data.roles));
    }
  }, [data, dispatch]);

  // Handle role modules
  useEffect(() => {
    if (loadRes?.role_modules) {
      console.log("Role modules data:", loadRes.role_modules); // Debug
      dispatch(setRoleModules(loadRes.role_modules));
    }
  }, [loadRes, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("LOAD_ROLES Error:", error); // Debug
      dispatch(
        showMessage({
          message: `Failed to load roles: ${error.message}`,
          variant: "error",
        })
      );
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (loadErr) {
      console.error("LOAD_ROLE_MODULES Error:", loadErr); // Debug
      dispatch(
        showMessage({
          message: `Failed to load role modules: ${loadErr.message}`,
          variant: "error",
        })
      );
    }
  }, [loadErr, dispatch]);

  // Handle loading state for modules
  useEffect(() => {
    dispatch(setLoadingRoleModules(loadingModules));
  }, [loadingModules, dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleReload = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Refetch Error:", err);
      dispatch(
        showMessage({
          message: `Failed to reload roles: ${err.message}`,
          variant: "error",
        })
      );
    }
  };

  const handleCreateNewRole = () => {
    dispatch(setCreateRoleModalVisible(true));
  };

  const handleRowClick = async (event, row) => {
    console.log("Selected role ID:", row.id); // Debug
    dispatch(setSelectedRole(row));
    dispatch(
      setSelectedPermissions(row.permissions ? JSON.parse(row.permissions) : [])
    );
    try {
      await loadRoleModules({
        variables: {
          roleId: String(row.id), // Ensure string type
        },
      });
    } catch (err) {
      console.error("loadRoleModules Error:", err);
    }
  };

  const visibleRows = React.useMemo(
    () => stableSort(allRoles, getComparator(order, orderBy)),
    [order, orderBy, allRoles]
  );

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
          sx={{ backgroundColor: "#1e293b" }}
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
            style={{ color: "white" }}
          >
            Roles
          </Typography>
          <div style={{ display: "flex" }}>
            <Button
              color="default"
              size="small"
              style={{ color: "white", marginRight: 5 }}
              onClick={handleCreateNewRole}
              variant="text"
              icon={
                <Add
                  style={{ color: "white", fontSize: 25, cursor: "pointer" }}
                />
              }
            >
              Create New Role
            </Button>
            <Button
              color="default"
              size="small"
              style={{ color: "white" }}
              onClick={handleReload}
              variant="text"
              icon={
                <Refresh
                  style={{ color: "white", fontSize: 25, cursor: "pointer" }}
                />
              }
            >
              Reload
            </Button>
          </div>
        </Box>
        <div className="max-w-full relative">
          {error ? (
            <Box p={2} textAlign="center">
              <Typography color="error">
                Failed to load roles. Please try again.
              </Typography>
              <Button onClick={handleReload}>Retry</Button>
            </Box>
          ) : (
            <TableContainer
              sx={{
                maxHeight: "calc(100vh - 180px)",
                minHeight: "calc(100vh - 180px)",
              }}
            >
              <Table
                aria-labelledby="tableTitle"
                size="small"
                stickyHeader
                style={{ borderCollapse: "collapse", width: "100%" }}
                aria-label="sticky table"
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={allRoles.length}
                />
                <Backdrop
                  sx={{
                    color: "#fff",
                    position: "absolute",
                    left: 0,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={loading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isSelected = row.id === selectedRole?.id;
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleRowClick(event, row)}
                        key={row.id}
                        selected={isSelected}
                        sx={{ cursor: "pointer", fontSize: 13 }}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            whiteSpace: "nowrap",
                            textAlign: "left",
                            fontSize: 13,
                          }}
                        >
                          {row.name}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          style={{
                            border: "1px solid #ddd",
                            padding: "8px",
                            whiteSpace: "nowrap",
                            textAlign: "left",
                            fontSize: 13,
                          }}
                        >
                          {row.description}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </Card>
    </div>
  );
}

export default RolesTable;
