import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import _ from "lodash";
import clsx from "clsx";
import { darken } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
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
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Add from "@mui/icons-material/Add";
import { Button, TextField, Tooltip } from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import Draggable from "react-draggable";
import Close from "@mui/icons-material/Close";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery, useMutation, NetworkStatus } from "@apollo/client";
import Backdrop from "@mui/material/Backdrop";
import {
  DELETE_GRADING_DETAIL,
  SAVE_GRADING,
  SAVE_GRADING_DETAILS,
} from "../../gql/mutations";
import {
  updateAddGradingSystemDetailsDialogOpen,
  updateDeleteDialogOpen,
  updateGrading,
  updateGradingDetails,
  updateGradingSystemDetails,
  updateGradingSystems,
  updateSelectedGradingDetail,
} from "../../store/gradingSystemSlice";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { showMessage } from "@fuse/core/FuseMessage/fuseMessageSlice";
import { GET_GRADING_SYSTEM_DETAILS } from "../../gql/queries";

const gradingSystemSchema = yup.object().shape({
  grading_title: yup.string().required("Grading title is required"),
  description: yup.string().required("Description is required"),
});

const gradingSystemDetailsSchema = yup.object().shape({
  min_value: yup.string().required("Minimum value is required"),
  max_value: yup.string().required("Maximum value is required"),
  grade_point: yup.string().required("Grade Point is required"),
  grade_letter: yup.string().required("Grade Letter is required"),
});

const defaultGradingValues = {
  id: null,
  grading_title: "",
  description: "",
};

const defaultGradingDetailsValues = {
  id: null,
  min_value: "",
  max_value: "",
  grade_point: "",
  grade_letter: "",
  added_by: "",
};

