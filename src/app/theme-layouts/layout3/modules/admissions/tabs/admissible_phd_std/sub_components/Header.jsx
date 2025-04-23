import React, { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/client";
import { ADMIT_PHD_STDS } from "app/theme-layouts/layout3/graphql/mutations";
import { GET_ADMISSIBLE_PHD_STDS } from "app/theme-layouts/layout3/graphql/queries";

const options = ["Admit Students", "Export to excel", "Print Selected"];

const phdCols = [
  { id: "id", label: "#", minWidth: 10 },

  {
    id: "form_no",
    numeric: false,
    disablePadding: false,
    label: "Form Number",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },

  {
    id: "mobile_no",
    numeric: false,
    disablePadding: false,
    label: "Phone No",
  },
  {
    id: "prog_code",
    numeric: false,
    disablePadding: false,
    label: "Prog Code",
  },
  {
    id: "paid",
    numeric: false,
    disablePadding: false,
    label: "Paid",
  },
];

function Header({ selectedRows = [] }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  //   const [selectedRows, setSelectedRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [admissionModelVisible, setAdmissionModel] = useState(false);
  const [stdsToBeAdmitted, setStdsToBeAdmitted] = useState();
  const [scroll, setScroll] = React.useState("paper");
  const user = useSelector((state) => state.user.user);

  const [admitPhdStdsMutation, { error, loading, data: phdMutationResponse }] =
    useMutation(ADMIT_PHD_STDS, {
      refetchQueries: [GET_ADMISSIBLE_PHD_STDS],
    });

  if (error) {
    console.log("error---", error.message);
  }

  const handleClickActionBtn = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  function EnhancedTableHeadPhd(props) {
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
          {phdCols.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
              style={{
                // border: "1px solid #ddd",
                // padding: "8px",
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
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  const admitPhdStds = async () => {
    admitPhdStdsMutation({
      variables: stdsToBeAdmitted,
    }).then((res) => {
      setAdmissionModel(false);
      toast.success(res.data.admit_students.message);
      // console.log(res);
    });
    // structure the data am sending
    //   setPhdDialog(false);
    //   setSelectedRows([]);
    //   toast.success("Data sent successfully");
  };

  const onSelectItem = (index) => {
    if (index === 0) {
      // setPreviewOpen(true);
      //   dispatch(applicationPreviewOpened(true));
      // console.log("selected rows", selectedRows);
      if (selectedRows.length > 0) {
        // only those that are not yet admitted
        const requiredRows = selectedRows.filter(
          (row) => row.admitted == "false"
        );

        const stds = requiredRows.map((row) => {
          return {
            schemeId: row.scheme_id,
            applicantId: row.applicant_id,
            program_id: row.prog_choices[0].program.id,
          };
        });

        const sentData = {
          stds: stds,
          admittedBy: user.id,
        };

        if (stds.length > 0) {
          setAdmissionModel(true);
          setStdsToBeAdmitted(sentData);
        } else {
          toast.error(
            "No eligible students for admission have been identified"
          );
        }
        // console.log("am sending", sentData);
      } else {
        toast.error("No data found");
      }
    }
    if (index === 3) {
      //   setPhdDialog(true);
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    // console.log("event", options[event.target.value]);
    onSelectItem(index);
    // handleClickOpen('paper')
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const _rows = data ? data.applicant_forms : [];
      const newSelected = _rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, row) => {
    selectedRows.push(row);
    setSelectedRows([...selectedRows]);
    const selectedIndex = selected.indexOf(row.id);
    console.log("clicked__", row);
    setSelectedRow(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row.id);
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

  const handleMultipleRowSelect = (row) => {
    selectedRows.push(row);
    setSelectedRows([...selectedRows]);
  };

  const handleSelectionModelChange = (selectionModel) => {
    // Get the selected rows
    const selectedRowsData = selectionModel.map((selectedRow) =>
      data.applicant_forms.find((row) => row.id === selectedRow)
    );

    // Update the state with the selected rows
    setSelectedRows(selectedRowsData);

    // Update the row selection model state
    setRowSelectionModel(selectionModel);

    // Log the selected rows
    console.log("Selected Rows:", selectedRowsData);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  return (
    <>
      <Dialog
        open={admissionModelVisible}
        onClose={() => setAdmissionModel(false)}
        scroll={scroll}
        maxWidth="xl"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        style={{
          height: "calc(100vh - 50px)",
        }}
      >
        {selectedRows && (
          <>
            <DialogTitle id="scroll-dialog-title">
              ADMIT POSTGRADUATE STUDENTS
            </DialogTitle>
            <DialogContent dividers={scroll === "paper"}>
              <TableContainer sx={{ height: "calc(100vh - 360px)" }}>
                {/* {console.log("table data", data)} */}
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
                  <EnhancedTableHeadPhd
                    numSelected={selected.length}
                    order={order}
                    // orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={selectedRows}
                  />
                  <TableBody
                    style={{
                      position: "relative",
                    }}
                  >
                    {selectedRows.map((row, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row)}
                          // role="checkbox"
                          // aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
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
                          {/* <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              paddingLeft: 10,
                              textAlign: "left",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.created_on}
                          </TableCell> */}
                          <TableCell
                            align="right"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.form_no}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.surname + " " + row.other_names}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            {"+" + row.phone_no}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            {row.application_sent_details.program.course_code}
                          </TableCell>
                          <TableCell
                            align="right"
                            style={{
                              border: "1px solid #ddd",
                              // padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            {row.payments.length > 0 ? "YES" : "NO"}
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
            </DialogContent>
          </>
        )}
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          <Button onClick={admitPhdStds}>
            {loading ? (
              <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={{
                  color: "blue",
                  animationDuration: "550ms",
                }}
                size={18}
                thickness={6}
              />
            ) : (
              "ADMIT STUDENTS"
            )}
            {/* PUSH */}
          </Button>
        </DialogActions>
      </Dialog>
      <div
        style={{
          display: "flex",
          padding: 10,
          paddingLeft: 15,
          paddingRight: 15,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>Postgraduate applicants accademic year 2023/2024 FEB Intake</div>
        <div>
          <ButtonGroup
            variant="contained"
            ref={anchorRef}
            aria-label="split button"
          >
            <Button onClick={handleClickActionBtn}>{"Action"}</Button>
            <Button
              size="small"
              aria-controls={open ? "split-button-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-label="select merge strategy"
              aria-haspopup="menu"
              onClick={handleToggle}
            >
              <ArrowDropDownIcon />
            </Button>
          </ButtonGroup>
          <Popper
            sx={{
              zIndex: 9999, // Set a higher zIndex value
              position: "relative", // Set position to 'relative' or 'absolute' based on your layout
            }}
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            placement="top"
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                  zIndex: 990,
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList id="split-button-menu" autoFocusItem>
                      {options.map((option, index) => (
                        <MenuItem
                          key={option}
                          // disabled={index === 2}
                          selected={index === selectedIndex}
                          onClick={(event) => handleMenuItemClick(event, index)}
                        >
                          {option}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </>
  );
}

export default Header;
