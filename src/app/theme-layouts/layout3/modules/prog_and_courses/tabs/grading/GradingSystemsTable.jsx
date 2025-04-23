import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
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
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import Tooltip from "@mui/material/Tooltip";
import Close from "@mui/icons-material/Close";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAddGradingSystemDialogOpen,
  updateGrading,
  updateGradingSystems,
} from "../../store/gradingSystemSlice";
import * as yup from "yup";
import { useQuery, NetworkStatus, useMutation } from "@apollo/client";
import { GET_GRADING_SYSTEMS } from "../../gql/queries";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { SAVE_GRADING } from "../../gql/mutations";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  grading_title: yup.string().required("Grading title is required"),
  description: yup.string().required("Description is required"),
});

const defaultValues = {
  id: null,
  grading_title: "",
  description: "",
};

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
  { id: "grading_id", label: "Grading ID", minWidth: 10 },
  {
    id: "description",
    numeric: false,
    // disablePadding: true,
    label: "Description",
  },
];

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
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

function GradingSystemsTable() {
  const [selected, setSelected] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState(null); //
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dense, setDense] = React.useState(false);

  // load active user
  const user = useSelector((state) => state.user.user);

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    });

  const { isValid, dirtyFields, errors } = formState;

  const dispatch = useDispatch();

  // query
  const { error, loading, data, refetch, networkStatus } = useQuery(
    GET_GRADING_SYSTEMS,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  if (error) {
    dispatch(
      showMessage({
        message: "Failed to fetch grading systems", //text or html
        variant: "error", //success error info warning null
      })
    );
  }

  // mutation
  const [
    saveGrading,
    {
      error: saveGradingERR,
      loading: savingGrading,
      data: saveGradingResponse,
    },
  ] = useMutation(SAVE_GRADING, {
    refetchQueries: ["getGradingSystems"],
  });

  if (saveGradingERR) {
    dispatch(
      showMessage({
        message: "Failed to save grading systems", //text or html
        variant: "error", //success error info warning null
      })
    );
  }

  useEffect(() => {
    if (data) {
      // console.log("data", data);
      dispatch(updateGradingSystems(data.grading));
    }
  }, [data]);

  const { addGradingSystemDialogOpen, gradingSystems, grading } = useSelector(
    (state) => state.grading
  );

  const handleClickOpen = () => {
    dispatch(updateAddGradingSystemDialogOpen(true));
    // setOpen(true);
  };

  const handleClose = () => {
    dispatch(updateAddGradingSystemDialogOpen(false));
    // setOpen(false);
  };

  const handleRowClick = (event, row) => {
    // setSelectedRow(row.id); // Update selected row index
    // console.log("row", row);
    dispatch(updateGrading(row));
  };

  async function onSubmit({ id, grading_title, description }) {
    let payload = {
      gradingTitle: grading_title,
      description,
      addedBy: user.biodata.id,
    };

    if (id) {
      payload = { ...payload, saveGradingId: id };
    }

    const res = await saveGrading({
      variables: payload,
    });

    // console.log("the data", data);
    // console.log("the response", res);

    dispatch(updateGradingSystems(res.data.saveGrading));

    reset(defaultValues);
    dispatch(updateGrading(defaultValues));

    // close the dialog box
    handleClose();

    dispatch(
      showMessage({
        message: "Grading Saved Succesfully",
        variant: "info",
      })
    );
  }

  const visibleRows = React.useMemo(
    () =>
      stableSort(gradingSystems, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, gradingSystems]
  );

  // console.log("grading...", gradingSystems);

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
            Grading Systems
          </Typography>

          <div
            style={{
              display: "flex",
            }}
          >
            <Tooltip title="Create new grading system">
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
            </Tooltip>

            <Tooltip title="Reload">
              <Refresh
                onClick={async () => {
                  await refetch();
                  console.log("refetch...");
                  if (networkStatus === NetworkStatus.refetch) {
                    console.log("Refetching...");
                  }
                }}
                fontSize=""
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
                  // const isItemSelected = isSelected(row.id);
                  const isSelected = row.id === grading.id;
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
                        {row.grading_title}
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

      <Dialog
        maxWidth="xs"
        open={addGradingSystemDialogOpen}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
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
            id="draggable-dialog-title"
            style={{
              paddingLeft: 15,
              display: "flex",
              justifyContent: "space-between",
              cursor: "move",
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
              Create New Grading System
            </Typography>

            <Tooltip title="Close">
              <Close
                style={{
                  color: "white",
                  fontSize: 25,
                  cursor: "pointer",
                  //  marginRight: 10,
                }}
                onClick={() => {
                  // dispatch(updateDepartment(defaultValues));
                  handleClose();
                }}
              />
            </Tooltip>
          </Box>
          <div className="max-w-full relative">
            <Box
              // component="form"
              sx={{
                "& .MuiTextField-root": { m: 0, width: "100%" },
              }}
              autoComplete="off"
              className={"max-w-full"}
              style={{
                padding: 15,
                //   backgroundColor: "red",
              }}
            >
              <form
                name="gradingForm"
                noValidate
                // className="flex flex-col justify-center w-full mt-32"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Controller
                  name="grading_title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Grading Title"
                      id="outlined-size-small"
                      error={!!errors.grading_title}
                      style={{
                        paddingBottom: 15,
                      }}
                      // value={formState.college_code}
                      // onChange={e => setFormState({...formState, college_code: e.target.value})}
                      // defaultValue="Small"
                      required
                      size="small"
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      id="outlined-size-small"
                      error={!!errors.description}
                      style={{
                        paddingBottom: 15,
                      }}
                      // value={formState.college_code}
                      // onChange={e => setFormState({...formState, college_code: e.target.value})}
                      // defaultValue="Small"
                      required
                      size="small"
                    />
                  )}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                    style={{
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {savingGrading ? (
                      <CircularProgress
                        variant="indeterminate"
                        disableShrink
                        sx={{
                          color: "#fff",
                          animationDuration: "550ms",
                        }}
                        size={18}
                        thickness={6}
                      />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </form>
            </Box>
          </div>
        </Card>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}

export default GradingSystemsTable;