const rows = [
  {
    id: "1",
    min_value: 80,
    max_value: 100,
    grade_point: 5,
    grade_letter: "A",
  },
  {
    id: "2",
    min_value: 75,
    max_value: 79,
    grade_point: 4.5,
    grade_letter: "B+",
  },
  {
    id: "3",
    min_value: 70,
    max_value: 74,
    grade_point: 4,
    grade_letter: "B",
  },
  {
    id: "4",
    min_value: 80,
    max_value: 100,
    grade_point: 5,
    grade_letter: "A",
  },
  {
    id: "5",
    min_value: 75,
    max_value: 79,
    grade_point: 4.5,
    grade_letter: "B+",
  },
  {
    id: "6",
    min_value: 70,
    max_value: 74,
    grade_point: 4,
    grade_letter: "B",
  },
  {
    id: "7",
    min_value: 80,
    max_value: 100,
    grade_point: 5,
    grade_letter: "A",
  },
  {
    id: "8",
    min_value: 75,
    max_value: 79,
    grade_point: 4.5,
    grade_letter: "B+",
  },
  {
    id: "9",
    min_value: 70,
    max_value: 74,
    grade_point: 4,
    grade_letter: "B",
  },
  {
    id: "10",
    min_value: 80,
    max_value: 100,
    grade_point: 5,
    grade_letter: "A",
  },
  {
    id: "11",
    min_value: 75,
    max_value: 79,
    grade_point: 4.5,
    grade_letter: "B+",
  },
  {
    id: "12",
    min_value: 70,
    max_value: 74,
    grade_point: 4,
    grade_letter: "B",
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
  { id: "min_value", label: "Minimum Value", minWidth: 10 },
  {
    id: "max_value",
    numeric: false,
    // disablePadding: true,
    label: "Maximum Value",
  },
  {
    id: "grade_point",
    numeric: false,
    disablePadding: false,
    label: "Grade Point",
  },
  {
    id: "grade_letter",
    numeric: false,
    disablePadding: false,
    label: "Grade Letter",
  },
  {
    id: "action",
    numeric: false,
    disablePadding: false,
    label: "Action",
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
              // opacity: 0.7,
              fontSize: 13,
              position: headCell.label == "Action" ? "sticky" : "",
              right: headCell.label == "Action" ? 0 : "",
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

function GradingDetailsTable() {
  // load active user
  const user = useSelector((state) => state.user.user);

  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dense, setDense] = React.useState(false);

  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  const {
    grading,
    gradingSystemDetails,
    addGradingSystemDetailsDialogOpen,
    gradingDetails,
    selectedGradingDetail,
    deleteDialogOpen,
  } = useSelector((state) => state.grading);

  //query
  const [
    getGradingSystemDetails,
    {
      error: gradingSystemDetailsErr,
      loading: fetchingGradingDetails,
      data,
      refetch,
      networkStatus,
    },
  ] = useLazyQuery(GET_GRADING_SYSTEM_DETAILS, {
    notifyOnNetworkStatusChange: true,
  });

  if (gradingSystemDetailsErr) {
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

  const [
    saveGradingDetails,
    {
      error: savingDetailErr,
      loading: savingGradingDetails,
      data: saveDetailResponse,
    },
  ] = useMutation(SAVE_GRADING_DETAILS, {
    refetchQueries: ["Grading_details"],
  });

  const [
    deleteGradingDetail,
    {
      error: deleteGradingDetailErr,
      loading: deletingGradingDetail,
      data: deleteGradingDetailResponse,
    },
  ] = useMutation(DELETE_GRADING_DETAIL);

  if (savingDetailErr) {
    dispatch(
      showMessage({
        message:
          "Failed to save grading details, contact the admin for help! " +
          savingDetailErr, //text or html
        variant: "error", //success error info warning null
      })
    );
  }

  if (deleteGradingDetailErr) {
    dispatch(
      showMessage({
        message:
          "Failed to deleting grading details, contact the admin for help! " +
          deleteGradingDetailErr, //text or html
        variant: "error", //success error info warning null
      })
    );
  }

  const {
    control: gradingSystemControl,
    formState: gradingSystemFormState,
    handleSubmit: handleSubmitGrade,
    reset: resetGradingSystem,
    setError: gradingSystemFormErr,
    setValue: setGradingValue,
  } = useForm({
    mode: "onChange",
    defaultValues: defaultGradingValues,
    resolver: yupResolver(gradingSystemSchema),
  });

  const { control, formState, handleSubmit, reset, setError, setValue } =
    useForm({
      mode: "onChange",
      defaultValues: defaultGradingDetailsValues,
      resolver: yupResolver(gradingSystemDetailsSchema),
    });

  const { isValid, dirtyFields, errors } = formState;

  const fetchGradingDetails = async () => {
    const res = await getGradingSystemDetails({
      variables: {
        gradingId: grading.id,
      },
    });

    dispatch(updateGradingSystemDetails(res.data.grading_details));

    // console.log("response", res.data);
  };

  useEffect(() => {
    setGradingValue("id", grading.id);
    setGradingValue("grading_title", grading.grading_title);
    setGradingValue("description", grading.description);
    if (grading.id) {
      fetchGradingDetails();
    }
  }, [grading]);

  useEffect(() => {
    setValue("id", gradingDetails.id);
    setValue("min_value", gradingDetails.min_value);
    setValue("max_value", gradingDetails.max_value);
    setValue("grade_point", gradingDetails.grade_point);
    setValue("grade_letter", gradingDetails.grade_letter);
  }, [gradingDetails]);

  const {
    isValid: isFieldValid,
    dirtyFields: gradingDirtyFields,
    errors: gradingErrors,
  } = gradingSystemFormState;

  const handleClickOpen = () => {
    // setOpen(true);
    if (grading.id) {
      dispatch(updateAddGradingSystemDetailsDialogOpen(true));
      dispatch(updateGradingDetails(defaultGradingDetailsValues));
    } else {
      dispatch(
        showMessage({
          message: "Please first slect a grading system on the left!", //text or html
          variant: "error", //success error info warning null
        })
      );
    }
  };

  const handleClose = () => {
    // setOpen(false);
    dispatch(updateAddGradingSystemDetailsDialogOpen(false));
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
    // console.log("payload", payload);

    const res = await saveGrading({
      variables: payload,
    });

    // console.log("the data", data);
    // console.log("the response", res);

    dispatch(updateGradingSystems(res.data.saveGrading));

    // resetGradingSystem(defaultGradingValues);
    // dispatch(updateGrading(defaultGradingValues));

    dispatch(
      showMessage({
        message: "Grading updated Succesfully",
        variant: "info",
      })
    );
  }

  async function onSubmitGradingSystemDetails({
    id,
    min_value,
    max_value,
    grade_point,
    grade_letter,
  }) {
    let payload = {
      gradingId: grading.id,
      minValue: parseFloat(min_value),
      maxValue: parseFloat(max_value),
      gradePoint: parseFloat(grade_point),
      gradeLetter: grade_letter,
      addedBy: user.biodata.id,
    };
    // console.log("payload", payload);

    if (id) {
      payload = { ...payload, saveGradingDetailsId: id };
    }

    const res = await saveGradingDetails({
      variables: payload,
    });

    // console.log("the data", data);
    // console.log("the response", res.data);

    dispatch(updateGradingSystemDetails(res.data.saveGradingDetails));

    reset(defaultGradingDetailsValues);
    dispatch(updateGradingDetails(defaultGradingDetailsValues));

    dispatch(
      showMessage({
        message: "Grading Detail saved Succesfully",
        variant: "info",
      })
    );
  }

  const handleDelete = async () => {
    console.log("delete", selectedGradingDetail);
    dispatch(updateDeleteDialogOpen(false));

    const res = await deleteGradingDetail({
      variables: {
        gradingDetailId: selectedGradingDetail.id,
        gradingId: grading.id,
      },
    });

    dispatch(updateGradingSystemDetails(res.data.deleteGradingDetail));

    dispatch(
      showMessage({
        message: "Grading deleted Succesfully",
        variant: "info",
      })
    );
    // setOpen(false);
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort(gradingSystemDetails, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, gradingSystemDetails]
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
            Grading System Details
          </Typography>
          <div
            style={{
              display: "flex",
            }}
          >
            <Tooltip title="Add New Row">
              <Add
                onClick={handleClickOpen}
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
                  const res = await refetch();
                  // console.log("refetch...", res.data);
                  dispatch(
                    updateGradingSystemDetails(res.data.grading_details)
                  );
                  // if (networkStatus === NetworkStatus.refetch) {
                  //   console.log("Refetching...", data);
                  // }
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
        <div
          style={{
            padding: 15,
            display: "flex",
            // backgroundColor: "lightblue",
          }}
        >
          <form
            name="updateGradingForm"
            noValidate
            // className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmitGrade(onSubmit)}
            style={{
              display: "flex",
            }}
          >
            <Controller
              name="grading_title"
              control={gradingSystemControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Grading Title"
                  id="outlined-size-small"
                  // placeholder="Grading Title"
                  error={!!gradingErrors.grading_title}
                  style={{
                    paddingBottom: 15,
                    width: 200,
                    marginRight: 10,
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
              control={gradingSystemControl}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  id="outlined-size-small"
                  // placeholder="Description"
                  error={!!gradingErrors.description}
                  style={{
                    paddingBottom: 15,
                    width: 300,
                    marginRight: 10,
                  }}
                  // value={formState.college_code}
                  // onChange={e => setFormState({...formState, college_code: e.target.value})}
                  // defaultValue="Small"
                  required
                  size="small"
                />
              )}
            />

            <div>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={_.isEmpty(gradingDirtyFields) || !isFieldValid}
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
                  "Update"
                )}
              </Button>
            </div>
          </form>
        </div>

        <div className="max-w-full relative">
          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 315px)",
              minHeight: "calc(100vh - 315px)",
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
                open={fetchingGradingDetails || deletingGradingDetail}
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
                        {row.min_value}
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
                        {row.max_value}
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
                        {row.grade_point}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          border: "1px solid #ddd",
                          // padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        {row.grade_letter}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          // padding: "8px",
                          textAlign: "left",
                          border: "1px solid #ddd",
                          backgroundColor: "white",
                          position: "sticky",
                          zIndex: 1,
                          right: 0,
                        }}
                      >
                        <Tooltip title="Edit">
                          <Edit
                            onClick={() => {
                              // console.log("dpt", row);
                              dispatch(updateGradingDetails(row));
                              dispatch(
                                updateAddGradingSystemDetailsDialogOpen(true)
                              );
                            }}
                            style={{
                              color: "blue",
                              fontSize: 18,
                              marginRight: 5,
                            }}
                          />
                        </Tooltip>

                        <Tooltip title="Delete">
                          <Delete
                            onClick={() => {
                              dispatch(updateDeleteDialogOpen(true));
                              dispatch(updateSelectedGradingDetail(row));
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
        </div>

        <div
          style={{
            padding: 5,
            // backgroundColor: "lightgray",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="contained" onClick={handleClickOpen}>
            {"Add New Row"}
          </Button>
        </div>
      </Card>

      <Dialog
        maxWidth="xs"
        open={addGradingSystemDetailsDialogOpen}
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
              {gradingDetails.id ? "Edit Row" : "Add New Row"}
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
                name="gradingDetailsForm"
                noValidate
                // className="flex flex-col justify-center w-full mt-32"
                onSubmit={handleSubmit(onSubmitGradingSystemDetails)}
              >
                <Controller
                  name="min_value"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Minimum Value"
                      id="outlined-size-small"
                      error={!!errors.min_value}
                      type="number"
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
                  name="max_value"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Maximum Value"
                      id="outlined-size-small"
                      error={!!errors.max_value}
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
                  name="grade_point"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Grade Point"
                      type="number"
                      id="outlined-size-small"
                      error={!!errors.grade_point}
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
                  name="grade_letter"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Grade Letter"
                      id="outlined-size-small"
                      error={!!errors.grade_letter}
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
                    {savingGradingDetails ? (
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
          {"Delete Grading"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description text-16"
            style={{
              fontSize: 15,
            }}
          >
            Are you sure you want to delete the grading?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            size="large"
            onClick={() => dispatch(updateDeleteDialogOpen(false))}
          >
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

export default GradingDetailsTable;
